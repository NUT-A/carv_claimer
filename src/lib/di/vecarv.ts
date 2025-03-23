import {DependencyModule, injected} from 'brandi'
import {VeCarvTokens, WEB3Tokens} from './tokens'
import {WEB3WithdrawTransactionEncoder} from '../vecarv/abi'
import {WEB3WithdrawService} from '../vecarv'

// Inject dependencies directly to constructors
injected(WEB3WithdrawTransactionEncoder, WEB3Tokens.web3, VeCarvTokens.veCarvContractAddress)
injected(WEB3WithdrawService, WEB3Tokens.web3, VeCarvTokens.withdrawEncoder)

// Create the vecarv module
export function createVeCarvModule(): DependencyModule {
    const module = new DependencyModule()

    // Bind default contract address for vecarv
    const defaultVeCarvContract = '0x2b790Dea1f6c5d72D5C60aF0F9CD6834374a964B' // Replace with the actual contract address

    module.bind(VeCarvTokens.veCarvContractAddress).toConstant(defaultVeCarvContract)
    module.bind(VeCarvTokens.withdrawEncoder).toInstance(WEB3WithdrawTransactionEncoder).inSingletonScope()
    module.bind(VeCarvTokens.withdrawService).toInstance(WEB3WithdrawService).inSingletonScope()

    return module
}
