---
title: "Fergulati Finds — Weekly Crypto Newsletter, June 29, 2026"
date: 2026-06-29
tags:
  - news
  - bitcoin
  - markets
description: "Your weekly roundup of Bitcoin, crypto markets, blockchain tech, and DeFi news — week of June 29, 2026."
---

## Week of June 29 2026

---

## Market Overview: Bitcoin Falls Below \$60000

Bitcoin fell below \$60000 this week reaching its lowest price point since 2024. The overall crypto market has declined roughly 50% over the past year. Capital is rotating out of digital assets and into AI stocks and other growth sectors. Ethereum fell 8% on the week. Memecoins fell even further.

---

## Bitcoin ETF Outflows and Corporate Buying

Spot Bitcoin ETFs recorded six consecutive weeks of net outflows. The total outflow over that stretch reached \$5.94 billion. A brief reversal on June 23 brought \$39.2 million in inflows but did not break the trend. Corporate buyers continue to accumulate at current prices. Strategy purchased 520 BTC for approximately \$35 million. Strive Asset Management added 759 BTC for about \$50 million at an average purchase price of \$65850 per coin.

---

## Ethereum Foundation Restructures and Cuts Staff

The Ethereum Foundation announced it is cutting approximately 20% of its workforce. The organization will also reduce its annual budget by roughly 40%. The plan is to shift toward a sustainable endowment style operating model. The foundation will reorganize into five domain focused clusters covering protocol development / network access / user experience / community and institutional relations / and operations. Annual spending is targeted to fall from roughly 15% of treasury assets down to approximately 5% by 2030.

Ethereum developer Terence announced the release of Glamsterdam devnet 6. The release adds new Ethereum Improvement Proposals and system contracts. It marks a key step toward the upcoming testnet launch.

---

## Binance Europe License Expires June 30

Binance has less than one week to secure a replacement operating license before current permissions expire on June 30. Without a replacement the platform would be required to halt services for millions of European users. A resolution has not been announced as of this writing.

---

## CLARITY Act Faces Religious and Law Enforcement Opposition

Nearly 100 Catholic bishops and church leaders sent a letter to Senate leadership opposing Section 604 of the CLARITY Act. Section 604 also known as the Blockchain Regulatory Certainty Act would create a safe harbor for noncustodial DeFi developers and exempt them from money transmitter classification. The Alliance to End Human Trafficking organized the faith based coalition opposing the provision. Law enforcement groups had raised similar concerns earlier in the year. A House hearing is scheduled for July 17 as the next concrete milestone. Polymarket puts the probability of President Trump signing the bill before the end of 2026 at 42%.

---

## USDC Gains Privacy Features on Starknet

Circle introduced privacy features for USDC on the Starknet network through an upgrade called STRK20. Users can now transfer funds without revealing balances or transaction amounts or counterparty identities. The upgrade maintains regulatory compliance at the protocol level.

---

## Solana ETF Listed on Kazakhstan Stock Exchange

The Kazakhstan Stock Exchange listed the Volatility Shares Solana ETF under the ticker SOLZ. Kazakhstan also launched its first licensed digital asset platform built on the Solana blockchain earlier this year. The country is positioning itself as a regulated hub for crypto market infrastructure in Central Asia.

---

---

## Deep Research: Solana Alpenglow
## The Largest Consensus Upgrade in Blockchain History

---

### What Is Alpenglow

Solana is preparing to activate the most significant consensus upgrade in the history of any major blockchain network. The upgrade is named Alpenglow. It was approved by validator governance in September 2025 under a proposal called SIMD 0326. The vote passed with 98.27% of participating validators in favor. Approximately 52% of total staked SOL participated in that vote. The upgrade went live on a dedicated community test cluster on May 11 2026. Solana co-founder Anatoly Yakovenko said at Consensus Miami in May 2026 that mainnet activation could arrive as soon as Q3 2026 if testing proceeds without major problems. The formal path to mainnet runs through the Agave 4.1 client release from Anza.

---

### What Alpenglow Replaces

