import {DependencyModule, injected} from 'brandi'
import {VeCarvTokens, WEB3Tokens, ConfigurationTokens} from './tokens'
import {WEB3WithdrawTransactionEncoder} from '../vecarv/abi'
import type {LockDuration} from '../vecarv/abi'
import {WEB3WithdrawService} from '../vecarv'
import type {ConfigurationProvider} from '../config/configuration'

// Create a function to get the veCarvContractAddress from the configuration provider
function getVeCarvContractAddress(configProvider: ConfigurationProvider): string {
    return configProvider.getContractAddresses().veCarv
}

// Create a function to get the default lock duration from the configuration provider
function getDefaultLockDuration(configProvider: ConfigurationProvider): LockDuration {
    // The configuration's defaultLockDuration is already constrained by the LockDuration type
    return configProvider.getVeCarvConfiguration().defaultLockDuration
}

// Inject dependencies directly to constructors
injected(getVeCarvContractAddress, ConfigurationTokens.configuration)
injected(getDefaultLockDuration, ConfigurationTokens.configuration)
injected(WEB3WithdrawTransactionEncoder, WEB3Tokens.web3, VeCarvTokens.veCarvContractAddress)
injected(WEB3WithdrawService, WEB3Tokens.web3, VeCarvTokens.withdrawEncoder, VeCarvTokens.defaultLockDuration)

// Create the vecarv module
export function createVeCarvModule(): DependencyModule {
    const module = new DependencyModule()

    // Bind contract address and default lock duration from configuration provider
    module.bind(VeCarvTokens.veCarvContractAddress).toInstance(getVeCarvContractAddress).inSingletonScope()
    module.bind(VeCarvTokens.defaultLockDuration).toInstance(getDefaultLockDuration).inSingletonScope()
    module.bind(VeCarvTokens.withdrawEncoder).toInstance(WEB3WithdrawTransactionEncoder).inSingletonScope()
    module.bind(VeCarvTokens.withdrawService).toInstance(WEB3WithdrawService).inSingletonScope()

    return module
}
