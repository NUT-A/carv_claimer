export type WEB3Secrets = Readonly<{
    rpcUrl: string
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
