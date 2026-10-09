#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{storage::Persistent, Address as _, Ledger as _},
    Address, Env, String,
};

fn fixture() -> (Env, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let seller = Address::generate(&env);
    let other = Address::generate(&env);
    let platform = Address::generate(&env);
    let payment_token = Address::generate(&env);
    let contract = env.register(
        Sampled,
        SampledArgs::__constructor(&10_u32, &platform, &payment_token),
    );
    (env, contract, seller, other)
}

fn create_sample(env: &Env, contract: &Address, seller: &Address) -> u32 {
    SampledClient::new(env, contract).upload_sample(
        seller,
        &1_000_i128,
        &String::from_str(env, "ipfs://sample"),
        &String::from_str(env, "Sample"),
        &120_u32,
        &String::from_str(env, "house"),
        &String::from_str(env, "ipfs://art"),
    )
}

#[test]
fn only_the_seller_can_delist_and_relist_and_purchases_return_the_inactive_error() {
    let (env, contract, seller, other) = fixture();
    let client = SampledClient::new(&env, &contract);
    let id = create_sample(&env, &contract, &seller);

    assert!(client.get_sample(&id).unwrap().is_active);
    client.set_active(&id, &false, &seller);
    assert!(!client.get_sample(&id).unwrap().is_active);
    assert!(!client.get_all_samples().get(0).unwrap().is_active);
    assert!(!client.get_user_samples(&seller).get(0).unwrap().is_active);

    // A separately authenticated address is still not the sample seller.
    assert!(matches!(
        client.try_set_active(&id, &true, &other),
        Err(Ok(Error::NotAuthorized))
    ));
    assert!(matches!(
        client.try_purchase_sample(&other, &id),
        Err(Ok(Error::SampleNotActive))
    ));

    client.set_active(&id, &true, &seller);
    assert!(client.get_sample(&id).unwrap().is_active);
    assert!(client.get_all_samples().get(0).unwrap().is_active);
}

#[test]
fn update_price_rejects_inactive_listings_and_refreshes_ttl_when_active() {
    let (env, contract, seller, other) = fixture();
    let client = SampledClient::new(&env, &contract);
    let id = create_sample(&env, &contract, &seller);

    client.set_active(&id, &false, &seller);
    assert!(matches!(
        client.try_update_price(&2_000_i128, &id, &seller),
        Err(Ok(Error::SampleNotActive))
    ));
    assert_eq!(client.get_sample(&id).unwrap().price, 1_000_i128);

    client.set_active(&id, &true, &seller);
    assert!(matches!(
        client.try_update_price(&2_000_i128, &id, &other),
        Err(Ok(Error::NotAuthorized))
    ));
    assert!(matches!(
        client.try_update_price(&0_i128, &id, &seller),
        Err(Ok(Error::InvalidPrice))
    ));

    // Let some persistent rent lifetime elapse before checking the refresh.
    let sequence = env.ledger().sequence();
    env.ledger().set_sequence_number(sequence + 10);
    let before = env.as_contract(&contract, || {
        env.storage().persistent().get_ttl(&id)
    });

    client.update_price(&2_000_i128, &id, &seller);
    let after = env.as_contract(&contract, || {
        env.storage().persistent().get_ttl(&id)
    });
    assert!(after > before);
    assert_eq!(client.get_sample(&id).unwrap().price, 2_000_i128);
    assert_eq!(client.get_all_samples().get(0).unwrap().price, 2_000_i128);
    assert_eq!(client.get_user_samples(&seller).get(0).unwrap().price, 2_000_i128);
}
