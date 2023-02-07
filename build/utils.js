const sass = require('sass');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.styleLoaders = function (options) {
  return [
    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: sass,
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: /\.css$/,
      use: [
        'vue-style-loader',
        'css-loader',
      ]
    }
  ]
}
