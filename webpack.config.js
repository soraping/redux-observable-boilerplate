const path = require("path");
const WebpackBaseConfig = require("./webpack.base");

// devServer 配置
const devServer = {
  contentBase: path.resolve(__dirname, "build"),
  host: "localhost",
  // 设置 createBrowserHistory时，在非首页刷新时，设置为true，配合 publicPath 路径，不会出现404
  historyApiFallback: true,
  port: 8000, // 本地服务器端口号
  hot: true, // 热重载
  overlay: true
};

module.exports = Object.assign({}, WebpackBaseConfig, { devServer });
