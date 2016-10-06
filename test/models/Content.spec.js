import { omit, isMatch } from 'lodash/fp'

import assert from '../common/assert'
import { setup, teardown } from '../common'
import Content from '../../src/models/Content'
import Resource from '../../src/models/Resource'

describe('Test Content model', () => {
  before(() => setup())

  after(() => teardown())

  describe('Create Content', () => {
    const validModel = {
      name: 'input.mp4',
      title: 'Input file for test',
      description: 'Lorem ipsum',
      data: {
        mime: 'video/mpeg4',
      },
      status: 2,
    }

    before(async () => {
      const resource = await Resource.forge({
        name: 'input.mp4',
        md5: '2b4c9f4a2d219937a1f7302c593ff025',
        status: 2,
      }).save()

      validModel.resourceId = resource.id
    })

    it('Should reject if missing \'name\'', () =>
      assert.isRejected(Content.forge(omit('name', validModel)).save())
    )

    it('Should reject if missing \'resourceId\'', () =>
      assert.isRejected(Content.forge(omit('resourceId', validModel)).save())
    )

    it('Should reject if missing \'data\'', () =>
      assert.isRejected(Content.forge(omit('data', validModel)).save())
    )

    // it('Should reject if submit invalid \'resourceId\'', () =>
    //   assert.isRejected(Content.forge({
    //     ...validModel,
    //     resourceId: uuid.v4(),
    //   }).save())
    // )

    it('Should success if submit valid data', async () => {
      const task = await Content.forge(validModel).save()
      assert(isMatch(validModel, task.toJSON()))
    })

    it('Should reject if include extra data', async () => {
      await assert.isRejected(Content.forge({
        ...validModel,
        foo: 'bar',
      }).save())
    })
  })
})
