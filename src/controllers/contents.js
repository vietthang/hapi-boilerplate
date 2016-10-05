import Boom from 'boom'

import Content from '../models/Content'

export async function find(req, reply) {
  const total = await Content.count()

  const { limit, offset, orderBy, orderDirection } = req.query

  const contents = await Content.collection().query({
    limit,
    offset,
    orderBy: [orderBy, orderDirection],
  }).fetch()

  return reply(contents.toJSON())
    .header('X-Meta-Total', total)
}

export async function create(req) {
  const content = await Content.forge(req.payload).save()

  return content.toJSON()
}

export async function get(req) {
  const { id } = req.params

  const content = await Content.forge({ id }).fetch()

  if (!content) {
    throw Boom.notFound('Content not found')
  }

  return content
}

export async function update(req) {
  const { id } = req.params

  const content = await Content.forge({ id }).fetch()

  if (!content) {
    throw Boom.notFound('Content not found')
  }

  content.set(req.payload)

  try {
    return (await content.save()).toJSON()
  } catch (e) {
    if (e instanceof Content.NoRowsUpdatedError) {
      throw Boom.notFound('Content not found')
    } else {
      throw e
    }
  }
}

export async function destroy(req) {
  const { id } = req.params

  try {
    await Content.forge({ id }).destroy({ require: true })
  } catch (error) {
    if (error instanceof Content.NoRowsDeletedError) {
      throw Boom.notFound('Content not found')
    } else {
      throw error
    }
  }
}
