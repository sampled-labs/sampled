# SAMPLED

**Sampled** The Decentralized Sample Marketplace Where Producers Get Paid Instantly on Stellar

![Sampled Decentralized Music Sample Marketplace Interface on Stellar](images/screenshot.png)
*Figure 1: Sampled marketplace overview displaying discoverable audio samples and instant Web3 purchasing.*

Sampled showcases why Stellar beats Ethereum for marketplaces: instant payments, negligible fees, and real-time settlement. I chose samples because producers feel the pain of slow payments most acutely. But this same architecture works for any digital commerce. Sampled isn't just a marketplace - it's a movement. Every interaction should feel like you're part of the culture. Getting Sampled isn't just selling a beat, it's validation. It's success. It's making it.

Sampled leverages Stellar's speed and low costs to create a peer-to-peer sample marketplace with:

### Core Features Implemented:

✅ **Instant Payments**: 5-second finality with Stellar, producers get paid immediately  
✅ **90/10 Revenue Split**: Only 10% platform fee vs. industry standard 30-50%  
✅ **Smart Contract Automation**: No intermediaries, no lawyers, no waiting  
✅ **IPFS Storage**: Decentralized file storage ensures content permanence  
✅ **Commercial Licensing**: Automatic license generation with each purchase  
✅ **Freighter Wallet Integration**: Seamless Web3 experience using Stellar Wallet Kit

**Revenue rounding:** The platform percentage is applied to integer smallest token units and **rounded down**: `platform_units = floor(price_units × platform_fee_percent / 100)`. The seller receives **all remaining units** (`seller_units = price_units − platform_units`), so no unit disappears. For example, at a 10% platform fee on **1.0000001 USDC** (10,000,001 seven-decimal units), the platform receives **0.1 USDC** and the seller receives **0.9000001 USDC**. The upload preview uses the same integer-unit math; displayed figures are nominal and do not promise settlement.

### Technical Implementation:

- **Smart Contract**: Rust-based Soroban contract handling listings, purchases, and withdrawals
- **Frontend**: React + TypeScript with Vite, showcasing Scaffold Stellar's rapid development
- **Storage**: IPFS integration for audio files with on-chain metadata
- **Payments**: Native XLM transactions with automatic fee splitting

## 🏗️ Scaffold Stellar Integration

Our submission demonstrates the three key requirements:

### 1. Deployed Smart Contract

```rust
 pub fn __constructor(env: Env, platform_fee: u32, platform_address: Address) {
        let storage = env.storage().instance();
        if storage.has(&PLATFORM_ADDRESS_KEY) {
            panic!("Contract already exists");
        }

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
```

