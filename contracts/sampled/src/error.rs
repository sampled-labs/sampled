#[soroban_sdk::contracterror]
#[derive(Debug, Clone, Copy)]
pub enum Error {
    NotAuthorized = 1,
    SampleNotFound = 2,
    InsufficientPayment = 3,
    AlreadyPurchased = 4,
    InvalidPrice = 5,
    WithdrawFailed = 6,
    // Preserve SelfPurchase = 7 reserved by open issue #55 carrier.
    InactiveSample = 8,
}
