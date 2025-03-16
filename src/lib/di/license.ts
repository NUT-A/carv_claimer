import {DependencyModule, injected, token} from 'brandi'
import {MoralisLicenseService, type LicenseService} from '../license/license'
import {LoggerTokens, MoralisTokens, LicenseTokens} from './tokens'
import type Moralis from 'moralis'
import type {Signale} from 'signale'

// Create the license service directly now that Moralis is available
function createLicenseService(moralis: typeof Moralis, logger: Signale, contractAddress: string): LicenseService {
    return new MoralisLicenseService(moralis, logger, contractAddress)
}

// Inject dependencies
injected(createLicenseService, MoralisTokens.moralis, LoggerTokens.logger, LicenseTokens.licenseContractAddress)

// Create a module for license service
export function createLicenseModule(): DependencyModule {
    const module = new DependencyModule()

    // Bind default contract address
    const defaultContractAddress = '0x6584533decbcb8c05fb7EAbFa93f92b7b3A85038'
    module.bind(LicenseTokens.licenseContractAddress).toConstant(defaultContractAddress)

    // Bind license service directly
    module.bind(LicenseTokens.licenseService).toInstance(createLicenseService).inSingletonScope()

    return module
}
