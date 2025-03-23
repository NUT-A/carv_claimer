import type {MoralisSecrets, SecretsProvider, WEB3Secrets} from '../config/secrets'
import type {
    ConfigurationProvider,
    ContractAddresses,
    AppConfiguration,
    VeCarvConfiguration,
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
            apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImQ4MjUxMmRhLTczN2ItNDMyOS04NWFjLTUyZDg4MDNiOTVkMCIsIm9yZ0lkIjoiNDM2NjQyIiwidXNlcklkIjoiNDQ5MTk3IiwidHlwZUlkIjoiODk3MTIzMTktYjMyNS00ZjhmLTk3NDUtMmU1YTRmYmI2ZGQwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDIxNDc1NTksImV4cCI6NDg5NzkwNzU1OX0.X-ccLB0H8JVFJT6bbjFX39j0p7IDTYBhjOPmdflG4FQ',
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
        }
    }

    getVeCarvConfiguration(): VeCarvConfiguration {
        return {
            // Default lock duration as a specific value from the union type
            defaultLockDuration: 150 as LockDuration,
        }
    }
}
