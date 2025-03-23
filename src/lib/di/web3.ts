import {DependencyModule, injected} from 'brandi'
import {Web3} from 'web3'
import type {SecretsProvider} from '../config/secrets'
import {SecretsTokens, WEB3Tokens} from './tokens'

function createWeb3(secretsProvider: SecretsProvider): Web3 {
    const secrets = secretsProvider.getWeb3Secrets()

    // Create Web3 instance with provider
    const web3 = new Web3(secrets.rpcUrl)

    // Add account with private key if provided
    if (secrets.privateKeys) {
        secrets.privateKeys.forEach(privateKey => {
            const account = web3.eth.accounts.privateKeyToAccount(privateKey)
            web3.eth.accounts.wallet.add(account)
        })
    } else {
        throw new Error('No private key provided')
    }

    return web3
}

injected(createWeb3, SecretsTokens.secrets)

export function createWeb3Module(): DependencyModule {
    const dependencyModule = new DependencyModule()

    dependencyModule.bind(WEB3Tokens.web3).toInstance(createWeb3).inSingletonScope()

    return dependencyModule
}
