#[soroban_sdk::contracterror]
#[derive(Debug, Clone, Copy)]
pub enum Error {
    NotAuthorized = 1,
    SampleNotFound = 2,
    AlreadyPurchased = 4,
    InvalidPrice = 5,
    WithdrawFailed = 6,
    // Match the separate #61 contribution; #55 reserves code 7 for SelfPurchase.
    // Preserve SelfPurchase = 7 reserved by open issue #55 carrier.
    InactiveSample = 8,
    SelfPurchase = 7,
}
