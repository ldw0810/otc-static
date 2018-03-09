const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
        test: /.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              loaders: {
                less: ExtractTextPlugin.extract({
                  use: [
                    "css-loader?minimize",
                    "postcss-loader",
                    "less-loader"
                  ],
                  fallback: "vue-style-loader"
                }),
                css: ExtractTextPlugin.extract({
                  use: ["css-loader", "postcss-loader", "less-loader"],
                  fallback: "vue-style-loader"
                })
              }
            }
          },
          {
            loader: "iview-loader",
            options: {
              prefix: false
            }
          }
        ]
      },
      {
        test: /iview.src.*?js$/,
        loader: "babel-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          // cacheDirectory: process.env.NODE_ENV === "development" ? true : false,
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader?minimize", "postcss-loader"],
          fallback: "style-loader"
        })
      },

      {
        test: /\.less/,
        use: ExtractTextPlugin.extract({
          // fallback: "style-loader"
          fallback: "style-loader",
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ["css-loader", "less-loader"]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [
            "css-loader",
            "postcss-loader",
            "sass-loader",
            {
              loader: "sass-resources-loader",
              options: {
                resources: [
                  resolve("src/style/_variables.scss"),
                  resolve("src/style/_mixins.scss")
                ]
              }
            }
          ]
        })
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
