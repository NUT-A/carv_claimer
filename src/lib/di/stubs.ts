import type {MoralisSecrets, SecretsProvider, WEB3Secrets} from '../config/secrets'
import type {
    ConfigurationProvider,
    ContractAddresses,
    AppConfiguration,
    VeCarvConfiguration,
    TransactionConfiguration,
    SleepConfiguration,
} from '../config/configuration'
import type {LockDuration} from '../vecarv/abi'

export class StubSecretsProvider implements SecretsProvider {
    getWeb3Secrets(): WEB3Secrets {
        return {
            rpcUrl: 'https://arb1.arbitrum.io/rpc',
            privateKeys: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
        }
    }

    getMoralisSecrets(): MoralisSecrets {
        return {
            apiKey: 'key',
        }
    }
}

export class StubConfigurationProvider implements ConfigurationProvider {
    getContractAddresses(): ContractAddresses {
        return {
            veCarv: '0x2b790Dea1f6c5d72D5C60aF0F9CD6834374a964B',
            claim: '0xa91fF8b606BA57D8c6638Dd8CF3FC7eB15a9c634',
            license: '0x6584533decbcb8c05fb7EAbFa93f92b7b3A85038',
        }
    }

    getAppConfiguration(): AppConfiguration {
        return {
            defaultScope: 'carv',
            // Set log level based on environment
            loggerOptions: {},
            shouldShuffleWallets: true,
        }
    }

    getVeCarvConfiguration(): VeCarvConfiguration {
        return {
            // Default lock duration as a specific value from the union type
            defaultLockDuration: 150 as LockDuration,
        }
    }

    getTransactionConfiguration(): TransactionConfiguration {
        return {
            gas: 1000000,
        }
    }

    getSleepConfiguration(): SleepConfiguration {
        return {
            minSleepMS: 1000,
            maxSleepMS: 10000,
        }
    }
}
