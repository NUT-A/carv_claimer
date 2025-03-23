import {DependencyModule, injected, token} from 'brandi'
import {MoralisLicenseService, type LicenseService} from '../license/license'
import {LoggerTokens, MoralisTokens, LicenseTokens, ConfigurationTokens} from './tokens'
import type Moralis from 'moralis'
import type {Signale} from 'signale'
import type {ConfigurationProvider} from '../config/configuration'

// Get license contract address from configuration provider
function getLicenseContractAddress(configProvider: ConfigurationProvider): string {
    return configProvider.getContractAddresses().license
}

// Create the license service directly now that Moralis is available
function createLicenseService(moralis: typeof Moralis, logger: Signale, contractAddress: string): LicenseService {
    return new MoralisLicenseService(moralis, logger, contractAddress)
}

// Inject dependencies
injected(getLicenseContractAddress, ConfigurationTokens.configuration)
injected(createLicenseService, MoralisTokens.moralis, LoggerTokens.logger, LicenseTokens.licenseContractAddress)

// Create a module for license service
export function createLicenseModule(): DependencyModule {
    const module = new DependencyModule()

    // Bind contract address from configuration provider
    module.bind(LicenseTokens.licenseContractAddress).toInstance(getLicenseContractAddress).inSingletonScope()

    // Bind license service directly
    module.bind(LicenseTokens.licenseService).toInstance(createLicenseService).inSingletonScope()

    return module
}
