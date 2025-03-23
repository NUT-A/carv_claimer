import {DependencyModule, injected} from 'brandi'
import {Signale, type SignaleOptions} from 'signale'
import {createCustomLogger, type CustomSignale} from '../utility/logger'
import {LoggerTokens, ConfigurationTokens} from './tokens'
import type {ConfigurationProvider} from '../config/configuration'

// Get default scope from configuration provider
function getDefaultScope(configProvider: ConfigurationProvider): string {
    return configProvider.getAppConfiguration().defaultScope
}

// Get logger options from configuration provider
function getLoggerOptions(configProvider: ConfigurationProvider): SignaleOptions {
    return configProvider.getAppConfiguration().loggerOptions
}

// Function to create a standard logger
function createLogger(options: SignaleOptions, scope: string): Signale {
    return new Signale({...options, scope})
}

// Function to create a custom logger
function createExtendedLogger(options: SignaleOptions, scope: string): CustomSignale {
    return createCustomLogger(scope, options)
}

// Inject dependencies for the singleton logger
function createDefaultLogger(options: SignaleOptions, defaultScope: string): Signale {
    return createLogger(options, defaultScope)
}

injected(getDefaultScope, ConfigurationTokens.configuration)
injected(getLoggerOptions, ConfigurationTokens.configuration)
injected(createDefaultLogger, LoggerTokens.defaultOptions, LoggerTokens.defaultScope)

// Create factory function that uses injected options
function createLoggerFactory(options: SignaleOptions): (scope: string) => Signale {
    return (scope: string) => createLogger(options, scope)
}

// Create custom factory function that uses injected options
function createCustomLoggerFactory(options: SignaleOptions): (scope: string, interactive?: boolean) => CustomSignale {
    return (scope: string, interactive?: boolean) => {
        const updatedOptions = {...options, interactive}
        const logger = createExtendedLogger(updatedOptions, scope)

        return logger
    }
}

// Inject dependencies for factory functions
injected(createLoggerFactory, LoggerTokens.defaultOptions)
injected(createCustomLoggerFactory, LoggerTokens.defaultOptions)

export function createLoggerModule(): DependencyModule {
    const module = new DependencyModule()

    // Bind logger options and default scope from configuration
    module.bind(LoggerTokens.defaultOptions).toInstance(getLoggerOptions).inSingletonScope()
    module.bind(LoggerTokens.defaultScope).toInstance(getDefaultScope).inSingletonScope()

    // Bind the singleton logger instance
    module.bind(LoggerTokens.logger).toInstance(createDefaultLogger).inSingletonScope()

    // Bind the factory functions
    module.bind(LoggerTokens.loggerFactory).toInstance(createLoggerFactory).inTransientScope()
    module.bind(LoggerTokens.customLoggerFactory).toInstance(createCustomLoggerFactory).inTransientScope()

    return module
}
