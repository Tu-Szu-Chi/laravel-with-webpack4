var utils = require('./vue-loader.utils')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    extract: isProduction
  })
}