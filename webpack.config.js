const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { resolve } = require("path");

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const baseUrl = process.env.BASE_URL ?? "/";

module.exports = {
  target: "web",
  mode: isProduction ? "production" : "development",
  entry: {
    main: resolve("src", "index.ts"),
  },
  output: {
    path: resolve("dist"),
    publicPath: baseUrl,
    filename: "[contenthash:4].js",
    assetModuleFilename: "[contenthash:4][ext]",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(?:png)$/,
        exclude: /node_modules/,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve("public"),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: "body",
      minify: isProduction,
      scriptLoading: "defer",
      template: resolve("src", "index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "[contenthash:4].css",
    }),
    new CleanWebpackPlugin(),
  ],
  cache: {
    type: "filesystem",
  },
};
