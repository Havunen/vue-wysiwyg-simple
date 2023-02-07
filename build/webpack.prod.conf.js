const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const wbMerge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {VueLoaderPlugin} = require("vue-loader");
const env = config.build.env;

const webpackConfig = wbMerge.merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  entry: [path.resolve('src/editor/index.js')],
  devtool: false,
  output: {
    path: config.build.assetsRoot,
    library: "vueWysiwyg",
    libraryTarget: "umd",
    filename: "vueWysiwyg.js",
    umdNamedDefine: true
    // filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    new VueLoaderPlugin(),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // new webpack.DefinePlugin({
    //   'process.env': env
    // }),
    // new UglifyJsPlugin({
    //   parallel: true,
    //   uglifyOptions: {
    //     compress: {
    //       warnings: false
    //     },
    //     output: {
    //       comments: false
    //     },
    //     sourceMap: false
    //   }
    // }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: 'vueWysiwyg.css'
    })
  ]
});


if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
