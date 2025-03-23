import Web3, {TransactionRevertInstructionError} from 'web3'
import type {WithdrawTransactionEncoder, LockDuration} from './abi'
import {sendTransaction} from '../utility/transaction'
import {createCustomLogger} from '../utility/logger'

export interface WithdrawService {
    /**
     * Withdraw all available tokens
     * @param targetWallet Address of the wallet to withdraw from
     * @returns The amount of tokens withdrawn as bigint
     */
    withdraw(targetWallet: string): Promise<bigint>
}

// Implementation of the WithdrawService using Web3
export class WEB3WithdrawService implements WithdrawService {
    private readonly logger = createCustomLogger('WEB3WithdrawService')

    constructor(private web3: Web3, private encoder: WithdrawTransactionEncoder, private lockDuration: LockDuration) {}

    async withdraw(targetWallet: string): Promise<bigint> {
        // Get the balance
        const balance = await this.encoder.balanceOf(targetWallet)
        this.logger.info(
            `Current balance for ${targetWallet}: ${this.web3.utils.fromWei(balance.toString(), 'ether')} tokens`,
        )

        if (balance === BigInt(0)) {
            this.logger.warn('No tokens available to withdraw')
            return BigInt(0)
        }

        // Build the transaction with the configured lock duration
        this.logger.debug(`Using lock duration: ${this.lockDuration} days`)
        const transaction = this.encoder.buildWithdrawTransaction({
            amount: balance,
            duration: this.lockDuration,
        })

        try {
            // Send transaction with the target wallet
            await sendTransaction(this.web3, {
                ...transaction,
                from: targetWallet,
                gas: 1000000, // Use constant gas here because gas estimation is not reliable
            })

            return balance
        } catch (error) {
            if (error instanceof TransactionRevertInstructionError) {
                this.logger.error(`Withdraw failed: ${error.reason}`)
                throw error
            } else {
                this.logger.error('Withdraw failed with unknown error:', error)
                throw error
            }
        }
    }
}
