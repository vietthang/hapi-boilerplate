const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
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
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars'
      }
    ]
  },
  resolve: {
    root: path.resolve('.'),
    extensions: ['', '.js', '.json']
  },
  entry: 'src/index.js',
  output: {
    path: `${__dirname}/../lib`,
    filename: 'library.min.js',
    library: packageConfig.name,
    libraryTarget: 'umd'
  },
  externals: [
    webpackNodeExternals()
  ],
  plugins: [
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: true }
    ),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
}
