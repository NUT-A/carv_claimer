import type {CustomSignale} from '../utility/logger'
import fs from 'fs'

export type WEB3Secrets = Readonly<{
    rpcUrl: string
    privateKeys: string[]
}>

export type MoralisSecrets = Readonly<{
    apiKey: string
}>

export interface WEB3SecretsProvider {
    getWeb3Secrets(): WEB3Secrets
}

export interface MoralisSecretsProvider {
    getMoralisSecrets(): MoralisSecrets
}

export interface SecretsProvider extends WEB3SecretsProvider, MoralisSecretsProvider {}

export class EnvironmentSecretsProvider implements SecretsProvider {
    constructor(private readonly logger: CustomSignale) {}

    private getEnvVar(key: string): string {
        const value = process.env[key]
        if (!value) {
            this.logger.error(`Environment variable ${key} is not set`)
            throw new Error(`Environment variable ${key} is not set`)
        }
        return value
    }

    private getPrivateKeys(): string[] {
        // Read the .keys file
        const keys = fs.readFileSync('.keys', 'utf8')
        return keys.split('\n').filter((key: string) => key.trim() !== '')
    }

    getWeb3Secrets(): WEB3Secrets {
        return {
            rpcUrl: this.getEnvVar('ARBITRUM_RPC_URL'),
            privateKeys: this.getPrivateKeys(),
        }
    }

    getMoralisSecrets(): MoralisSecrets {
        return {
            apiKey: this.getEnvVar('MORALIS_API_KEY'),
        }
    }
}
