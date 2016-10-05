import redis from 'redis'
import { Promise } from 'bluebird'

import { config } from './config'

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

export default redis.createClient(config('/modules/redis/client'))
