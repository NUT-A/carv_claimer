# Carv Automation Tool

This tool automates interactions with Carv smart contracts, handling license checking, claiming, and token withdrawals.

## Setup

### Prerequisites

-   Docker and Docker Compose
-   Moralis API key

### Installation

1. Clone the repository
2. Set up your private keys in a `.keys` file:

    ```
    0x123...abc
    0x456...def
    ```

    Each line should contain one private key.

3. Configure environment variables in a `.env` file:

    ```
    # Required
    ARBITRUM_RPC_URL=https://your-arbitrum-rpc
    MORALIS_API_KEY=your_moralis_api_key

    # Optional - Contracts
    VECARV_CONTRACT_ADDRESS=0x2b790Dea1f6c5d72D5C60aF0F9CD6834374a964B
    CLAIM_CONTRACT_ADDRESS=0xa91fF8b606BA57D8c6638Dd8CF3FC7eB15a9c634
    LICENSE_CONTRACT_ADDRESS=0x6584533decbcb8c05fb7EAbFa93f92b7b3A85038

    # Optional - Configuration
    DEFAULT_SCOPE=carv
    DEFAULT_LOCK_DURATION=150
    GAS=1000000
    MIN_SLEEP_MS=1000
    MAX_SLEEP_MS=10000
    SHOULD_SHUFFLE_WALLETS=true
    ```

## Usage

Run the script using Docker:

```bash
./run.sh
```

## Configuration Options

### Smart Contract Configuration

| Variable                   | Description              | Default                                    |
| -------------------------- | ------------------------ | ------------------------------------------ |
| `VECARV_CONTRACT_ADDRESS`  | VeCarv contract address  | 0x2b790Dea1f6c5d72D5C60aF0F9CD6834374a964B |
| `CLAIM_CONTRACT_ADDRESS`   | Claim contract address   | 0xa91fF8b606BA57D8c6638Dd8CF3FC7eB15a9c634 |
| `LICENSE_CONTRACT_ADDRESS` | License contract address | 0x6584533decbcb8c05fb7EAbFa93f92b7b3A85038 |

### Transaction Configuration

| Variable                | Description                      | Default |
| ----------------------- | -------------------------------- | ------- |
| `GAS`                   | Gas limit for transactions       | 1000000 |
| `DEFAULT_LOCK_DURATION` | Default lock duration for VeCarv | 150     |

### Application Configuration

| Variable                 | Description                           | Default |
| ------------------------ | ------------------------------------- | ------- |
| `DEFAULT_SCOPE`          | Default logging scope                 | carv    |
| `SHOULD_SHUFFLE_WALLETS` | Whether to shuffle wallet order       | true    |
| `MIN_SLEEP_MS`           | Minimum sleep time between operations | 1000    |
| `MAX_SLEEP_MS`           | Maximum sleep time between operations | 10000   |

### Required Secrets

| Variable           | Description                      |
| ------------------ | -------------------------------- |
| `ARBITRUM_RPC_URL` | Arbitrum RPC URL                 |
| `MORALIS_API_KEY`  | Moralis API key for data queries |

## How It Works

The main script (`index.ts`) performs the following operations:

1. Initializes the dependency injection container
2. Configures Web3 with the provided private keys
3. For each wallet address:
    - Retrieves all licenses associated with the wallet
    - Claims rewards based on these licenses
    - Withdraws tokens from VeCarv
    - Waits for a random period before processing the next wallet
4. Reports the total amount of tokens withdrawn

## Dependency Injection

This project uses a modular dependency injection system, making it highly adaptable and maintainable. All services and dependencies are defined in the `src/lib/di` directory.

The modular architecture allows for easy customization. For example:

-   The current implementation reads private keys from a `.keys` file, but you could easily replace this with a secure key management service by implementing a new provider
-   RPC providers, logging, and other services can be swapped out without modifying the core business logic

To modify or extend functionality, check the token definitions and service implementations in the DI container.
