const os = require("os");
const HappyPack = require("happypack");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
    alias: {
      "@actions": path.resolve(__dirname, "src", "actions"),
      "@utils": path.resolve(__dirname, "src", "utils"),
      "@constants": path.resolve(__dirname, "src", "constants"),
      "@reducers": path.resolve(__dirname, "src", "reducers")
    },
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
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    host: "localhost",
    // 设置 createBrowserHistory时，在非首页刷新时，设置为true，配合 publicPath 路径，不会出现404
    historyApiFallback: true,
    port: 8000, // 本地服务器端口号
    hot: true, // 热重载
    overlay: true
  }
};
