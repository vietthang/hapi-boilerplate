/* eslint no-use-before-define: [0] */
import SwaggerParser from 'swagger-parser'
import {
  pipe, map, flatMap, has, mapValues, omit, pickBy, flatten, groupBy, mapKeys, isNil, reject, toPairs, isString,
  isFunction,
} from 'lodash/fp'
import Joi from 'joi'
import Boom from 'boom'
import path from 'path'

import resolveAllOf from '../components/resolveAllOf'

function applyRuleAttribute(rule, attribute, modifier) {
  if (has(attribute, rule)) {
    return thiz => modifier(thiz, rule[attribute])
  } else {
    return thiz => thiz
  }
}

function makeJoiStringSchema(rule) {
  return pipe(
    applyRuleAttribute(rule, 'maxLength', (schema, value) => schema.max(value)),
    applyRuleAttribute(rule, 'minLength', (schema, value) => schema.min(value)),
    applyRuleAttribute(rule, 'pattern', (schema, value) => schema.regex(new RegExp(value))),
    applyRuleAttribute(rule, 'format', (schema, value) => {
      switch (value) {
        case 'uuid':
          return schema.guid()
        case 'uri':
          return schema.uri()
        default:
          return schema
      }
    }),
  )(Joi.string())
}

function makeJoiNumberSchema(rule) {
  return pipe(
    applyRuleAttribute(rule, 'maximum', (schema, value) => schema.max(value)),
    applyRuleAttribute(rule, 'minimum', (schema, value) => schema.min(value)),
    applyRuleAttribute(rule, 'multipleOf', (schema, value) => schema.multiple(value)),
  )(Joi.number())
}

function makeJoiIntegerSchema(rule) {
  return makeJoiNumberSchema(rule).integer()
}

function makeJoiBooleanSchema() {
  return Joi.boolean()
}

function makeJoiArraySchema(rule) {
  return pipe(
    applyRuleAttribute(rule, 'items', (schema, value) => schema.items(makeJoiSchema(value))),
    applyRuleAttribute(rule, 'maxItems', (schema, value) => schema.max(value)),
    applyRuleAttribute(rule, 'minItems', (schema, value) => schema.min(value)),
    applyRuleAttribute(rule, 'uniqueItems', (schema, value) => (value ? schema.unique() : schema)),
  )(Joi.array()).single(true)
}

function makeJoiObjectSchema(rule) {
  const resolvedRule = resolveAllOf(rule)

  return pipe(
    applyRuleAttribute(resolvedRule, 'properties', (schema, value) => Joi.object(
      mapValues(childRule => makeJoiSchema(childRule))(value)
    )),
    applyRuleAttribute(resolvedRule, 'required', (schema, value) => {
      if (value && value.length) {
        return schema.requiredKeys(value)
      } else {
        return schema
      }
    }),
  )(Joi.object())
}

function makeJoiFileSchema() {
  // validate is a stream
  return Joi.object({
    pipe: Joi.func().required(),
  }).unknown()
}

const swaggerTypeToFunctor = {
  string: makeJoiStringSchema,
  number: makeJoiNumberSchema,
  integer: makeJoiIntegerSchema,
  boolean: makeJoiBooleanSchema,
  array: makeJoiArraySchema,
  file: makeJoiFileSchema,
  object: makeJoiObjectSchema,
}

function makeJoiSchema(jsonSchema) {
  return pipe(
    applyRuleAttribute(jsonSchema, 'description', (schema, value) => schema.description(value)),
    applyRuleAttribute(jsonSchema, 'required', (schema, value) => (value ? schema.required() : schema)),
    applyRuleAttribute(jsonSchema, 'default', (schema, value) => schema.default(value)),
    applyRuleAttribute(jsonSchema, 'enum', (schema, value) => schema.valid(value)),
  )(swaggerTypeToFunctor[jsonSchema.type](jsonSchema))
}

function makeJoi(rules) {
  if (rules[0].in.toLowerCase() === 'body') {
    const rule = rules[0]

    return pipe(
      applyRuleAttribute(rule, 'required', (schema, value) => (value ? schema.required() : schema))
    )(makeJoiSchema(rule.schema))
  } else {
    return Joi.object(rules.reduce((initValue, rule) => ({
      ...initValue,
      [rule.name]: makeJoiSchema(rule),
    }), {}))
  }
}

function transformRoutes(routes, transformer) {
  if (isString(transformer)) {
    return transformRoutes(routes, route => ({
      [transformer]: route,
    }))
  }

  if (isFunction(transformer)) {
    return mapValues(route => transformer(route), routes)
  }

  return routes
}

const swaggerToHapiMapping = {
  query: 'query',
  header: 'headers',
  path: 'params',
  formdata: 'payload',
  body: 'payload',
}

const noPayloadMethods = ['get', 'head']

export async function register(server, options, next) {
  const { api, routes = {}, jsonPath = '/swagger.json', routeTransform } = options

  const transformedRoutes = transformRoutes(routes, routeTransform)

  try {
    const { basePath = '/', paths, consumes } = await SwaggerParser.validate(api)

    const result = pipe(
      toPairs,
      flatMap(([routePath, pathConfig]) => pipe(
        toPairs,
        map(([method, routeConfig]) => {
          const params = pipe(
            flatten,
            reject(param => isNil(param))
          )([pathConfig.parameters, routeConfig.parameters])

          const validateParams = pipe(
            groupBy(param => param.in.toLowerCase()),
            mapValues(makeJoi),
            mapKeys(key => swaggerToHapiMapping[key]),
          )(params)

          const shouldHasPayload = (noPayloadMethods.indexOf(method) === -1)
          const hasFile = params.find(param => param.type === 'file')

          return {

            method,

            path: path.join(basePath, routePath),

            config: {

              description: routeConfig.description,

              tags: routeConfig.tags,

              id: routeConfig.operationId,

              handler:
                transformedRoutes[routeConfig.operationId]
                || transformedRoutes[[method, path].join(' ')]
                || ((req, reply) => {
                  reply(Boom.notImplemented())
                }),

              validate: {

                ...validateParams,

                options: {

                  stripUnknown: true,

                  allowUnknown: true,

                },

              },

              response: {

                emptyStatusCode: 204,

                status: pipe(
                  pickBy(value => value.schema),
                  omit('default'),
                  mapValues(value => makeJoiSchema(value.schema).description(value.description)),
                )(routeConfig.responses),

              },

              ...(shouldHasPayload ? {

                payload: {

                  allow: routeConfig.consumes || pathConfig.consumes || consumes,

                  parse: true,

                  maxBytes: 1024 * 1024 * 32,

                  output: hasFile ? 'stream' : 'data',

                },

              } : {}),

            },
          }
        }
      ))(pathConfig)
    ))(paths)

    server.route(result)

    server.route({
      method: 'GET',
      path: jsonPath,
      handler(req, reply) {
        reply(resolveAllOf(api))
      },
      config: {
        cors: true,
      },
    })

    next()
  } catch (e) {
    next(e)
  }
}

register.attributes = {
  name: 'hapi-swagger-loader',
  version: '0.0.1',
}
