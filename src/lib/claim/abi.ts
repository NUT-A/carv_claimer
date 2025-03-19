import Web3 from 'web3'
import fullABI from './abi.json'

// Extract only the claimRewards and multicall methods from the full ABI
export const claimABI = fullABI.filter(
    item => item.type === 'function' && (item.name === 'claimRewards' || item.name === 'multicall'),
)

// Get the ClaimRewards event ABI
export const claimRewardsEventABI = fullABI.find(item => item.type === 'event' && item.name === 'ClaimRewards')

// Get the specific function and event ABIs
export const claimRewardsABI = claimABI.find(item => item.name === 'claimRewards')
export const multicallABI = claimABI.find(item => item.name === 'multicall')

// Type definitions for typesafe contract interactions
export type ClaimTokenId = number | string | bigint

// Private type for internal use
type MulticallParams = {
    data: string[]
}

// Define a type for a prepared transaction
export type PreparedTransaction = {
    to: string
    data: string
}

// Define interface for extracting reward amounts from logs
export interface RewardExtractor {
    /**
     * Extract total reward amount from transaction receipt logs
     * @param web3 Web3 instance
     * @param logs Transaction receipt logs
     * @returns Total reward amount as a number
     */
    extractRewardsFromLogs(web3: Web3, logs: any[]): number
}

export class ClaimRewardExtractor implements RewardExtractor {
    // Cache the event signature
    private eventSignature: string

    constructor(private web3: Web3) {
        // Generate the event signature hash
        if (!claimRewardsEventABI) {
            throw new Error('ClaimRewards event ABI definition not found')
        }

        // Create the event signature manually based on the ABI
        this.eventSignature = this.web3.eth.abi.encodeEventSignature('ClaimRewards(uint256,address,uint256)')
    }

    extractRewardsFromLogs(web3: Web3, logs: any[]): number {
        let totalRewardsWei = BigInt(0)

        // Return 0 if no logs
        if (!logs || !logs.length) {
            return 0
        }

        // Process each log
        for (const log of logs) {
            // Check if this log matches our event signature
            if (log.topics && log.topics[0] === this.eventSignature) {
                if (log.data) {
                    try {
                        // The ClaimRewards event has 3 parameters:
                        // tokenID (uint256), claimer (address), rewards (uint256)
                        const decodedData = web3.eth.abi.decodeParameters(['uint256', 'address', 'uint256'], log.data)

                        // The reward amount is the third parameter - it's in wei
                        const rewardAmountWei = String(decodedData[2])
                        totalRewardsWei += BigInt(rewardAmountWei)
                    } catch (error) {
                        console.error('Error decoding ClaimRewards event data:', error)
                    }
                }
            }
        }

        if (totalRewardsWei === BigInt(0)) {
            return 0
        }

        // Convert wei to ether using Web3's utility
        // This converts to a decimal string with 18 decimal places
        const etherValue = web3.utils.fromWei(totalRewardsWei.toString(), 'ether')

        // Parse to a number and round to 2 decimal places for a clean display value
        return parseFloat(parseFloat(etherValue).toFixed(2))
    }
}

export interface ClaimTransactionEncoder {
    buildClaimRewardsTransaction(tokenIds: ClaimTokenId[]): PreparedTransaction
}

export class WEB3ClaimTransactionEncoder implements ClaimTransactionEncoder {
    private contractAddress: string

    constructor(private web3: Web3, contractAddress: string) {
        this.contractAddress = contractAddress
    }

    private encodeClaimRewardsCall(tokenId: number | string | bigint): string {
        // Use the filtered claimRewardsABI instead of manually defining the function
        if (!claimRewardsABI) {
            throw new Error('claimRewards ABI definition not found')
        }

        return this.web3.eth.abi.encodeFunctionCall(claimRewardsABI as any, [tokenId.toString()])
    }

    private buildClaimRewardsMulticallData(tokenIds: ClaimTokenId[]): MulticallParams {
        // Create encoded data for each tokenId
        const encodedCalls = tokenIds.map(this.encodeClaimRewardsCall.bind(this))

        return {
            data: encodedCalls,
        }
    }

    buildClaimRewardsTransaction(tokenIds: ClaimTokenId[]): PreparedTransaction {
        // Get the multicall parameters first
        const multicallParams = this.buildClaimRewardsMulticallData(tokenIds)

        // Encode the multicall function call
        if (!multicallABI) {
            throw new Error('multicall ABI definition not found')
        }

        // Create the transaction data using the multicall function with the encoded calls
        const data = this.web3.eth.abi.encodeFunctionCall(multicallABI as any, [multicallParams.data])

        // Return the prepared transaction
        return {
            to: this.contractAddress,
            data: data,
        }
    }
}
