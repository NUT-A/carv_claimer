import type {Signale} from 'signale'
import type {SleepConfiguration} from '../config/configuration'

export interface SleepService {
    /**
     * Sleep for a random duration between the configured min and max values
     * @param logger Optional logger to log the sleep duration
     */
    randomSleep(logger?: Signale): Promise<void>

    /**
     * Sleep for a specified duration
     * @param ms Duration in milliseconds
     * @param logger Optional logger to log the sleep duration
     */
    sleep(ms: number, logger?: Signale): Promise<void>
}

export class DefaultSleepService implements SleepService {
    private readonly config: SleepConfiguration

    constructor(config: SleepConfiguration) {
        this.config = config
    }

    async randomSleep(logger?: Signale): Promise<void> {
        const {minSleepMS, maxSleepMS} = this.config
        const sleepTime = Math.floor(Math.random() * (maxSleepMS - minSleepMS + 1)) + minSleepMS

        if (logger) {
            logger.pause(`Sleeping for ${sleepTime}ms`)
        }

        await this.sleep(sleepTime)
    }

    async sleep(ms: number, logger?: Signale): Promise<void> {
        if (logger) {
            logger.pause(`Sleeping for ${ms}ms`)
        }

        await new Promise(resolve => setTimeout(resolve, ms))
    }
}
