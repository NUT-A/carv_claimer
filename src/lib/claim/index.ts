import Web3, {TransactionRevertInstructionError} from 'web3'
import type {ClaimTransactionEncoder, RewardExtractor} from './abi'
import type {LicenseInfo} from '../license/license'
import {sendTransaction} from '../utility/transaction'
import type {CustomSignale} from '../utility/logger'
import type {TransactionConfiguration} from '../config/configuration'

export interface ClaimService {
    /**
     * Claim rewards for multiple licenses
     * @param licenses Array of license information containing token IDs to claim
     * @param walletAddress Address of the wallet to claim rewards for
     * @returns Amount of rewards claimed (in token units)
     */
    claim(licenses: LicenseInfo[], walletAddress: string): Promise<number>
}

// Implementation of the ClaimService using Web3
export class WEB3ClaimService implements ClaimService {
    constructor(
        private web3: Web3,
        private encoder: ClaimTransactionEncoder,
        private rewardExtractor: RewardExtractor,
        private logger: CustomSignale,
        private txConfig: TransactionConfiguration,
    ) {}

    async claim(licenses: LicenseInfo[], walletAddress: string): Promise<number> {
        this.logger.await(`Claiming rewards for ${licenses.length} licenses`)

        // Extract token IDs from license information
        const tokenIds = licenses.map(license => license.tokenId)

        // Build the transaction
        const transaction = this.encoder.buildClaimRewardsTransaction(tokenIds)

        try {
            // Send transaction using the provided wallet address
            const receipt = await sendTransaction(this.web3, {
                ...transaction,
                from: walletAddress,
                gas: this.txConfig.gas, // Use configured gas value
            })

            // Extract claimed reward amount from logs using the reward extractor
            if (receipt.logs) {
                const rewards = this.rewardExtractor.extractRewardsFromLogs(this.web3, receipt.logs)
                this.logger.complete(`Claimed ${rewards} rewards`)
                return rewards
            } else {
                this.logger.warn(`No rewards claimed for ${walletAddress}`)
                return 0
            }
        } catch (error) {
            if (
                error instanceof TransactionRevertInstructionError &&
                error.reason.includes('execution reverted: No reward')
            ) {
                this.logger.warn(`No rewards claimed for ${walletAddress}`)
                return 0
            } else {
                this.logger.error(`Error claiming rewards for ${walletAddress}`, error)
                throw error
            }
        } finally {
            this.logger.breakInteractiveChain()
        }
    }
}
