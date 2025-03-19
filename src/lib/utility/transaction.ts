import Web3 from 'web3'

// Send transaction and wait for receipt, with error handling
export async function sendTransaction(web3: Web3, txParams: any): Promise<any> {
    const receipt = await web3.eth.sendTransaction(txParams)

    if (!receipt.status) {
        throw new Error('Transaction failed: The smart contract execution reverted')
    }

    return receipt
}
