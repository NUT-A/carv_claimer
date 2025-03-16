import {Signale, SignaleOptions} from 'signale'

export interface CustomSignale extends Signale {
    breakInteractiveChain: () => void
}

export function createCustomLogger(scope: string, options: SignaleOptions = {}): CustomSignale {
    const logger = new Signale({scope, ...options}) as CustomSignale
    logger.breakInteractiveChain = () => console.log()
    return logger
}
