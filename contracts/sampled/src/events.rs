use soroban_sdk::{contractevent, Address};

/// Stable topics: (sample, listed, sample_id).
#[contractevent(topics = ["sample", "listed"])]
#[derive(Clone)]
pub struct SampleListed {
    #[topic]
    pub sample_id: u32,
    pub seller: Address,
    pub price: i128,
}

/// Stable topics: (sample, purchased, sample_id, buyer).
/// Splitting the actual price into seller and platform amounts lets consumers
/// reconstruct the ledger result without relying on mutable UI calculations.
#[contractevent(topics = ["sample", "purchased"])]
#[derive(Clone)]
pub struct SamplePurchased {
    #[topic]
    pub sample_id: u32,
    #[topic]
    pub buyer: Address,
    pub price_paid: i128,
    pub platform_amount: i128,
    pub seller_amount: i128,
}

/// Stable topics: (sample, repriced, sample_id).
#[contractevent(topics = ["sample", "repriced"])]
#[derive(Clone)]
pub struct SampleRepriced {
    #[topic]
    pub sample_id: u32,
    pub seller: Address,
    pub new_price: i128,
}

/// Stable topics: (sample, withdrawn, user).
#[contractevent(topics = ["sample", "withdrawn"])]
#[derive(Clone)]
pub struct EarningsWithdrawn {
    #[topic]
    pub user: Address,
    pub amount: i128,
}
