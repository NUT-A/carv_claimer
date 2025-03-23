import {Container} from 'brandi'
import {createSecretsModule} from './secrets'
import {createWeb3Module} from './web3'
import {createMoralisModule, initializeMoralis} from './moralis'
import {createLoggerModule} from './logger'
import {createLicenseModule} from './license'
import {createClaimModule} from './claim'
import {createVeCarvModule} from './vecarv'
import {
    SecretsTokens,
    WEB3Tokens,
    MoralisTokens,
    LoggerTokens,
    LicenseTokens,
    ClaimTokens,
    VeCarvTokens,
    Tokens,
} from './tokens'

// Define all module creators and their associated tokens
// This makes it easy to add new modules - just add them to this array
const moduleCreators = [
    {create: createSecretsModule, tokens: Object.values(SecretsTokens)},
    {create: createLoggerModule, tokens: Object.values(LoggerTokens)},
    {create: createWeb3Module, tokens: Object.values(WEB3Tokens)},
    {create: createMoralisModule, tokens: Object.values(MoralisTokens)},
    {create: createLicenseModule, tokens: Object.values(LicenseTokens)},
    {create: createClaimModule, tokens: Object.values(ClaimTokens)},
    {create: createVeCarvModule, tokens: Object.values(VeCarvTokens)},
]

function createContainer(): Container {
    return new Container()
}

function registerModules(container: Container): void {
    // Process all modules in a single loop
    for (const {create, tokens} of moduleCreators) {
        // Create the module
        const module = create()

        // Register all tokens from this module
        for (const token of tokens) {
            container.use(token).from(module)
        }
    }
}

// Get the container with all modules registered
export function getContainer(): Container {
    const container = createContainer()
    registerModules(container)
    return container
}

// Initialize Moralis after container setup
export async function initializeContainer(container: Container): Promise<void> {
    // Get dependencies from container
    const secretsProvider = container.get(Tokens.secrets)
    const web3 = container.get(Tokens.web3)
    const moralis = container.get(Tokens.moralis)

    // Call initializeMoralis with dependencies from the container
    // This allows us to use dependency injection while keeping the initialization separate
    await initializeMoralis(secretsProvider, web3, moralis)
}
