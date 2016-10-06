import bookshelf from 'bookshelf'
import Joi from 'joi'
import { Promise } from 'bluebird'
import { pipe, omitBy, isNil } from 'lodash/fp'

import { makeJoiSchema } from '../modules/apiLoader'
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

const joiValidateAsync = Promise.promisify(Joi.validate)

async function doValidate(attributes, schema) {
  await joiValidateAsync(omitBy(value => isNil(value), attributes), schema)
}

export default class Model extends BookshelfModel {

  constructor(...args) {
    super(...args)

    const modelClass = this.constructor

    if (modelClass.schema) {
      const joiSchema = makeJoiSchema(modelClass.schema)

      this.on('creating', () => doValidate(this.attributes, joiSchema))
      this.on('updating', () => doValidate(this.attributes, joiSchema))
    }
  }

  serialize(options) {
    return pipe(
      super.serialize.bind(this),
      omitBy(value => isNil(value)),
    )(options)
  }

}
