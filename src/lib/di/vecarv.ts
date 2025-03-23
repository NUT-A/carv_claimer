import {DependencyModule, injected} from 'brandi'
import {VeCarvTokens, WEB3Tokens, ConfigurationTokens, LoggerTokens} from './tokens'
import {WEB3WithdrawTransactionEncoder} from '../vecarv/abi'
import type {LockDuration, WithdrawTransactionEncoder} from '../vecarv/abi'
import {WEB3WithdrawService} from '../vecarv'
import type {ConfigurationProvider} from '../config/configuration'
import type {CustomSignale} from '../utility/logger'
import type {Factory} from 'brandi'
import type Web3 from 'web3'

// Create a function to get the veCarvContractAddress from the configuration provider
function getVeCarvContractAddress(configProvider: ConfigurationProvider): string {
    return configProvider.getContractAddresses().veCarv
}

// Create a function to get the default lock duration from the configuration provider
function getDefaultLockDuration(configProvider: ConfigurationProvider): LockDuration {
    // The configuration's defaultLockDuration is already constrained by the LockDuration type
    return configProvider.getVeCarvConfiguration().defaultLockDuration
}

// Create service for withdrawing tokens
function createWithdrawService(
    web3: Web3,
    withdrawEncoder: WithdrawTransactionEncoder,
    customLoggerFactory: Factory<CustomSignale, [scope: string, interactive?: boolean]>,
    lockDuration: LockDuration,
    configProvider: ConfigurationProvider,
) {
    return new WEB3WithdrawService(
        web3,
        withdrawEncoder,
        customLoggerFactory('vecarv', true),
        lockDuration,
        configProvider.getTransactionConfiguration(),
    )
}

// Inject dependencies directly to constructors
injected(getVeCarvContractAddress, ConfigurationTokens.configuration)
injected(getDefaultLockDuration, ConfigurationTokens.configuration)
injected(WEB3WithdrawTransactionEncoder, WEB3Tokens.web3, VeCarvTokens.veCarvContractAddress)
injected(
    createWithdrawService,
    WEB3Tokens.web3,
    VeCarvTokens.withdrawEncoder,
    LoggerTokens.customLoggerFactory,
    VeCarvTokens.defaultLockDuration,
    ConfigurationTokens.configuration,
)

// Create the vecarv module
export function createVeCarvModule(): DependencyModule {
    const module = new DependencyModule()

    // Bind contract address and default lock duration from configuration provider
    module.bind(VeCarvTokens.veCarvContractAddress).toInstance(getVeCarvContractAddress).inSingletonScope()
    module.bind(VeCarvTokens.defaultLockDuration).toInstance(getDefaultLockDuration).inSingletonScope()
    module.bind(VeCarvTokens.withdrawEncoder).toInstance(WEB3WithdrawTransactionEncoder).inSingletonScope()
    module.bind(VeCarvTokens.withdrawService).toInstance(createWithdrawService).inSingletonScope()

    return module
}
