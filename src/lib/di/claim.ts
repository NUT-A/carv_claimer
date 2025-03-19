import {DependencyModule, injected} from 'brandi'
import {ClaimTokens, WEB3Tokens} from './tokens'
import {WEB3ClaimTransactionEncoder, ClaimRewardExtractor} from '../claim/abi'
import {WEB3ClaimService} from '../claim'

// Inject dependencies directly to constructors
injected(WEB3ClaimTransactionEncoder, WEB3Tokens.web3, ClaimTokens.claimContractAddress)
injected(ClaimRewardExtractor, WEB3Tokens.web3)
injected(WEB3ClaimService, WEB3Tokens.web3, ClaimTokens.claimEncoder, ClaimTokens.rewardExtractor)

// Create the claim module
export function createClaimModule(): DependencyModule {
    const module = new DependencyModule()

    // Bind default contract address for claim service
    const defaultClaimContract = '0xa91fF8b606BA57D8c6638Dd8CF3FC7eB15a9c634'

    module.bind(ClaimTokens.claimContractAddress).toConstant(defaultClaimContract)
    module.bind(ClaimTokens.rewardExtractor).toInstance(ClaimRewardExtractor).inSingletonScope()
    module.bind(ClaimTokens.claimEncoder).toInstance(WEB3ClaimTransactionEncoder).inSingletonScope()
    module.bind(ClaimTokens.claimService).toInstance(WEB3ClaimService).inSingletonScope()

    return module
}
