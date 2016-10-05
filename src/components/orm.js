import bookshelf from 'bookshelf'
import knex from '../components/knex'

const instance = bookshelf(knex)
instance.plugin('registry')
instance.plugin('virtuals')
instance.plugin('visibility')

// require all models in 'models'
const requireModels = require.context('../models', false, /\.js$/)

const oldInstanceModel = instance.model.bind(instance)
instance.model = (modelName) => {
  const storedModel = oldInstanceModel(modelName)

  if (!storedModel) {
    return oldInstanceModel(modelName, requireModels(`./${modelName}.js`))
  }

  return storedModel
}

const BookshelfModel = instance.Model

export default class Model extends BookshelfModel {

}
