#![no_std]
use soroban_sdk::{
    contract, contractimpl, log, symbol_short, token, vec, Address, Env, String, Symbol, Vec,
};

mod data_structures;
mod error;
mod storage_key;

use error::Error;
// use storage_key::StorageKey;

use crate::{
    data_structures::{Purchase, Sample},
    storage_key::StorageKey,
};

const ALL_SAMPLES_KEY: Symbol = symbol_short!("A_SAMPLES");
const PLATFORM_FEE_KEY: Symbol = symbol_short!("P_FEE");
const TOTAL_SAMPLES_KEY: Symbol = symbol_short!("T_SAMPLES");
const PLATFORM_ADDRESS_KEY: Symbol = symbol_short!("P_ADDRESS");
const TOTAL_VOLUME_KEY: Symbol = symbol_short!("T_VOLUME");
const PAYMENT_TOKEN_KEY: Symbol = symbol_short!("PAY_TOKEN");

/// Split positive token base units: floor the platform's percentage, credit all remaining units to the seller.
fn split_revenue(price: i128, platform_fee: u32) -> (i128, i128) {
    let platform_amount = (price * i128::from(platform_fee)) / 100;
    (platform_amount, price - platform_amount)
}

#[cfg(test)]
mod revenue_split_tests {
    use super::split_revenue;

    #[test]
    fn the_platform_share_rounds_down_and_totals_conserve_units() {
        for price in [1_i128, 9, 11, 101, 10_000_001, 19_999_999] {
            let (platform, seller) = split_revenue(price, 10);
            assert_eq!(platform + seller, price);
            assert_eq!(platform, price / 10);
        }
        assert_eq!(split_revenue(10_000_001, 10), (1_000_000, 9_000_001));
    }
}

#[contract]
pub struct Sampled {}

#[contractimpl]
impl Sampled {
    pub fn __constructor(
        env: Env,
        platform_fee: u32,
        platform_address: Address,
        payment_token: Address,
    ) {
        let storage = env.storage().instance();
        if storage.has(&PLATFORM_ADDRESS_KEY) {
            panic!("Contract already exists");
        }

        storage.set(&PAYMENT_TOKEN_KEY, &payment_token);

        storage.set(&PLATFORM_ADDRESS_KEY, &platform_address);
        storage.set(&PLATFORM_FEE_KEY, &platform_fee);
        storage.set(&TOTAL_SAMPLES_KEY, &0u32);
        storage.set(&TOTAL_VOLUME_KEY, &0i128);

        log!(
            &env,
            "Sample contract deployed with {}% plaform fee",
            platform_fee
        );
    }

    /// UPLOAD a sample
    pub fn upload_sample(
        env: Env,
        seller: Address,
        price: i128,
        ipfs_link: String,
        title: String,
        bpm: u32,
        genre: String,
        cover_image: String,
    ) -> u32 {
        let storage = env.storage().persistent();
        seller.require_auth();

        if price <= 0 {
            panic!("Price cannot be {}", price)
        }

        let mut total_samples: u32 = storage.get(&TOTAL_SAMPLES_KEY).unwrap_or(0);

        let sample = Sample {
            seller: seller.clone(),
            price,
            ipfs_link: ipfs_link.clone(),
            title: title.clone(),
            bpm,
            genre: genre.clone(),
            id: total_samples,
            total_sales: 0u32,
            is_active: true,
            cover_image: cover_image.clone(),
        };

        storage.set(&total_samples, &sample);

        // Add to all samples
        let mut all_samples: Vec<Sample> = storage.get(&ALL_SAMPLES_KEY).unwrap_or(vec![&env]);
        all_samples.push_front(sample.clone());
        storage.set(&ALL_SAMPLES_KEY, &all_samples);
        storage.extend_ttl(
            &ALL_SAMPLES_KEY,
            env.storage().max_ttl(),
            env.storage().max_ttl(),
        );

        let mut user_samples: Vec<Sample> = storage.get(&seller).unwrap_or(vec![&env]);
        user_samples.push_front(sample.clone());

        storage.set(&seller, &user_samples);
        storage.extend_ttl(&seller, env.storage().max_ttl(), env.storage().max_ttl());
        total_samples += 1;
        storage.set(&TOTAL_SAMPLES_KEY, &total_samples);
        storage.extend_ttl(
            &TOTAL_SAMPLES_KEY,
            env.storage().max_ttl(),
            env.storage().max_ttl(),
        );

        total_samples - 1
    }

