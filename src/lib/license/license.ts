import Moralis from 'moralis'
import {EvmAddress} from '@moralisweb3/common-evm-utils'
import type {CustomSignale} from '../utility/logger'

export type LicenseInfo = Readonly<{
    tokenId: bigint
}>

export interface LicenseService {
    getAllLicenses(owner: string): Promise<LicenseInfo[]>
}

export class MoralisLicenseService implements LicenseService {
    constructor(
        private readonly moralis: typeof Moralis,
        private readonly logger: CustomSignale,
        private readonly contractAddress: string,
    ) {}

    // Gets all NFTs owned by an address and returns their license info
    async getAllLicenses(owner: string): Promise<LicenseInfo[]> {
        this.logger.await(`Getting all licenses...`)

        const moralisOwnerAddress = EvmAddress.create(owner)
        const moralisContractAddress = EvmAddress.create(this.contractAddress)

        const response = await this.moralis.EvmApi.nft.getWalletNFTs({
            tokenAddresses: [moralisContractAddress],
            address: moralisOwnerAddress,
        })

        // Extract license information from the response
        const licenses: LicenseInfo[] = response.result.map(nft => ({
            tokenId: BigInt(nft.tokenId),
        }))

        // Log the number of licenses found
        this.logger.complete(`Found ${licenses.length} licenses`)
        this.logger.breakInteractiveChain()

        return licenses
    }
}
