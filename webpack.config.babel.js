import os from "os";
import HappyPack from "happypack";
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

export default {};
