import {DependencyModule, injected, type Factory} from 'brandi'
import {ClaimTokens, WEB3Tokens, ConfigurationTokens, LoggerTokens} from './tokens'
import {
    WEB3ClaimTransactionEncoder,
    ClaimRewardExtractor,
    type ClaimTransactionEncoder,
    type RewardExtractor,
} from '../claim/abi'
import {WEB3ClaimService, type ClaimService} from '../claim'
import type {ConfigurationProvider} from '../config/configuration'
import type {CustomSignale} from '../utility/logger'
import type Web3 from 'web3'

// Create a function to get the claimContractAddress from the configuration provider
function getClaimContractAddress(configProvider: ConfigurationProvider): string {
    return configProvider.getContractAddresses().claim
}

function createClaimService(
    web3: Web3,
    claimEncoder: ClaimTransactionEncoder,
    rewardExtractor: RewardExtractor,
    customLoggerFactory: Factory<CustomSignale, [scope: string, interactive?: boolean]>,
    configProvider: ConfigurationProvider,
): ClaimService {
    return new WEB3ClaimService(
        web3,
        claimEncoder,
        rewardExtractor,
        customLoggerFactory('claim', true),
        configProvider.getTransactionConfiguration(),
    )
}

// Inject dependencies directly to constructors
injected(getClaimContractAddress, ConfigurationTokens.configuration)
injected(WEB3ClaimTransactionEncoder, WEB3Tokens.web3, ClaimTokens.claimContractAddress)
injected(ClaimRewardExtractor, WEB3Tokens.web3)
injected(
    createClaimService,
    WEB3Tokens.web3,
    ClaimTokens.claimEncoder,
    ClaimTokens.rewardExtractor,
    LoggerTokens.customLoggerFactory,
    ConfigurationTokens.configuration,
)

// Create the claim module
export function createClaimModule(): DependencyModule {
    const module = new DependencyModule()

    // Bind contract address from configuration provider
    module.bind(ClaimTokens.claimContractAddress).toInstance(getClaimContractAddress).inSingletonScope()
    module.bind(ClaimTokens.rewardExtractor).toInstance(ClaimRewardExtractor).inSingletonScope()
    module.bind(ClaimTokens.claimEncoder).toInstance(WEB3ClaimTransactionEncoder).inSingletonScope()
    module.bind(ClaimTokens.claimService).toInstance(createClaimService).inSingletonScope()

    return module
}
