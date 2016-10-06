import { omit, isMatch, isNumber } from 'lodash/fp'
import uuid from 'uuid'

import assert from '../common/assert'

export default (server) => {
  const INVALID_ID = uuid.v4()

  let resource

  describe('Test resources routes', () => {
    describe('Test resource create', () => {
      const validPayload = {
        name: 'input.mp4',
        status: 1,
      }

      const validRequest = {
        method: 'post',
        url: '/api/v1/resources',
        payload: validPayload,
      }

      it('Should reject if missing \'name\'', async () => {
        const ret = await server.inject({
          ...validRequest,
          payload: omit('name', validPayload),
        })

        assert.equal(ret.statusCode, 400)
      })

      it('Should success submit valid payload', async () => {
        const ret = await server.inject(validRequest)

        assert.equal(ret.statusCode, 200)
        resource = JSON.parse(ret.payload)
        assert(isMatch(validPayload, resource))
      })
    })

    describe('Test resource find', () => {
      it('Should get list of resource with recently submit data', async () => {
        const ret = await server.inject({
          method: 'get',
          url: '/api/v1/resources',
        })

        assert.equal(ret.statusCode, 200)
        assert(isNumber(ret.headers['x-meta-total']))
        const resources = JSON.parse(ret.payload)
        assert(resources.find(entry => entry.id === resource.id))
      })
    })

    describe('Test get resource by ID', () => {
      it('Should reject with 400 if get by an bad format ID', async () => {
        const ret = await server.inject({
          method: 'get',
          url: '/api/v1/resources/0-0',
        })

        assert.equal(ret.statusCode, 400)
      })

      it('Should reject with 404 if get by an invalid ID', async () => {
        const ret = await server.inject({
          method: 'get',
          url: `/api/v1/resources/${INVALID_ID}`,
        })

        assert.equal(ret.statusCode, 404)
      })

      it('Shoud success and get the stored resource if submit created ID', async () => {
        const ret = await server.inject({
          method: 'get',
          url: `/api/v1/resources/${resource.id}`,
        })

        assert.equal(ret.statusCode, 200)
        const storedResource = JSON.parse(ret.payload)
        assert.deepEqual(resource, storedResource)
      })
    })

    describe('Test update resource by ID', () => {
      const validPayload = {
        name: 'input2.mp4',
        status: 0,
      }

      const validRequest = {
        method: 'put',
        get url() { return `/api/v1/resources/${resource.id}` }, // deffered getter
        payload: validPayload,
      }

      it('Should reject with 400 if get by an bad format ID', async () => {
        const ret = await server.inject({
          ...validRequest,
          url: '/api/v1/resources/0-0',
        })

        assert.equal(ret.statusCode, 400)
      })

      it('Should reject with 404 if get by an invalid ID', async () => {
        const ret = await server.inject({
          ...validRequest,
          url: `/api/v1/resources/${INVALID_ID}`,
        })

        assert.equal(ret.statusCode, 404)
      })

      it('Shoud success and get the stored resource if submit valid ID', async () => {
        const ret = await server.inject(validRequest)

        assert.equal(ret.statusCode, 200)
        const storedResource = JSON.parse(ret.payload)
        assert.deepEqual(omit('updatedAt', {
          ...resource,
          ...validPayload,
        }), omit('updatedAt', storedResource)) // compare 2 instances without updatedAt field
      })
    })

    describe('Test delete resource by ID', () => {
      const validRequest = {
        method: 'delete',
        get url() { return `/api/v1/resources/${resource.id}` }, // deffered getter
      }

      it('Should reject with 400 if delete by an bad format ID', async () => {
        const ret = await server.inject({
          ...validRequest,
          url: '/api/v1/resources/0-0',
        })

        assert.equal(ret.statusCode, 400)
      })

      it('Should reject with 404 if delete by an invalid ID', async () => {
        const ret = await server.inject({
          ...validRequest,
          url: `/api/v1/resources/${INVALID_ID}`,
        })

        assert.equal(ret.statusCode, 404)
      })

      it('Shoud success if delete by a valid ID', async () => {
        const ret = await server.inject(validRequest)

        assert.equal(ret.statusCode, 204)
      })

      it('Shoud reject with 404 if delete by a deleted ID', async () => {
        const ret = await server.inject(validRequest)

        assert.equal(ret.statusCode, 404)
      })

      it('Shoud reject with 404 if get by a deleted ID', async () => {
        const ret = await server.inject({
          ...validRequest,
          method: 'get',
        })

        assert.equal(ret.statusCode, 404)
      })
    })
  })
}
