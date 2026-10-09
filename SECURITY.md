# Security Policy

Sampled combines a Soroban marketplace contract, a browser wallet client, and
IPFS uploads. Please disclose vulnerabilities privately so maintainers can
evaluate them before details become public.

## Supported versions

| Code or deployment                                            | Security support                                                                                          |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Current main branch                                           | Intended target for security fixes and triage                                                             |
| Unreleased forks or historical commits                        | Not separately maintained or supported                                                                    |
| A particular deployed contract address or older deployed WASM | Support is **not established** by this policy; include the network and contract ID in your private report |

The repository does not currently publish a separately maintained release-series
or contract-upgrade schedule. This table does not imply that code on main is
already deployed, audited, or safe to deploy, and it does not promise an upgrade
path for immutable Soroban deployments. Maintainers should revise this section
when they actually establish release and deployment support commitments.

## In-scope security reports

Issues that could affect funds, a user's signing intent, data access, or
credentials are in scope for responsible reporting, including:

- **Soroban smart contract**:
  contracts/sampled/src/lib.rs and related contracts/sampled/src/ storage,
  errors, authorization, fee accounting, purchases, earnings, and withdrawals.
- **Wallet connection, transaction configuration, and network selection**:
  src/util/wallet.ts, src/hooks/useSampledContract.ts, and related
  contract-client configuration.
- **Upload and IPFS integration**: src/hooks/usePinata.ts, including
  browser-exposed configuration, credentials, upload authorization, and
  handling of untrusted files and gateway responses.
- **Frontend and supply chain**: security-sensitive app flows under src/,
  dependency manifests such as package.json and package-lock.json,
  and the build/deployment workflow in .github/workflows/.

Also report issues that are reproducible in a currently supported dependency
or third-party integration when the Sampled configuration materially exposes
users. For upstream-only issues, include an upstream advisory if one exists.

General feature requests, expected wallet prompts, and vulnerabilities that
affect only a developer's unrelated local environment are not automatically
security issues; use the issue tracker for non-sensitive bugs.

## Private reporting channel

**Do not open a public GitHub issue or pull request containing exploit details,
keys, personally identifying data, or a proof that moves real funds.**

Use the repository's **GitHub private vulnerability reporting** page:

<https://github.com/sampled-labs/sampled/security/advisories/new>

You must be signed in to GitHub to use this path. If GitHub says reporting is
not available because repository maintainers have not enabled it, **do not
publish a vulnerability publicly**. Contact a repository maintainer through
the available non-sensitive project contact route to request a private
reporting channel, without including the sensitive details in that request.
The repository does not currently advertise a verified security-response
email address; this policy deliberately does not invent one.

A useful private report includes:

1. The affected branch or pinned commit, network (local/testnet/public), and
   contract address where applicable.
2. The component, potential impact, and preconditions, separating a
   theoretical concern from reproduced behavior.
3. Reproduction steps using synthetic data and a test contract or local
   network, with focused evidence or logs that omit secrets.
4. A suggested fix or mitigation, if known, and whether a public
   vulnerability advisory already exists.

Never include real recovery phrases, wallet keys, signing credentials,
customer data, or live-money transactions. Private reports should be
minimized to the evidence needed for maintainers to reproduce safely.

## Acknowledgement and disclosure

**Suggested response target (not a guaranteed SLA):** maintainers should
acknowledge private reports within **five business days**, triage severity and
affected deployments, and provide a next update or a revised schedule within
**fourteen calendar days**. These are proposed targets for maintainers to
confirm, not statements that a particular operator has committed to respond.

Please coordinate disclosure timing with maintainers after a fix or mitigation
has been reviewed. Do not presume that closing a GitHub issue, modifying the
repository, or publishing a new contract build automatically remediates an
already deployed on-chain contract.

The GitHub [Security Advisories](https://github.com/sampled-labs/sampled/security/advisories)
page is the intended place for maintainers to publish accepted advisories
once coordinated disclosure is appropriate.
