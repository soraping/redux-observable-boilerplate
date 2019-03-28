const os = require("os");
const path = require("path");
const _ = require("lodash");
const webpack = require("webpack");
const HappyPack = require("happypack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const tsconfigJSON = require("./tsconfig.json");

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  entry: {
    index: "./src/index.tsx"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].[hash].js",
    publicPath: "/"
  },
  mode: "development", // 开发模式
  devtool: "source-map", // 开启调试
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "happypack/loader?id=happytsxloader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".json", ".css"],
    alias: buildAlias(tsconfigJSON),
    modules: ["node_modules"]
  },
  plugins: [
    new HappyPack({
      id: "happytsxloader",
      loaders: [
        {
          path: "ts-loader",
          query: { happyPackMode: true }
        }
      ],
      threadPool: happyThreadPool,
      verbose: true
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src", "index.html"),
      chunks: ["index"]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};

/**
 * 同步 tsconfig.json 中的 paths 至 alias
 */
function buildAlias(tsconfigJSON) {
  const baseUrl = tsconfigJSON["compilerOptions"]["baseUrl"];
  const paths = tsconfigJSON["compilerOptions"]["paths"];
  let alias = {};
  Object.keys(paths).map(key => {
    alias[key] = path.resolve(__dirname, baseUrl, paths[key][0]);
  });
  return alias;
}
