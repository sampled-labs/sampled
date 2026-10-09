#[soroban_sdk::contracterror]
#[derive(Debug, Clone, Copy)]
pub enum Error {
    NotAuthorized = 1,
    SampleNotFound = 2,
    AlreadyPurchased = 4,
    InvalidPrice = 5,
    WithdrawFailed = 6,
    // Match the separate #61 contribution; #55 reserves code 7 for SelfPurchase.
    InactiveSample = 8,
}
