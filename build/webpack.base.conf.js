const path = require('path');
const config = require('../config');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

console.log(config.build.assetsRoot)

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          preserveWhitespace: false,
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}
