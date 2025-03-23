import {DependencyModule, injected} from 'brandi'
import {ConfigurationTokens} from './tokens'
import {EnvironmentConfigurationProvider, type ConfigurationProvider} from '../config/configuration'
import {createCustomLogger} from '../utility/logger'

function createConfigurationProvider(): ConfigurationProvider {
    const logger = createCustomLogger('config')
    return new EnvironmentConfigurationProvider(logger)
}

injected(createConfigurationProvider)

export function createConfigurationModule(): DependencyModule {
    const dependencyModule = new DependencyModule()

    dependencyModule.bind(ConfigurationTokens.configuration).toInstance(createConfigurationProvider).inSingletonScope()

    return dependencyModule
}
