import { Server } from 'hapi'
import good from 'good'
import inert from 'inert'
import vision from 'vision'
import hapiSwaggeredUi from 'hapi-swaggered-ui'

import * as asyncHandler from './modules/asyncHandler'
import * as apiLoader from './modules/apiLoader'
import { config } from './components/config'
import routes from './routes'
import api from './schemas/api.swagger.yaml'

export async function main(server = new Server()) {
  server.connection({
    port: config('/server/port'),
    host: config('/server/host'),
    router: {
      stripTrailingSlash: true,
    },
  })

  // don't log when test
  if (config('/modules/good')) {
    await server.register({
      register: good,
      options: {
        reporters: {
          console: [{
            module: 'good-console',
          }, 'stdout'],
        },
      },
    })
  }

  await server.register(asyncHandler)

  await server.register(inert)
  await server.register(vision)

  await server.register({
    register: apiLoader,
    options: {
      api,
      routes,
      routeTransform: 'async',
      allowTypes: config('/modules/store/allowTypes'),
    },
  })

  const swaggerUiConfig = config('/modules/swaggerUi')
  if (swaggerUiConfig) {
    await server.register({
      register: hapiSwaggeredUi,
      options: {
        path: swaggerUiConfig.path,
        swaggerEndpoint: '/swagger.json',
      },
    })
  }

  // don't start server on test
  if (config('/server/listen')) {
    await server.start()
    server.log('server', `Server is listening at: ${server.info.uri.toLowerCase()}`)
  }

  return server
}
