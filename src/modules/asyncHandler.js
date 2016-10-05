import { isObjectLike, has, isNil } from 'lodash/fp'

/**
 * Check if a object is a Hapi response object, for now just use a simple check for statusCode attribute
 * @param  {Any} value Any value to check
 * @return {Boolean}
 */
function isResponse(value) {
  return isObjectLike(value) && has('statusCode')(value)
}

export function register(server, options, next) {
  server.handler('async', (route, asyncHandler) =>
    (request, reply) => {
      asyncHandler.bind(this)(request, reply).then((result) => {
        // just skip if the result returned is Hapi response
        if (isResponse(result)) {
          return
        }

        // send empty response if result is null or undefined
        if (isNil(result)) {
          reply()
        } else {
          reply(result)
        }
      }).catch((error) => {
        if (error instanceof Error) {
          const { name, message, stack } = error
          request.log(['error', 'uncaught'], { name, message, stack })
          reply(error)
        } else {
          request.log(['error', 'uncaught'], { name: 'Error', message: error })
          reply(new Error(error))
        }
      })
    }
  )

  next()
}

register.attributes = {
  name: 'hapi-async-handler',
  version: '0.0.1',
}
