import Web3, {TransactionRevertInstructionError} from 'web3'
import type {WithdrawTransactionEncoder, LockDuration} from './abi'
import {sendTransaction} from '../utility/transaction'
import {type CustomSignale} from '../utility/logger'
import type {TransactionConfiguration} from '../config/configuration'

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
    constructor(
        private web3: Web3,
        private encoder: WithdrawTransactionEncoder,
        private logger: CustomSignale,
        private lockDuration: LockDuration,
        private txConfig: TransactionConfiguration,
    ) {}

    async withdraw(targetWallet: string): Promise<bigint> {
        this.logger.await(`Fetching balance for ${targetWallet}`)

        // Get the balance
        const balance = await this.encoder.balanceOf(targetWallet)
        const formattedBalance = this.web3.utils.fromWei(balance.toString(), 'ether')

        this.logger.await(`Current balance is ${formattedBalance} tokens`)

        if (balance === BigInt(0)) {
            this.logger.warn('No tokens available to withdraw')
            return BigInt(0)
        } else {
            // Build the transaction with the configured lock duration
            this.logger.await(`Withdrawing ${formattedBalance} tokens for ${this.lockDuration} days`)
            const transaction = this.encoder.buildWithdrawTransaction({
                amount: balance,
                duration: this.lockDuration,
            })

            try {
                // Send transaction with the target wallet
                await sendTransaction(this.web3, {
                    ...transaction,
                    from: targetWallet,
                    gas: this.txConfig.gas, // Use configured gas value
                })

                this.logger.complete(`Withdrew ${formattedBalance} tokens`)
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
}
