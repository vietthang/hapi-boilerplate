const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const packageConfig = require('../package.json')

function flatMap(array, mapper) {
  return array.map(mapper).reduce((value, entry) => value.concat(entry), [])
}

function walkSync(dir, criteria) {
  const entries = fs.readdirSync(dir)

  return flatMap(entries, (entry) => {
    const absolutePath = [dir, entry].join('/')

    if (fs.statSync(absolutePath).isDirectory()) {
      return walkSync(absolutePath, criteria)
    } else if (criteria) {
      return criteria(absolutePath) ? absolutePath : []
    } else {
      return absolutePath
    }
  })
}

const entries = walkSync('src/db', entry => entry.match(/\.js$/))
  .reduce((prev, entry) => (Object.assign({}, prev, { [entry.replace('src/', '')]: [entry] })), {})

module.exports = {
  devtool: 'source-map',
  target: 'node',
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.json|\.yml|\.yaml)$/,
        loader: 'json-schema',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    root: path.resolve('.'),
    extensions: ['', '.js', '.json']
  },
  entry: entries,
  output: {
    path: `${__dirname}/../dist`,
    filename: '[name]',
    library: packageConfig.name,
    libraryTarget: 'umd',
    devtoolModuleFilenameTemplate: '../../../[resource-path]',
    devtoolFallbackModuleFilenameTemplate: '../../../[resource-path]'
  },
  externals: [
    webpackNodeExternals()
  ],
  plugins: [
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: true }
    )
  ]
}
