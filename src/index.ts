import {getContainer, initializeContainer} from './lib/di'
import {Tokens} from './lib/di/tokens'

async function main(): Promise<void> {
    // Get the container
    const container = getContainer()

    container.bind(Tokens.defaultOptions).toConstant({})
    container.bind(Tokens.defaultScope).toConstant('carv')

    // Initialize Moralis before using any services that depend on it
    await initializeContainer(container)

    // Get the license service (now synchronously available)
    const licenseService = container.get(Tokens.licenseService)
    const licenses = await licenseService.getAllLicenses('0x703B8F516d6f1679338840f3b060BA16518763Cd')
    const ids = licenses.map(license => license.tokenId.toString())

    const logger = container.get(Tokens.logger)
    logger.success(`Found ${ids.length} licenses: ${ids.join(', ')}`)
}

await main()