- Contract Address: [`CDYVZ75YN7355DW6L2BN7SYIAUXNBGZW7FB5ANXPVO7CTU7TKKPIFZZVJ`](https://stellar.expert/explorer/testnet/contract/CDYVZ75YN7355DW6L2BN7SYIAUXNBGZW7FB5ANXPVO7CTU7TKKPIFZZVJ)
- Network: Stellar Testnet (configured in `src/util/contract.ts`)
- Written in Rust, compiled to WASM

### 2. Modern Frontend

- Built with Scaffold Stellar's TypeScript + React template
- Responsive UI with real-time wallet balance updates
- Glassmorphism design inspired by modern Web3 aesthetics
- Component-based architecture for scalability

### 3. Stellar Wallet Kit Integration

- Freighter wallet connection
- Transaction signing
- Balance display
- Network status indicators

## 🔧 Technical Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  React Frontend │────▶│ Soroban Contract │────▶│   IPFS Storage  │
│   (TypeScript)  │     │     (Rust)       │     │    (Pinata)     │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                         │
        └────────────────────────┴─────────────────────────┘
                                 │
                        ┌────────▼────────┐
                        │                 │
                        │ Stellar Network │
                        │   (Testnet)     │
                        │                 │
                        └─────────────────┘
```

### Smart Contract Functions:

- `__constructor(platform_fee: u32, platform_address: Address, payment_token: Address)` - Initializes platform fee percentage, recipient address, and payment token
- `upload_sample(seller: Address, price: i128, title: String, bpm: u32, key: String, genre: String, ipfs_link: String, ipfs_hash: String) -> Result<u32, Error>` - Lists new audio samples with licensing metadata
- `get_sample(sample_id: u32) -> Result<Sample, Error>` - Retrieves detailed sample metadata by ID
- `update_price(caller: Address, sample_id: u32, new_price: i128) -> Result<(), Error>` - Updates the listing price for a sample (seller authorization required)
- `get_user_samples(user_address: Address) -> Vec<Sample>` - Lists all audio samples uploaded by a specific creator
- `get_all_samples() -> Vec<Sample>` - Enumerates all active marketplace sample listings
- `purchase_sample(buyer: Address, sample_id: u32) -> Result<String, Error>` - Purchases a sample with automated split payment (platform fee + seller credit) and returns the IPFS audio link
- `get_user_purchases(buyer: Address) -> Vec<Sample>` - Retrieves the full list of samples purchased by a buyer
- `has_purchased(buyer: Address, sample_id: u32) -> bool` - Verifies whether a user has already purchased a specific sample
- `withdraw_earnings(user: Address) -> Result<i128, Error>` - Transfers accumulated sales earnings to the creator
- `get_stats() -> (u32, i128)` - Returns overall platform statistics: `(total_samples, total_volume)`
- `get_earnings(user: Address) -> i128` - Queries the current withdrawable balance for an account

### Tech Stack:

- **Blockchain**: Stellar (Soroban smart contracts)
- **Frontend**: React 19 (^19.1.1 with `@ant-design/v5-patch-for-react-19`), TypeScript, Vite
- **Styling**: Custom CSS with animations
- **Wallet**: Freighter via Stellar Wallet Kit
- **Storage**: IPFS (Pinata gateway)
- **Framework**: Scaffold Stellar

# Scaffold Stellar Frontend

_To get started with Scaffold Stellar, visit its repo: [github.com/AhaLabs/scaffold-stellar](https://github.com/AhaLabs/scaffold-stellar)._

_Under active development._

A modern, up-to-date toolkit for building Stellar smart contract frontends.

- ⚡️ Vite + React + TypeScript
- 🔗 Auto-generated contract clients
- 🧩 Example components for contract interaction
- 🛠 Hot reload for contract changes
- 🧪 Easy local/testnet deployment

This is the starter frontend generated by `stellar scaffold init`. See more at [Scaffold Stellar](https://github.com/AhaLabs/scaffold-stellar).

## Requirements

Before getting started, make sure you’ve met the requirements listed in the [Soroban documentation](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup) and that the following tools are installed :

- [Rust](https://www.rust-lang.org/tools/install)
- [Cargo](https://doc.rust-lang.org/cargo/) (comes with Rust)
- Rust target: install the compilation target listed in the [Soroban setup guide](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup)
- [Node.js](https://nodejs.org/en/download/package-manager) (v22, or higher)
- [npm](https://www.npmjs.com/): Comes with the node installer or can also be installed package managers such as Homebrew, Chocolatey, apt, etc.
- [Stellar CLI](https://github.com/stellar/stellar-core)
- [Scaffold Stellar CLI Plugin](https://github.com/AhaLabs/scaffold-stellar)

## Quick Start

To get started with Sampled locally, follow the steps below:

1. Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/sampled-labs/sampled.git
cd sampled
```

2. Set up your development environment:

```bash
# Copy and configure environment variables
cp .env.example .env

# Install dependencies
npm install
```

Have a look at `environments.toml` for more fined-grained control.

3. Start development environment:

```bash
npm run dev
```

Open the server URL in your web browser.

4. For testnet/mainnet deployment:

When you are ready for testnet, you need to deploy your contract using
`stellar registry`. Some commands to get you started.

```bash
#  Note --source-account argument is omitted for clarity

# First publish your contract to the registry
stellar registry publish

# Then deploy an instance with constructor parameters
stellar registry deploy \
  --deployed-name my-contract \
  --published-name my-contract \
  -- \
  --param1 value1

# Can access the help docs with --help
stellar registry deploy \
  --deployed-name my-contract \
  --published-name my-contract \
  -- \
  --help

# Install the deployed contract locally
stellar registry create-alias my-contract
```

## Scaffold Initial Project Structure

When you run `stellar scaffold init`, it creates a frontend-focused project structure with example contracts:

```
my-project/                      # Your initialized project
├── contracts/                   # Example smart contracts
├── packages/                    # Auto-generated TypeScript clients
├── src/                         # Frontend React application
│   ├── components/              # React components
│   ├── contracts/               # Contract interaction helpers
│   ├── debug/                   # Debugging contract explorer
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # App Pages
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── target/                      # Build artifacts and WASM files
├── environments.toml            # Environment configurations
├── package.json                 # Frontend dependencies
└── .env                         # Local environment variables
```

This template provides a ready-to-use frontend application with example smart contracts and their TypeScript clients. You can use these as reference while building your own contracts and UI. The frontend is set up with Vite, React, and includes basic components for interacting with the contracts.
