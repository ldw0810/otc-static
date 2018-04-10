const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
  return path.join(__dirname, "", dir);
}

module.exports = {
  entry: {
    main: "./src/main",
    vendors: "./src/vendors"
  },
  output: {
    path: path.join(__dirname, "./dist")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: "url-loader?limit=1024"
      },
      {
        test: /\.(html|tpl)$/,
        loader: "html-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".vue", ".json", ".less"],
    alias: {
      vue: "vue/dist/vue.esm.js",
      "@": resolve("src"),
      config: resolve("src/config"),
      style: resolve("src/style"),
      images: resolve("src/static/images"),
      fonts: resolve("src/static/fonts"),
      utils: resolve("src/utils")
    }
  }
};
