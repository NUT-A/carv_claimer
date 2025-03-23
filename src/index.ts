import {getContainer, initializeContainer} from './lib/di'
import {Tokens} from './lib/di/tokens'
import type {LicenseService} from './lib/license/license'
import type {ClaimService} from './lib/claim'
import type {WithdrawService} from './lib/vecarv'
import type {Signale} from 'signale'
import type Web3 from 'web3'

async function runPipeline(
    targetWallet: string,
    defaultLogger: Signale,
    licenseService: LicenseService,
    claimService: ClaimService,
    withdrawService: WithdrawService,
): Promise<bigint> {
    defaultLogger.start(`Running pipeline for ${targetWallet}`)

    const licenses = await licenseService.getAllLicenses(targetWallet)
    await claimService.claim(licenses, targetWallet)
    return await withdrawService.withdraw(targetWallet)
}

function getWalletsList(shouldShuffle: boolean, web3: Web3, defaultLogger: Signale): string[] {
    const addresses = web3.eth.accounts.wallet.map((account: {address: string}) => account.address)
    defaultLogger.info(`Found ${addresses.length} wallets, shuffling...`)

    if (shouldShuffle) {
        const shuffledAddresses = addresses.sort(() => Math.random() - 0.5)
        defaultLogger.note(`Shuffled wallets: ${shuffledAddresses.join(', ')}`)

        return shuffledAddresses
    } else {
        defaultLogger.note(`Using wallets in original order: ${addresses.join(', ')}`)
        return addresses
    }
}

async function randomSleep(minMs: number, maxMs: number, logger: Signale): Promise<void> {
    const sleepTime = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs

    logger.pause(`Sleeping for ${sleepTime}ms`)
    await new Promise(resolve => setTimeout(resolve, sleepTime))
}

function printNewLine(): void {
    console.log('\n')
}

async function main(): Promise<void> {
    // Get the container
    const container = getContainer()

    // Initialize Moralis before using any services that depend on it
    await initializeContainer(container)

    const logger = container.get(Tokens.logger)

    const web3 = container.get(Tokens.web3)
    const addresses = getWalletsList(true, web3, logger)

    const licenseService = container.get(Tokens.licenseService)
    const claimService = container.get(Tokens.claimService)
    const withdrawService = container.get(Tokens.withdrawService)

    let totalWithdrawn = BigInt(0)

    printNewLine()

    for (const address of addresses) {
        const withdraw = await runPipeline(address, logger, licenseService, claimService, withdrawService)
        totalWithdrawn += withdraw

        // Sleep for random amount of time between 1 and 10 seconds
        await randomSleep(1000, 10000, logger)
        printNewLine()
    }

    const formattedWithdraw = web3.utils.fromWei(totalWithdrawn.toString(), 'ether')
    logger.success(`Withdrawn ${formattedWithdraw} tokens`)
}

await main()
