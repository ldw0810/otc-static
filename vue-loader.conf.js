'use strict'
const utils = require('./utils')
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: false,
    extract: true
  }),
  cssSourceMap: false,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
