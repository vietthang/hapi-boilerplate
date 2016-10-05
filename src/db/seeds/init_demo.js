export async function seed(knex) {
  await knex('Resource').truncate()
  const [resourceId1] = await knex('Resource').insert({
    name: 'Demo Resource #1',
    mime: 'application/octet-stream',
    md5: '14994fe4b40716b7029045a559ef8922',
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }, 'id')
  const [resourceId2] = await knex('Resource').insert({
    name: 'Demo Resource #2',
    mime: 'application/octet-stream',
    md5: 'f58016895b18052d00e0ae82359a570b',
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }, 'id')
  const [resourceId3] = await knex('Resource').insert({
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
    title: 'Demo Content #1',
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
    title: 'Demo Content #2',
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
    title: 'Demo Content #3',
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
    title: 'Demo Content #4',
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
    title: 'Demo Content #5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas id quam eget rutrum.',
    data: JSON.stringify({
      foo: 'bar',
    }),
    status: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}
