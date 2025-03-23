import type {SignaleOptions} from 'signale'
import type {LockDuration} from '../vecarv/abi'
import type {CustomSignale} from '../utility/logger'
export type ContractAddresses = Readonly<{
    veCarv: string
    claim: string
    license: string
}>

export type VeCarvConfiguration = Readonly<{
    defaultLockDuration: LockDuration
}>

export type TransactionConfiguration = Readonly<{
    gas: number
}>

export type SleepConfiguration = Readonly<{
    minSleepMS: number
    maxSleepMS: number
}>

export type AppConfiguration = Readonly<{
    defaultScope: string
    loggerOptions: SignaleOptions
    shouldShuffleWallets: boolean
}>

export interface ConfigurationProvider {
    getContractAddresses(): ContractAddresses
    getAppConfiguration(): AppConfiguration
    getVeCarvConfiguration(): VeCarvConfiguration
    getTransactionConfiguration(): TransactionConfiguration
    getSleepConfiguration(): SleepConfiguration
}

export class EnvironmentConfigurationProvider implements ConfigurationProvider {
    static readonly DEFAULT_SCOPE = 'carv'

    static readonly DEFAULT_GAS = 1000000
    static readonly DEFAULT_LOCK_DURATION = 150 as LockDuration

    static readonly DEFAULT_MIN_SLEEP_MS = 1000
    static readonly DEFAULT_MAX_SLEEP_MS = 10000

    static readonly DEFAULT_VECARV_CONTRACT_ADDRESS = '0x2b790Dea1f6c5d72D5C60aF0F9CD6834374a964B'
    static readonly DEFAULT_CLAIM_CONTRACT_ADDRESS = '0xa91fF8b606BA57D8c6638Dd8CF3FC7eB15a9c634'
    static readonly DEFAULT_LICENSE_CONTRACT_ADDRESS = '0x6584533decbcb8c05fb7EAbFa93f92b7b3A85038'

    private readonly contractAddresses: ContractAddresses
    private readonly appConfiguration: AppConfiguration
    private readonly veCarvConfiguration: VeCarvConfiguration
    private readonly transactionConfiguration: TransactionConfiguration
    private readonly sleepConfiguration: SleepConfiguration

    constructor(private readonly logger: CustomSignale) {
        this.contractAddresses = this._getContractAddresses()
        this.appConfiguration = this._getAppConfiguration()
        this.veCarvConfiguration = this._getVeCarvConfiguration()
        this.transactionConfiguration = this._getTransactionConfiguration()
        this.sleepConfiguration = this._getSleepConfiguration()
    }

    private getEnvString(key: string, defaultValue: string): string {
        const value = process.env[key]
        if (!value) {
            this.logger.warn(`Environment variable ${key} is not set. Using default value: ${defaultValue}`)
            return defaultValue
        }
        return value
    }

    private getEnvNumber(key: string, defaultValue: number): number {
        const value = process.env[key]
        if (!value) {
            this.logger.warn(`Environment variable ${key} is not set. Using default value: ${defaultValue}`)
            return defaultValue
        }
        const numberValue = Number(value)
        if (isNaN(numberValue)) {
            this.logger.warn(`Environment variable ${key} is not a valid number. Using default value: ${defaultValue}`)
            return defaultValue
        }
        return numberValue
    }

    private getEnvBoolean(key: string, defaultValue: boolean): boolean {
        const value = process.env[key]
        if (!value) {
            this.logger.warn(`Environment variable ${key} is not set. Using default value: ${defaultValue}`)
            return defaultValue
        }
        const booleanValue = value.toLowerCase() === 'true'
        if (booleanValue !== true && booleanValue !== false) {
            this.logger.warn(`Environment variable ${key} is not a valid boolean. Using default value: ${defaultValue}`)
            return defaultValue
        }
        return booleanValue
    }

    private _getContractAddresses(): ContractAddresses {
        return {
            veCarv: this.getEnvString(
                'VECARV_CONTRACT_ADDRESS',
                EnvironmentConfigurationProvider.DEFAULT_VECARV_CONTRACT_ADDRESS,
            ),
            claim: this.getEnvString(
                'CLAIM_CONTRACT_ADDRESS',
                EnvironmentConfigurationProvider.DEFAULT_CLAIM_CONTRACT_ADDRESS,
            ),
            license: this.getEnvString(
                'LICENSE_CONTRACT_ADDRESS',
                EnvironmentConfigurationProvider.DEFAULT_LICENSE_CONTRACT_ADDRESS,
            ),
        }
    }

    private _getAppConfiguration(): AppConfiguration {
        return {
            defaultScope: this.getEnvString('DEFAULT_SCOPE', EnvironmentConfigurationProvider.DEFAULT_SCOPE),
            loggerOptions: {},
            shouldShuffleWallets: this.getEnvBoolean('SHOULD_SHUFFLE_WALLETS', true),
        }
    }

    private _getVeCarvConfiguration(): VeCarvConfiguration {
        return {
            defaultLockDuration: this.getEnvNumber(
                'DEFAULT_LOCK_DURATION',
                EnvironmentConfigurationProvider.DEFAULT_LOCK_DURATION,
            ) as LockDuration,
        }
    }

    private _getTransactionConfiguration(): TransactionConfiguration {
        return {
            gas: this.getEnvNumber('GAS', EnvironmentConfigurationProvider.DEFAULT_GAS),
        }
    }

    private _getSleepConfiguration(): SleepConfiguration {
        const minSleepMS = this.getEnvNumber('MIN_SLEEP_MS', EnvironmentConfigurationProvider.DEFAULT_MIN_SLEEP_MS)
        const maxSleepMS = this.getEnvNumber('MAX_SLEEP_MS', EnvironmentConfigurationProvider.DEFAULT_MAX_SLEEP_MS)

        if (minSleepMS > maxSleepMS) {
            this.logger.warn('MIN_SLEEP_MS is greater than MAX_SLEEP_MS. Using default values.')
            return {
                minSleepMS: EnvironmentConfigurationProvider.DEFAULT_MIN_SLEEP_MS,
                maxSleepMS: EnvironmentConfigurationProvider.DEFAULT_MAX_SLEEP_MS,
            }
        }

        return {
            minSleepMS,
            maxSleepMS,
        }
    }

    getContractAddresses(): ContractAddresses {
        return this.contractAddresses
    }

    getAppConfiguration(): AppConfiguration {
        return this.appConfiguration
    }

    getVeCarvConfiguration(): VeCarvConfiguration {
        return this.veCarvConfiguration
    }

    getTransactionConfiguration(): TransactionConfiguration {
        return this.transactionConfiguration
    }

    getSleepConfiguration(): SleepConfiguration {
        return this.sleepConfiguration
    }
}
