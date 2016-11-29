const path = require('path')
const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const packageConfig = require('../package.json')

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
  entry: 'src/index.js',
  output: {
    path: `${__dirname}/../build`,
    filename: 'src/index.js',
    library: packageConfig.name,
    libraryTarget: 'umd',
    devtoolModuleFilenameTemplate: '../../[resource-path]',
    devtoolFallbackModuleFilenameTemplate: '../../[resource-path]'
  },
  externals: [
    webpackNodeExternals()
  ],
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'bluebird'
    })
  ]
}
