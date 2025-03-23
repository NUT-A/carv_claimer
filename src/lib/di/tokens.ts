import {token, type AsyncFactory, type Factory} from 'brandi'
import type {SecretsProvider} from '../config/secrets'
import type {ConfigurationProvider, TransactionConfiguration} from '../config/configuration'
import type Web3 from 'web3'
import type Moralis from 'moralis'
import type {Signale, SignaleOptions} from 'signale'
import type {CustomSignale} from '../utility/logger'
import type {LicenseService} from '../license/license'
import type {ClaimService} from '../claim'
import type {ClaimTransactionEncoder, RewardExtractor} from '../claim/abi'
import type {WithdrawTransactionEncoder, LockDuration} from '../vecarv/abi'
import type {WithdrawService} from '../vecarv'
import type {SleepService} from '../sleep'

export const SecretsTokens = {
    secrets: token<SecretsProvider>('secrets'),
}

export const ConfigurationTokens = {
    configuration: token<ConfigurationProvider>('configuration'),
}

export const WEB3Tokens = {
    web3: token<Web3>('web3'),
}

export const MoralisTokens = {
    moralis: token<typeof Moralis>('moralis'),
}

export const LicenseTokens = {
    licenseContractAddress: token<string>('licenseContractAddress'),
    licenseService: token<LicenseService>('licenseService'),
}

export const ClaimTokens = {
    claimContractAddress: token<string>('claimContractAddress'),
    claimService: token<ClaimService>('claimService'),
    claimEncoder: token<ClaimTransactionEncoder>('claimEncoder'),
    rewardExtractor: token<RewardExtractor>('rewardExtractor'),
}

export const VeCarvTokens = {
    veCarvContractAddress: token<string>('veCarvContractAddress'),
    withdrawEncoder: token<WithdrawTransactionEncoder>('withdrawEncoder'),
    withdrawService: token<WithdrawService>('withdrawService'),
    defaultLockDuration: token<LockDuration>('defaultLockDuration'),
}

export const LoggerTokens = {
    // Factory that creates a logger with default options but customizable scope
    loggerFactory: token<Factory<Signale, [scope: string]>>('loggerFactory'),
    // Singleton logger with default scope and options
    logger: token<Signale>('logger'),
    // Factory that creates a logger with custom scope and default options
    customLoggerFactory: token<Factory<CustomSignale, [scope: string, interactive?: boolean]>>('customLoggerFactory'),
    // Default options for loggers
    defaultOptions: token<SignaleOptions>('loggerDefaultOptions'),
    // Default scope for singleton logger
    defaultScope: token<string>('loggerDefaultScope'),
}

export const SleepTokens = {
    sleepService: token<SleepService>('sleepService'),
}

export const TransactionTokens = {
    txConfig: token<TransactionConfiguration>('txConfig'),
}

export const Tokens = {
    ...SecretsTokens,
    ...ConfigurationTokens,
    ...LoggerTokens,
    ...WEB3Tokens,
    ...MoralisTokens,
    ...LicenseTokens,
    ...ClaimTokens,
    ...VeCarvTokens,
    ...SleepTokens,
    ...TransactionTokens,
}
