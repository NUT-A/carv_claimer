import {token, type AsyncFactory, type Factory} from 'brandi'
import type {SecretsProvider} from '../config/secrets'
import type Web3 from 'web3'
import type Moralis from 'moralis'
import type {Signale, SignaleOptions} from 'signale'
import type {CustomSignale} from '../utility/logger'
import type {LicenseService} from '../license/license'
import type {ClaimService} from '../claim'
import type {ClaimTransactionEncoder, RewardExtractor} from '../claim/abi'

export const SecretsTokens = {
    secrets: token<SecretsProvider>('secrets'),
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

export const LoggerTokens = {
    // Factory that creates a logger with default options but customizable scope
    loggerFactory: token<Factory<Signale, [scope: string]>>('loggerFactory'),
    // Singleton logger with default scope and options
    logger: token<Signale>('logger'),
    // Factory that creates a logger with custom scope and default options
    customLoggerFactory: token<Factory<CustomSignale, [scope: string]>>('customLoggerFactory'),
    // Default options for loggers
    defaultOptions: token<SignaleOptions>('loggerDefaultOptions'),
    // Default scope for singleton logger
    defaultScope: token<string>('loggerDefaultScope'),
}

export const Tokens = {
    ...SecretsTokens,
    ...LoggerTokens,
    ...WEB3Tokens,
    ...MoralisTokens,
    ...LicenseTokens,
    ...ClaimTokens,
}
