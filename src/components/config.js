import { Store } from 'confidence'
import rawConfig from '../config'

const criteria = { env: process.env.NODE_ENV || 'development' }
const store = new Store(rawConfig)

export function config(key) {
  return store.get(key, criteria)
}