Solana has run on two core consensus mechanisms since its launch. The first is Proof of History which functions as a cryptographic clock giving validators a shared reference for ordering events without constant communication. The second is Tower BFT which layers a voting system on top of Proof of History to achieve finality. Tower BFT requires validators to vote across 32 successive confirmation slots before a block reaches deterministic finality. That process takes 12.8 seconds. During those 12.8 seconds a transaction sits in a block but remains reversible. Each validator vote in Tower BFT is itself an on chain transaction that occupies block space. Validator vote transactions have consumed roughly 75% of all Solana block space at any point in time. That left only 25% available for user activity. Alpenglow removes both Proof of History and Tower BFT from the consensus layer entirely.

---

### How Votor Works

Alpenglow introduces Votor as the replacement for Tower BFT. Votor moves all voting off chain. Validators now broadcast lightweight vote messages directly to other validators without touching the blockchain. Any node can collect those vote messages and compress them into an aggregated BLS certificate. That certificate is approximately 1000 bytes. It is the only voting artifact that ever reaches the blockchain.

Votor runs two finalization paths at the same time. The fast path finalizes a block in a single round when at least 80% of total stake weight has signed a vote. The slow path activates when at least 60% of stake approves in a first round and then completes when another 60% approves in a second round. Whichever path reaches its threshold first finalizes the block. Running both paths at once means the protocol does not choose between speed and fault tolerance. Target finality under normal conditions is 100 to 150 milliseconds compared to the previous 12.8 seconds. That is approximately a 100 times reduction in finality time.

Votor also adjusts the fault tolerance model. Tower BFT tolerated up to 33% of stake acting maliciously before safety could break. Votor sets the adversarial tolerance at 20%. A separate tolerance of 20% covers validators that are offline or crashed. Total non-responsive stake the network can withstand reaches approximately 40%. The tighter adversarial threshold is what allows finalization in a single round. Alpenglow also ships with formal mathematical safety proofs. Prior Solana consensus relied on simulation and live network experience to establish correctness. The proofs allow the behavior of the system under adversarial conditions to be verified mathematically rather than through observation alone.

---

### How Rotor Works

Rotor is the second component of Alpenglow and it replaces Turbine as the block propagation layer. Turbine disseminates block data through a tree structure that passes information across multiple network hops. Rotor uses a simpler relay scheme with fewer hops. It applies erasure coding to divide block data into fragments and distributes those fragments across validators. Each validator contributes bandwidth proportional to its stake. Larger validators carry more of the propagation load. Smaller validators carry less. The result is faster and more efficient block delivery across the full validator set.

Rotor is not shipping with the initial mainnet activation of Alpenglow. At launch Turbine will remain in place for block propagation. Rotor has its own separate governance proposal and will go through its own approval process before it ships. The initial Alpenglow activation covers the Votor consensus layer only.

---

### The Research Team

Alpenglow was designed by the research division at Anza. Anza is the spinoff from Solana Labs that builds and maintains the Agave validator client. The research team is led by Professor Roger Wattenhofer of ETH Zurich who is among the world's most cited researchers in distributed systems. His former doctoral students Kobi Sliwinski and Quentin Kniep co-designed the protocol at Anza. The team previously published a 2024 paper identifying liveness vulnerabilities in Tower BFT. The same researchers who found the weaknesses in the old system built its replacement.

---

### What 100 to 150ms Finality Changes for DeFi

The shift from 12.8 second finality to 100 to 150 millisecond finality changes the risk profile and design space for every financial application built on Solana.

Lending protocols require fast liquidations to remain solvent. When a borrower's collateral value drops below a required threshold the protocol must liquidate that position before losses compound. A 12.8 second finality window gives prices significant time to move before any liquidation transaction confirms. Sub second finality collapses that exposure window. Lending protocols can operate with tighter leverage parameters and stronger capital efficiency when liquidation settlement is near instant.

Decentralized exchanges running on chain order books can now compete directly with centralized exchanges on execution latency. Market makers can update prices without accounting for a 12 second settlement lag. Tighter spreads and deeper liquidity are the expected result for Solana based DEXs.

High frequency trading strategies have historically required centralized exchange infrastructure because on chain settlement was too slow for strategies that respond to price movements in milliseconds. At 100 to 150 milliseconds Solana settlement speed is competitive with the clearing times of many centralized venues. That opens a category of institutional trading activity that has been structurally excluded from on chain systems.

