module.exports = {

  development: {
    client: 'mysql',
    connection: {
      filename: 'dev.sqlite3',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'mysql',
    connection: {
      filename: 'pro.sqlite3',
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
  },

}
