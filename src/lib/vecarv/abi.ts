import Web3 from 'web3'
import fullABI from './abi.json'

// Extract only the withdraw and balanceOf methods from the full ABI
export const vecarvABI = fullABI.filter(
    item => item.type === 'function' && (item.name === 'withdraw' || item.name === 'balanceOf'),
)

// Get the specific function ABIs
export const withdrawABI = vecarvABI.find(item => item.name === 'withdraw')!
export const balanceOfABI = vecarvABI.find(item => item.name === 'balanceOf')!

// Type definitions for typesafe contract interactions
export type LockDuration = 15 | 90 | 150

// Helper function to convert days to seconds
export function daysToSeconds(days: LockDuration): number {
    return days * 24 * 60 * 60
}

export type WithdrawParams = {
    amount: string | number | bigint
    duration: LockDuration
}

// Define a type for a prepared transaction
export type PreparedTransaction = {
    to: string
    data: string
}

export interface WithdrawTransactionEncoder {
    buildWithdrawTransaction(params: WithdrawParams): PreparedTransaction
    balanceOf(targetWallet: string): Promise<bigint>
}

export class WEB3WithdrawTransactionEncoder implements WithdrawTransactionEncoder {
    constructor(private web3: Web3, private contractAddress: string) {}

    buildWithdrawTransaction(params: WithdrawParams): PreparedTransaction {
        if (!withdrawABI) {
            throw new Error('withdraw ABI definition not found')
        }

        // Convert duration from days to seconds
        const durationInSeconds = daysToSeconds(params.duration)

        // Create the transaction data using the withdraw function
        const data = this.web3.eth.abi.encodeFunctionCall(withdrawABI as any, [
            params.amount.toString(),
            durationInSeconds.toString(),
        ])

        // Return the prepared transaction
        return {
            to: this.contractAddress,
            data: data,
        }
    }

    async balanceOf(targetWallet: string): Promise<bigint> {
        if (!balanceOfABI) {
            throw new Error('balanceOf ABI definition not found')
        }

        // Create contract instance
        const contract = new this.web3.eth.Contract([balanceOfABI], this.contractAddress)

        // Make sure the method exists
        const balanceOfMethod = contract.methods.balanceOf
        if (!balanceOfMethod) {
            throw new Error('balanceOf method not found in contract')
        }

        // Call the method and convert the result to bigint
        const balance: string = await balanceOfMethod(targetWallet).call()
        return BigInt(balance)
    }
}
