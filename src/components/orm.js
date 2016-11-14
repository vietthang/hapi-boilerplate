import bookshelf from 'bookshelf'
import { Promise } from 'bluebird'
import {
  pipe, omitBy, isNil, omit, toPairs, fromPairs, has, filter, memoize, map, isObjectLike, isString, isArray, isFunction,
} from 'lodash/fp'
import { validate } from 'overjoy-swag'

import resolveAllOf from './resolveAllOf'
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

const validateAsync = Promise.promisify(validate)

class ValidationError extends Error {

}

async function doValidate(model, schema) {
  const attributes = pipe(
    omitBy(value => isNil(value)),
    omit(model.idAttribute), // never update the id field
  )(model.attributes)

  await validateAsync(
    schema,
    attributes,
  )

  const modelClass = model.constructor
  if (has('relations', modelClass)) {
    if (isArray(modelClass.relations)) {
      await Promise.map(modelClass.relations, async (relationName) => {
        const relationFunction = model[relationName]
        if (!isFunction(relationFunction)) {
          throw new ValidationError(`Property ${relationName} in ${model.tableName} is not a function.`)
        }

        const relation = model[relationName]().relatedData
        // only support "belongsTo" now
        if (relation.type === 'belongsTo') {
          const { targetTableName, targetIdAttribute } = relation
          const modelForeignKey = model.get(relation.foreignKey)

          const { count } = await knex
            .table(targetTableName)
            .where(targetIdAttribute, modelForeignKey)
            .count('id AS count')
            .first()

          if (count !== 1) {
            throw new ValidationError(
              `${targetTableName} with ${targetIdAttribute}=${modelForeignKey} not found`
            )
          }
        }
      })
    } else {
      throw new ValidationError(`${model.tableName} model attribute relations is not an array.`)
    }
  }
}

const getResolvedSchema = memoize(schema => ({
  ...resolveAllOf(schema),
  additionalProperties: false,
}))

export default class Model extends BookshelfModel {

  constructor(...args) {
    super(...args)

    const modelClass = this.constructor

    if (modelClass.schema) {
      const schema = getResolvedSchema(modelClass.schema)

      // console.log('schema', schema)

      this.on('creating', model => doValidate(model, schema))
      this.on('updating', model => doValidate(model, schema))
    }

    this.on('creating', () => {
      this.set('createdAt', Date.now())
      this.set('updatedAt', Date.now())
    })

    this.on('updating', () => {
      this.set('updatedAt', Date.now())
    })
  }

  parse(attributes) {
    const schema = getResolvedSchema(this.constructor.schema)

    if (schema) {
      return pipe(
        super.parse.bind(this),
        toPairs,
        // only get keys from schema to the model
        filter(([key]) => has(key, schema.properties)),
        map(([key, value]) => {
          // cast to boolean if key has type of boolean
          if (schema.properties[key].type === 'boolean') {
            return [key, !!value]
          }

          // parse to json if schema key has type of object
          if (schema.properties[key].type === 'object' && isString(value)) {
            return [key, JSON.parse(value)]
          }

          return [key, value]
        }),
        fromPairs,
      )(attributes)
    } else {
      return super.parse(attributes)
    }
  }

  format(attributes) {
    const schema = getResolvedSchema(this.constructor.schema)

    if (schema) {
      return pipe(
        super.parse.bind(this),
        toPairs,
        // only get keys from schema to the model
        filter(([key]) => has(key, schema.properties)),
        map(([key, value]) => {
          // convert to string if schema key has type of object
          if (schema.properties[key].type === 'object' && isObjectLike(value)) {
            return [key, JSON.stringify(value)]
          }

          return [key, value]
        }),
        fromPairs,
      )(attributes)
    } else {
      return super.format(attributes)
    }
  }

  serialize(options) {
    return pipe(
      super.serialize.bind(this),
      omitBy(value => isNil(value)),
    )(options)
  }

}

Model.ValidationError = ValidationError
