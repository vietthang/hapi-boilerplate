/* eslint global-require: [0] no-console: [0] no-var: [0] */

var app

if (process.env.NODE_ENV === 'production') {
  app = require('./lib/library.min')
} else {
  app = require('./build/src')
}

Promise.resolve(app.main()).then(() => {
  console.log('Application is running.')
}).catch((e) => {
  console.error(e.stack)
})
