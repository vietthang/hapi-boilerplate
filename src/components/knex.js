import Knex from 'knex'
import knexConfig from '../db/knexfile'

const env = process.env.NODE_ENV || 'development'

const instance = new Knex(knexConfig[env])
instance.debug(env !== 'production')

export default instance