    /// GET a sample
    pub fn get_sample(env: Env, sample_id: u32) -> Result<Sample, Error> {
        let storage = env.storage().persistent();
        let sample_opt: Option<Sample> = storage.get(&sample_id);
        match sample_opt {
            Some(value) => Ok(value),
            None => Err(Error::SampleNotFound),
        }
    }

    /// UPDATE a sample price
    pub fn update_price(
        env: Env,
        new_price: i128,
        sample_id: u32,
        seller: Address,
    ) -> Result<(), Error> {
        seller.require_auth();
        let storage = env.storage().persistent();
        let sample: Option<Sample> = storage.get(&sample_id);
        match sample {
            Some(mut value) => {
                if seller != value.seller {
                    return Err(Error::NotAuthorized);
                }

                if new_price <= 0 {
                    return Err(Error::InvalidPrice);
                }
                value.price = new_price;
                storage.set(&sample_id, &value);
            }
            None => {
                panic!("Sample not found")
            }
        };

        Ok(())
    }

    /// GET user samples
    pub fn get_user_samples(env: Env, user_address: Address) -> Vec<Sample> {
        env.storage()
            .persistent()
            .get(&user_address)
            .unwrap_or(vec![&env])
    }

    pub fn get_all_samples(env: Env) -> Vec<Sample> {
        env.storage()
            .persistent()
            .get(&ALL_SAMPLES_KEY)
            .unwrap_or(vec![&env])
    }

    // Purchase a sample
    pub fn purchase_sample(env: Env, buyer: Address, sample_id: u32) -> Result<String, Error> {
        // Authenticate the buyer
        buyer.require_auth();

        // Get the sample
        let mut sample: Sample = env
            .storage()
            .persistent()
            .get(&sample_id)
            .ok_or(Error::SampleNotFound)?;

        // Check if sample is active
        if !sample.is_active {
            return Err(Error::SampleNotFound);
        }

        // Check if already purchased
        if env
            .storage()
            .persistent()
            .has(&StorageKey::Purchase(buyer.clone(), sample_id))
        {
            return Err(Error::AlreadyPurchased);
        }

        // Get platform fee percentage
        let platform_fee: u32 = env
            .storage()
            .instance()
            .get(&PLATFORM_FEE_KEY)
            .unwrap_or(10);

        // Split smallest token units, rounding down the platform fee.
        let (platform_amount, seller_amount) = split_revenue(sample.price, platform_fee);

        // Get platform address
        let platform_address: Address =
            env.storage().instance().get(&PLATFORM_ADDRESS_KEY).unwrap();

        // Transfer payment from buyer to contract
        let xlm_token = token::Client::new(&env, &get_payment_token(&env));
        xlm_token.transfer(&buyer, &env.current_contract_address(), &sample.price);

        // Update seller earnings
        let mut seller_earnings: i128 = env
            .storage()
            .persistent()
            .get(&StorageKey::Earnings(sample.seller.clone()))
            .unwrap_or(0);
        seller_earnings += seller_amount;
        env.storage().persistent().set(
            &StorageKey::Earnings(sample.seller.clone()),
            &seller_earnings,
        );

        // Update platform earnings
        let mut platform_earnings: i128 = env
            .storage()
            .persistent()
            .get(&StorageKey::Earnings(platform_address.clone()))
            .unwrap_or(0);
        platform_earnings += platform_amount;
        env.storage()
            .persistent()
            .set(&StorageKey::Earnings(platform_address), &platform_earnings);

        // Create purchase record
        let purchase = Purchase {
            buyer: buyer.clone(),
            sample_id,
            price_paid: sample.price,
            timestamp: env.ledger().timestamp(),
        };

        // Store purchase
        env.storage()
            .persistent()
            .set(&StorageKey::Purchase(buyer.clone(), sample_id), &purchase);

        // Add to buyer's purchases
        let mut user_purchases: Vec<Sample> = env
            .storage()
            .persistent()
            .get(&StorageKey::UserPurchases(buyer.clone()))
            .unwrap_or(vec![&env]);
        user_purchases.push_back(sample.clone());
        env.storage()
            .persistent()
            .set(&StorageKey::UserPurchases(buyer.clone()), &user_purchases);

        // Update sample sales count
        sample.total_sales += 1;
        env.storage().persistent().set(&sample_id, &sample);

        // Update total volume
        let mut total_volume: i128 = env.storage().instance().get(&TOTAL_VOLUME_KEY).unwrap_or(0);
        total_volume += sample.price;
        env.storage()
            .instance()
            .set(&TOTAL_VOLUME_KEY, &total_volume);

        log!(
            &env,
            "Sample {} purchased by {} for {} stroops",
            sample_id,
            buyer,
            sample.price
        );

        // Return IPFS link for download
        Ok(sample.ipfs_link)
    }

