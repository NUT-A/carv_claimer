import {DependencyModule} from 'brandi'
import {ConfigurationTokens} from './tokens'
import {StubConfigurationProvider} from './stubs'

export function createConfigurationModule(): DependencyModule {
    const dependencyModule = new DependencyModule()

    dependencyModule.bind(ConfigurationTokens.configuration).toInstance(StubConfigurationProvider).inTransientScope()

    return dependencyModule
}
