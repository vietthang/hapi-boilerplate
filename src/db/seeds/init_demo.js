import uuid from 'uuid'

export async function seed(knex) {
  await knex('Resource').truncate()
  const resourceId1 = uuid.v4()
  await knex('Resource').insert({
    id: resourceId1,
    name: 'Demo Resource #1',
    mime: 'application/octet-stream',
    md5: '14994fe4b40716b7029045a559ef8922',
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  const resourceId2 = uuid.v4()
  await knex('Resource').insert({
    id: resourceId2,
    name: 'Demo Resource #2',
    mime: 'application/octet-stream',
    md5: 'f58016895b18052d00e0ae82359a570b',
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }, 'id')
  const resourceId3 = uuid.v4()
  await knex('Resource').insert({
    id: resourceId3,
    name: 'Demo Resource #3',
    mime: 'application/octet-stream',
    md5: 'cc9f2c34a503775c8803ca42bd725e26',
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }, 'id')

  await knex('Content').truncate()
  await knex('Content').insert({
    resourceId: resourceId1,
    name: 'Demo Content #1',
    title: 'Donec nec placerat purus',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas id quam eget rutrum.',
    data: JSON.stringify({
      foo: 'bar',
    }),
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  await knex('Content').insert({
    resourceId: resourceId1,
    name: 'Demo Content #2',
    title: 'Donec nec placerat purus',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas id quam eget rutrum.',
    data: JSON.stringify({
      foo: 'bar',
    }),
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  await knex('Content').insert({
    resourceId: resourceId2,
    name: 'Demo Content #3',
    title: 'Donec nec placerat purus',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas id quam eget rutrum.',
    data: JSON.stringify({
      foo: 'bar',
    }),
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  await knex('Content').insert({
    resourceId: resourceId2,
    name: 'Demo Content #4',
    title: 'Donec nec placerat purus',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas id quam eget rutrum.',
    data: JSON.stringify({
      foo: 'bar',
    }),
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  await knex('Content').insert({
    resourceId: resourceId3,
    name: 'Demo Content #5',
    title: 'Donec nec placerat purus',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas id quam eget rutrum.',
    data: JSON.stringify({
      foo: 'bar',
    }),
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}
