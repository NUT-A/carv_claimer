import {DependencyModule, injected} from 'brandi'
import {ConfigurationTokens, SleepTokens} from './tokens'
import {DefaultSleepService} from '../sleep'
import type {ConfigurationProvider} from '../config/configuration'

function createSleepService(configProvider: ConfigurationProvider): DefaultSleepService {
    const sleepConfig = configProvider.getSleepConfiguration()
    return new DefaultSleepService(sleepConfig)
}

injected(createSleepService, ConfigurationTokens.configuration)

export function createSleepModule(): DependencyModule {
    const dependencyModule = new DependencyModule()

    dependencyModule.bind(SleepTokens.sleepService).toInstance(createSleepService).inSingletonScope()

    return dependencyModule
}
