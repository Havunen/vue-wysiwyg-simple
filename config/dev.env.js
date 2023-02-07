const wbMerge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = wbMerge.merge(prodEnv, {
  NODE_ENV: '"development"'
})
