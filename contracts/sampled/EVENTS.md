# Sampled on-chain activity events

The contract publishes four typed Soroban contract events so indexers and `src/hooks/useSubscription.ts` can subscribe to actual ledger transitions rather than guess from local UI state. The fixed topics below are case-sensitive `Symbol` values. Data is a map keyed by each field name. Values that represent money are **i128 token base units**, never floating-point user display values.

| Operation | Topics in order | Data fields |
| --- | --- | --- |
| `upload_sample` | `sample`, `listed`, `sample_id: u32` | `seller: Address`, `price: i128` |
| `purchase_sample` | `sample`, `purchased`, `sample_id: u32`, `buyer: Address` | `price_paid: i128`, `platform_amount: i128`, `seller_amount: i128` |
| `update_price` | `sample`, `repriced`, `sample_id: u32` | `seller: Address`, `new_price: i128` |
| `withdraw_earnings` (positive amount) | `sample`, `withdrawn`, `user: Address` | `amount: i128` |

Consumers should filter `getEvents` by the **Sampled contract ID** and topics beginning with `sample`, optionally adding the action name or sample/user identity. Read full metadata from `get_sample` or `get_user_purchases` if needed. The events deliberately do **not** embed the private IPFS access link, title, user wallet secrets, or any permission material.

Every event is published only on the corresponding successful mutation path. For purchases, the event comes **after** the buyer's token transfer, earnings accounting, persisted purchase receipt, sample sales count, and volume update. Soroban rolls back contract state and events if the call fails. An earnings withdrawal of zero does not emit a withdrawal event.

The receipt fields preserve the exact percentage split at the time of purchase rather than re-deriving historical amounts from mutable prices/fees. The purchase event has four topics (two static plus the sample ID and buyer), the Soroban indexable-topic limit.

**Testing:** A focused purchase test exercises the Stellar Asset Contract, an actual sample listing and purchase, and asserts the emitted Sampled event's topics and amount map. Run `cargo test -p sampled purchase_emits_indexable_receipt_with_settled_amounts` in a Rust-equipped environment; `cargo test -p sampled` remains the sponsor's full check. Test source is provided; no unexecuted check is represented as passing.