The freeing of block space is equally significant. Eliminating validator vote transactions removes roughly 75% of the current transaction load. Block space that was occupied by internal network housekeeping becomes available for user transactions. Higher effective throughput for applications follows directly even if raw transactions per second capacity does not change.

---

### Institutional Adoption Context

Solana processed 25.3 billion transactions in Q1 2026 compared to Ethereum's 200 million. Annual stablecoin volume on Solana has crossed \$1 trillion. US spot Solana ETFs accumulated \$568 million in net inflows since launching in October 2025. Thirteen public companies now hold approximately 1.44% of Solana's circulating supply with roughly \$1.72 billion committed to corporate staking positions.

Alpenglow adds a formal technical foundation to Solana's institutional pitch. Financial institutions assessing a blockchain for payment infrastructure or custody applications can now evaluate formal safety proofs rather than relying solely on empirical uptime records. That is a shift in how Solana presents itself to compliance teams and risk committees at regulated institutions.

---

### Solana vs Ethereum: What Alpenglow Changes

Ethereum scales through a layered rollup ecosystem. Individual Layer 2 networks achieve fast finality within their own environments but users and developers must understand which layer holds their assets and what the trust assumptions of that layer are. Solana maintains a single execution layer. Applications and users interact with one chain. Finality is now deterministic in under 200 milliseconds without additional infrastructure.

Ethereum retains the leading position in institutional total value locked and in sound money credibility following the maturity of spot ETH ETF products. Solana leads on raw transaction throughput and retail fee competitiveness. Alpenglow does not change that fundamental split but it eliminates the 12.8 second finality disadvantage as a barrier for latency sensitive use cases.

---

### Key Risks and Milestones to Watch

The mainnet timeline depends on three specific gates. Security audits must complete without findings that require significant implementation changes. SIMD 0387 which governs BLS key registration for validator vote accounts must activate on public testnet. The Agave 4.1 client release must reach a stable production state. Any of those three gates can delay the activation date.

Client diversity is the deeper structural risk. Jump Crypto's Firedancer team has engaged with the Alpenglow roadmap and proposed changes anticipating the upgrade. Firedancer has no production Votor implementation running on any live cluster. Activating Alpenglow with only the Anza Agave client means nearly all staked SOL runs through a single software implementation during the transition. The community will need to weigh that single client concentration against the benefits of earlier activation. Waiting for Firedancer to ship production Votor support could push mainnet activation into 2027.

Validators who have not registered a BLS public key on their vote account per SIMD 0387 will be treated as unstaked after Alpenglow activates. They will not participate in consensus and will not earn staking rewards. Tracking SIMD 0387 landing on public testnet is the clearest signal that activation is moving from a private cluster to a production network environment.

The 100 to 150 millisecond finality figures come from simulations and from the dedicated community test cluster. Public testnet at full validator scale may reveal edge cases that the smaller cluster environment did not surface.

---

### What This Means for Your Strategy

Clients building on Solana should begin auditing applications now for sub second finality compatibility. Code that distinguishes between confirmed and finalized transaction states will need review. Those two states converge into a single deterministic certificate under Alpenglow. Application logic that polls for transaction status should migrate to push based subscription models before mainnet activation.

Clients assessing which blockchain to build on now have a stronger technical case for Solana at the base layer. The 100 to 150 millisecond guarantee is on chain without additional infrastructure dependencies. For latency sensitive applications in payments / DeFi / and trading infrastructure Alpenglow materially changes the Solana value proposition.

Alpenglow is the most significant evidence to date that Solana is maturing from a network that performed well empirically into one with formal correctness guarantees. That distinction matters for institutional counterparties who require documented proof of system behavior rather than historical uptime records alone.

---

*Sources: CoinDesk / The Block / Yahoo Finance / Chainstack Blog / Helius / CryptoAPIs / Alchemy / InvestingNews / Decrypt / Blockworks / AInvest / EarnPark / CryptoBriefing / CoinMarketCap / TheStreet / Solana Compass*

---

*Fergulati Consulting | Weekly Crypto Intelligence | Next Issue: July 6 2026*
