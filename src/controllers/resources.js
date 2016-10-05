import Boom from 'boom'

import Resource from '../models/Resource'

export async function find(req, reply) {
  const total = await Resource.count()

  const { limit, offset, orderBy, orderDirection } = req.query

  const resources = await Resource.collection().query({
    limit,
    offset,
    orderBy: [orderBy, orderDirection],
  }).fetch()

  return reply(resources.toJSON())
    .header('X-Meta-Total', total)
}

export async function create(req) {
  const resource = await Resource.forge(req.payload).save()

  return resource.toJSON()
}

export async function get(req) {
  const { id } = req.params

  const resource = await Resource.forge({ id }).fetch()

  if (!resource) {
    throw Boom.notFound('Resource not found')
  }

  return resource.toJSON()
}

export async function update(req) {
  const { id } = req.params

  const resource = await Resource.forge({ id }).fetch()

  if (!resource) {
    throw Boom.notFound('Resource not found')
  }

  resource.set(req.payload)

  try {
    return (await resource.save()).toJSON()
  } catch (e) {
    if (e instanceof Resource.NoRowsUpdatedError) {
      throw Boom.notFound('Resource not found')
    } else {
      throw e
    }
  }
}

export async function destroy(req) {
  const { id } = req.params

  try {
    await Resource.forge({ id }).destroy({ require: true })
  } catch (error) {
    if (error instanceof Resource.NoRowsDeletedError) {
      throw Boom.notFound('Resource not found')
    } else {
      throw error
    }
  }
}
