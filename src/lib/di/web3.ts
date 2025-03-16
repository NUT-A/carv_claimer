import {DependencyModule, injected, token} from 'brandi'
import {Web3} from 'web3'
import type {SecretsProvider} from '../config/secrets'
import {SecretsTokens, WEB3Tokens} from './tokens'

function createWeb3(secretsProvider: SecretsProvider): Web3 {
    return new Web3(secretsProvider.getWeb3Secrets().rpcUrl)
}

injected(createWeb3, SecretsTokens.secrets)

export function createWeb3Module(): DependencyModule {
    const dependencyModule = new DependencyModule()

    dependencyModule.bind(WEB3Tokens.web3).toInstance(createWeb3).inSingletonScope()

    return dependencyModule
}
