import Web3, {TransactionRevertInstructionError} from 'web3'
import type {ClaimTransactionEncoder, RewardExtractor} from './abi'
import type {LicenseInfo} from '../license/license'
import {sendTransaction} from '../utility/transaction'

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
    ) {}

    async claim(licenses: LicenseInfo[], walletAddress: string): Promise<number> {
        // Extract token IDs from license information
        const tokenIds = licenses.map(license => license.tokenId)

        // Build the transaction
        const transaction = this.encoder.buildClaimRewardsTransaction(tokenIds)

        try {
            // Send transaction using the provided wallet address
            const receipt = await sendTransaction(this.web3, {
                ...transaction,
                from: walletAddress,
                gas: 1000000, // Use constant gas here because gas estimation is not reliable
            })

            // Extract claimed reward amount from logs using the reward extractor
            if (receipt.logs) {
                return this.rewardExtractor.extractRewardsFromLogs(this.web3, receipt.logs)
            }

            return 0
        } catch (error) {
            if (
                error instanceof TransactionRevertInstructionError &&
                error.reason.includes('execution reverted: No reward')
            ) {
                return 0
            } else {
                throw error
            }
        }
    }
}
