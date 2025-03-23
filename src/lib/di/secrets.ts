import {DependencyModule, injected, type Factory} from 'brandi'
import {LoggerTokens, SecretsTokens} from './tokens'
import {EnvironmentSecretsProvider} from '../config/secrets'
import type {CustomSignale} from '../utility/logger'

function createSecretsProvider(
    loggerFactory: Factory<CustomSignale, [scope: string, interactive?: boolean]>,
): EnvironmentSecretsProvider {
    return new EnvironmentSecretsProvider(loggerFactory('secrets', false))
}

injected(createSecretsProvider, LoggerTokens.customLoggerFactory)

export function createSecretsModule(): DependencyModule {
    const dependencyModule = new DependencyModule()

    dependencyModule.bind(SecretsTokens.secrets).toInstance(createSecretsProvider).inSingletonScope()

    return dependencyModule
}
