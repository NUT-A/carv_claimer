import type {SignaleOptions} from 'signale'
import type {LockDuration} from '../vecarv/abi'

export type ContractAddresses = Readonly<{
    veCarv: string
    claim: string
    license: string
}>

export type VeCarvConfiguration = Readonly<{
    defaultLockDuration: LockDuration
}>

export type AppConfiguration = Readonly<{
    defaultScope: string
    loggerOptions: SignaleOptions
}>

export interface ConfigurationProvider {
    getContractAddresses(): ContractAddresses
    getAppConfiguration(): AppConfiguration
    getVeCarvConfiguration(): VeCarvConfiguration
}
