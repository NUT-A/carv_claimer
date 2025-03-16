import {DependencyModule, injected} from 'brandi'
import Moralis from 'moralis'
import {Web3} from 'web3'
import type {SecretsProvider} from '../config/secrets'
import {SecretsTokens, WEB3Tokens, MoralisTokens} from './tokens'

// Function to create Moralis module
export function createMoralisModule(): DependencyModule {
    const dependencyModule = new DependencyModule()

    // Bind Moralis directly as a constant (not initialized yet)
    dependencyModule.bind(MoralisTokens.moralis).toConstant(Moralis)

    return dependencyModule
}

// Separate function to initialize Moralis after container setup
export async function initializeMoralis(
    secretsProvider: SecretsProvider,
    web3: Web3,
    moralis: typeof Moralis,
): Promise<void> {
    // Initialize Moralis with the API key from secrets
    const apiKey = secretsProvider.getMoralisSecrets().apiKey

    // Get the chain ID from Web3
    const chainIdBigInt = await web3.eth.getChainId()

    // Convert BigInt to number (safe for all mainstream blockchain IDs)
    const chainId = Number(chainIdBigInt)

    // Initialize Moralis with API key and default chain
    await moralis.start({
        apiKey,
        // Set the default EVM chain as a number
        defaultEvmApiChain: chainId,
    })
}
