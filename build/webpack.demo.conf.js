const utils = require('./utils');
const webpack = require('webpack');
const wbMerge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {VueLoaderPlugin} = require("vue-loader");


module.exports = wbMerge.merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: false })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: false,
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
})
