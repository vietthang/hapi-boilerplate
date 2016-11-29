export async function up(knex) {
  await knex.schema.createTable('Resource', (table) => {
    table.uuid('id').notNullable().primary()
    table.string('name', 32).notNullable()
    table.string('mime', 32)
    table.string('md5')
    table.integer('status').notNullable()
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt')
  })

  await knex.schema.createTable('Content', (table) => {
    table.increments()
    table.uuid('resourceId').notNullable().references('Resource.id')
    table.string('name', 32)
    table.string('title', 255)
    table.text('description')
    table.json('data')
    table.integer('status').notNullable()
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt')
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('Content')
  await knex.schema.dropTableIfExists('Resource')
}
