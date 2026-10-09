//! Regression for checks-effects-interactions in withdraw_earnings.
//!
//! A constructor-supplied token contract deliberately attempts to reenter the
//! marketplace during payout. Current Soroban hosts may reject contract
//! reentry themselves; the withdrawal must still transfer at most once and
//! keep its recorded balance cleared afterward.

use super::*;
use soroban_sdk::testutils::Address as _;

const TARGET: Symbol = symbol_short!("TARGET");
const PAYOUTS: Symbol = symbol_short!("PAYOUTS");

#[contract]
struct ReentryProbeToken;

#[contractimpl]
impl ReentryProbeToken {
    pub fn set_target(env: Env, target: Address) {
        env.storage().instance().set(&TARGET, &target);
    }

    pub fn payouts(env: Env) -> u32 {
        env.storage().instance().get(&PAYOUTS).unwrap_or(0)
    }

    // Implements the same callable transfer signature as token::Client.
    pub fn transfer(env: Env, from: Address, to: Address, _amount: i128) {
        let market: Address = env.storage().instance().get(&TARGET).unwrap();

        // A seller payout transfers from the marketplace; initial purchases
        // transfer from the buyer, and must not trigger the attack callback.
        if from == market {
            let count: u32 = env.storage().instance().get(&PAYOUTS).unwrap_or(0);
            env.storage().instance().set(&PAYOUTS, &(count + 1));

            // Attempt same-contract reentry while the external token transfer
            // is in progress. Soroban may reject this at host level. If the
            // host permits it in the future, CEI makes the nested call a
            // zero-balance no-op rather than an additional token transfer.
            let _ = SampledClient::new(&env, &market).try_withdraw_earnings(&to);
        }
    }
}

#[test]
fn withdrawal_does_not_pay_twice_when_token_attempts_reentry() {
    let env = Env::default();
    env.mock_all_auths_allowing_non_root_auth();

    let seller = Address::generate(&env);
    let buyer = Address::generate(&env);
    let platform = Address::generate(&env);
    let token_id = env.register(ReentryProbeToken, ());
    let market_id = env.register(Sampled, (0u32, platform, token_id.clone()));
    let token = ReentryProbeTokenClient::new(&env, &token_id);
    token.set_target(&market_id);

    let market = SampledClient::new(&env, &market_id);
    let sample = market.upload_sample(
        &seller,
        &100_i128,
        &String::from_str(&env, "ipfs://sample"),
        &String::from_str(&env, "Sample"),
        &120_u32,
        &String::from_str(&env, "House"),
        &String::from_str(&env, "ipfs://cover"),
    );

    market.purchase_sample(&buyer, &sample);
    assert_eq!(market.get_earnings(&seller), 100_i128);
    assert_eq!(token.payouts(), 0);

    market.withdraw_earnings(&seller);
    assert_eq!(token.payouts(), 1);
    assert_eq!(market.get_earnings(&seller), 0_i128);

    // A subsequent withdrawal must not make another external transfer.
    market.withdraw_earnings(&seller);
    assert_eq!(token.payouts(), 1);
}