    /// GET the immutable purchase receipt for a buyer and sample.
    pub fn get_purchase(env: Env, buyer: Address, sample_id: u32) -> Result<Purchase, Error> {
        env.storage()
            .persistent()
            .get(&StorageKey::Purchase(buyer, sample_id))
            .ok_or(Error::SampleNotFound)
    }

    // Get user's purchased samples
    pub fn get_user_purchases(env: Env, buyer: Address) -> Vec<Sample> {
        env.storage()
            .persistent()
            .get(&StorageKey::UserPurchases(buyer))
            .unwrap_or(vec![&env])
    }

    // Check if user has purchased a sample
    pub fn has_purchased(env: Env, buyer: Address, sample_id: u32) -> bool {
        env.storage()
            .persistent()
            .has(&StorageKey::Purchase(buyer, sample_id))
    }

    // Withdraw earnings
    pub fn withdraw_earnings(env: Env, user: Address) -> Result<i128, Error> {
        // Authenticate the user
        user.require_auth();

        // Get user's earnings
        let earnings: i128 = env
            .storage()
            .persistent()
            .get(&StorageKey::Earnings(user.clone()))
            .unwrap_or(0);

        if earnings <= 0 {
            return Ok(0);
        }

        // Transfer earnings to user
        let xlm_token = token::Client::new(&env, &get_payment_token(&env));
        xlm_token.transfer(&env.current_contract_address(), &user, &earnings);

        // Reset user's earnings
        env.storage()
            .persistent()
            .set(&StorageKey::Earnings(user.clone()), &0i128);

        log!(&env, "User {} withdrew {} stroops", user, earnings);

        Ok(earnings)
    }

    // Get platform stats
    pub fn get_stats(env: Env) -> (u32, i128) {
        let total_samples = env
            .storage()
            .instance()
            .get(&StorageKey::TotalSamples)
            .unwrap_or(0);
        let total_volume = env
            .storage()
            .instance()
            .get(&StorageKey::TotalVolume)
            .unwrap_or(0);
        (total_samples, total_volume)
    }

    // Get user's earnings balance
    pub fn get_earnings(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&StorageKey::Earnings(user))
            .unwrap_or(0)
    }
}

// Helper function to get XLM token address
fn _get_xlm_token_address(env: &Env) -> Address {
    // On testnet, use the native token address
    // This is a placeholder - replace with actual XLM token address for your network
    Address::from_string(&String::from_str(
        env,
        "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    ))
}

fn get_payment_token(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&PAYMENT_TOKEN_KEY)
        .expect("Payment token not set")
}


// Contract receipt roundtrip: price_paid and timestamp remain readable.
#[cfg(test)]
mod purchase_receipt_tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn stored_purchase_preserves_price_paid_and_timestamp() {
        let env = Env::default();
        let platform = Address::generate(&env);
        let token = Address::generate(&env);
        let buyer = Address::generate(&env);
        let contract_id = env.register(Sampled, (10u32, platform, token));
        let sample_id = 7u32;
        let purchase = Purchase {
            buyer: buyer.clone(),
            sample_id,
            price_paid: 125_000_i128,
            timestamp: 1_731_000_000u64,
        };

        env.as_contract(&contract_id, || {
            env.storage()
                .persistent()
                .set(&StorageKey::Purchase(buyer.clone(), sample_id), &purchase);

            let stored = Sampled::get_purchase(env.clone(), buyer.clone(), sample_id).unwrap();
            assert_eq!(stored.buyer, buyer);
            assert_eq!(stored.sample_id, sample_id);
            assert_eq!(stored.price_paid, 125_000_i128);
            assert_eq!(stored.timestamp, 1_731_000_000u64);
        });
    }
}
