import { omit, isMatch } from 'lodash/fp'
import assert from '../common/assert'
import { setup, teardown } from '../common'
import Resource from '../../src/models/Resource'

const uuidPattern = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/

describe('Test Resource model', () => {
  before(() => setup())

  after(() => teardown())

  describe('Create Resource', () => {
    const validModel = {
      name: 'input.mp4',
      md5: '2b4c9f4a2d219937a1f7302c593ff025',
      status: 2,
    }

    it('Should reject if missing \'name\'', () =>
      assert.isRejected(Resource.forge(omit('name')(validModel)).save())
    )

    it('Should success if missing \'md5\'', async () => {
      const task = await Resource.forge(omit('md5')(validModel)).save()
      assert(isMatch(omit('md5', validModel), task.toJSON()))
    })

    it('Should reject if md5 is an invalid string', () =>
      assert.isRejected(Resource.forge({
        ...validModel,
        md5: 'Invalid',
      }).save())
    )

    it('Should success if submit valid data and generate id as an uuid string', async () => {
      const task = await Resource.forge(validModel).save()
      assert(isMatch(validModel, task.toJSON()))
      assert(uuidPattern.test(task.id))
    })

    it('Should reject if include extra data', async () => {
      await assert.isRejected(Resource.forge({
        ...validModel,
        foo: 'bar',
      }).save())
    })
  })
})
