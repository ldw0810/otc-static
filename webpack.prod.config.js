const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const utils = require("./utils");
const WebpackMd5Hash = require("webpack-md5-hash");
const merge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.config.js");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const fs = require("fs");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

fs.open("./src/config/env.js", "w", function(err, fd) {
  const buf = 'export default "production";';
  fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

const webpackConfig = merge(webpackBaseConfig, {
  output: {
    path: path.join(__dirname, "../otcmaker-html/dist"),
    publicPath: "/dist/",
    filename: "[name].[chunkhash:8].js",
    chunkFilename: "[name].[chunkhash:8].chunk.js",
  },
  module: {
    rules: utils.styleLoaders({
      extract: true,
      usePostCSS: true
    })
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].[hash].css",
      allChunks: true
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
    }),
    new WebpackMd5Hash(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      filename: "vendors.[chunkhash:8].js"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: "qart",
      minChunks({ resource }) {
        return (
          resource &&
          resource.includes("node_modules") &&
          new RegExp("qart").test(resource)
        );
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      parallel: true // 多线程压缩
    }),
    new HtmlWebpackPlugin({
      filename: "../index_prod.html",
      template: "./src/template/index.ejs",
      favicon: './src/static/favicon.ico',
      inject: false
    }),
    new CleanWebpackPlugin(path.join(__dirname, "../otcmaker-html/dist"), {
      allowExternal: true
    }),
  ]
});

// gzip压缩
if (process.env.npm_config_gzip) {
  const CompressionWebpackPlugin = require("compression-webpack-plugin");
  new CompressionWebpackPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
    threshold: 10240,
    minRatio: 0.8
  });
}
// 分析
if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
