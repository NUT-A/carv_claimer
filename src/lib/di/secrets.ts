import {DependencyModule} from 'brandi'
import {SecretsTokens} from './tokens'
import {StubSecretsProvider} from './stubs'

export function createSecretsModule(): DependencyModule {
    const dependencyModule = new DependencyModule()

    dependencyModule.bind(SecretsTokens.secrets).toInstance(StubSecretsProvider).inTransientScope()

    return dependencyModule
}
