const webpack = require('webpack');
const path = require('path');
const utils = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

fs.open('./src/config/env.js', 'w', function (err, fd) {
  const buf = 'export default "development";';
  fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
  });
});

module.exports = merge(webpackBaseConfig, {
  devtool: '#source-map',
  output: {
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: utils.styleLoaders({
      usePostCSS: true,
    }),
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'vendors.js',
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './src/template/index.ejs',
      inject: false,
      favicon: './favicon.ico',
    }),
  ],
  devServer: {
    proxy: {
      '/hc/api': {
        target: 'https://otcmaker.zendesk.com',
        secure: false,
        changeOrigin: true,
      },
      '/api/v1': {
        target: 'https://alpha.otcmaker.com',
        // target: "http://192.168.31.40:3000",
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
