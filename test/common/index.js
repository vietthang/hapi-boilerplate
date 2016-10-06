import { Promise } from 'bluebird'
import { reverse } from 'lodash/fp'

import knex from '../../src/components/knex'

export async function setup() {
  const requireDbMigrations = require.context('../../src/db/migrations', false, /\.js$/)

  await Promise.each(requireDbMigrations.keys(), key => requireDbMigrations(key).up(knex, Promise))
}

export async function teardown() {
  const requireDbMigrations = require.context('../../src/db/migrations', false, /\.js$/)

  await Promise.each(reverse(requireDbMigrations.keys()), key => requireDbMigrations(key).down(knex, Promise))
}
