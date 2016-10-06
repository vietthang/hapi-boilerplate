import { Server } from 'hapi'
import { main } from '../../src'
import knex from '../../src/components/knex'

import { setup, teardown } from '../common'

before(() => setup(knex))

after(() => teardown(knex))

const server = new Server({ debug: false })

before(async () => main(server))

describe('Test server routes', () => {
  const childContext = require.context('./', false, /\.inc\.js$/)

  childContext.keys().forEach(key => childContext(key)(server))
})
