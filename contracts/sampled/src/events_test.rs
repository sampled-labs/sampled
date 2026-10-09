use crate::{Sampled, SampledClient};
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, Events as _},
    token, Address, Env, IntoVal, Map, String, Symbol, Val, Vec,
};

#[test]
fn purchase_emits_indexable_receipt_with_settled_amounts() {
    let env = Env::default();
    env.mock_all_auths();

    let issuer = Address::generate(&env);
    let seller = Address::generate(&env);
    let buyer = Address::generate(&env);
    let platform = Address::generate(&env);
    let sac = env.register_stellar_asset_contract_v2(issuer);
    let token_address = sac.address();
    let token_admin = token::StellarAssetClient::new(&env, &token_address);
    token_admin.mint(&buyer, &1_000);

    let contract_address = env.register(Sampled, (&10u32, &platform, &token_address));
    let client = SampledClient::new(&env, &contract_address);

    let sample_id = client.upload_sample(
        &seller,
        &100,
        &String::from_str(&env, "ipfs://sample-1"),
        &String::from_str(&env, "Demo sample"),
        &120u32,
        &String::from_str(&env, "electronic"),
        &String::from_str(&env, "ipfs://cover-1"),
    );
    client.purchase_sample(&buyer, &sample_id);

    let topics: Vec<Val> = (
        symbol_short!("sample"),
        symbol_short!("purchased"),
        sample_id,
        buyer.clone(),
    )
        .into_val(&env);
    let data: Val = Map::<Symbol, Val>::from_array(
        &env,
        [
            (Symbol::new(&env, "price_paid"), 100i128.into_val(&env)),
            (Symbol::new(&env, "platform_amount"), 10i128.into_val(&env)),
            (Symbol::new(&env, "seller_amount"), 90i128.into_val(&env)),
        ],
    )
    .into_val(&env);

    assert!(
        env.events()
            .all()
            .iter()
            .any(|(emitter, event_topics, event_data)| {
                emitter == contract_address
                    && event_topics == topics
                    && event_data == data
            }),
        "purchase must emit its own stable event with exact payment split"
    );
}
