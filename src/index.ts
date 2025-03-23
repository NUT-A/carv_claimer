import {getContainer, initializeContainer} from './lib/di'
import {Tokens} from './lib/di/tokens'

async function main(): Promise<void> {
    // Get the container
    const container = getContainer()

    // Initialize Moralis before using any services that depend on it
    await initializeContainer(container)

    const logger = container.get(Tokens.logger)

    const web3 = container.get(Tokens.web3)
    const address = web3.eth.accounts.wallet[0]!.address

    logger.info(`Address: ${address}`)

    // Get the license service (now synchronously available)
    const licenseService = container.get(Tokens.licenseService)
    const licenses = await licenseService.getAllLicenses(address)
    const ids = licenses.map(license => license.tokenId.toString())

    logger.info(`Found ${ids.length} licenses: ${ids.join(', ')}`)

    const claimService = container.get(Tokens.claimService)
    const claim = await claimService.claim(licenses, address)

    logger.info(`Claimed ${claim} rewards`)

    const withdrawService = container.get(Tokens.withdrawService)
    const withdraw = await withdrawService.withdraw(address)

    logger.success(`Withdrawn ${withdraw} tokens`)
}

await main()
