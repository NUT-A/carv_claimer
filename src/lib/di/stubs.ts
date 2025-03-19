import type {MoralisSecrets, SecretsProvider, WEB3Secrets} from '../config/secrets'

export class StubSecretsProvider implements SecretsProvider {
    getWeb3Secrets(): WEB3Secrets {
        return {
            rpcUrl: 'https://arb1.arbitrum.io/rpc',
            privateKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
        }
    }

    getMoralisSecrets(): MoralisSecrets {
        return {
            apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImQ4MjUxMmRhLTczN2ItNDMyOS04NWFjLTUyZDg4MDNiOTVkMCIsIm9yZ0lkIjoiNDM2NjQyIiwidXNlcklkIjoiNDQ5MTk3IiwidHlwZUlkIjoiODk3MTIzMTktYjMyNS00ZjhmLTk3NDUtMmU1YTRmYmI2ZGQwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDIxNDc1NTksImV4cCI6NDg5NzkwNzU1OX0.X-ccLB0H8JVFJT6bbjFX39j0p7IDTYBhjOPmdflG4FQ',
        }
    }
}
