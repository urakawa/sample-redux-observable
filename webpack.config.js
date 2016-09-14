var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + "/static/scripts",
    filename: 'bundle.js'
  },
  plugins: [
    //new webpack.optimize.DedupePlugin(),
    //new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
