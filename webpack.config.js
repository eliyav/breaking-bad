const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/** @type {import("webpack").Configuration} */
module.exports = {
  mode: "development",
  entry: ["./src/index.tsx"],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
      favicon: "./favicon.ico",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|gltf|webp)$/i,
        type: "asset",
      },
    ],
  },
  devtool: "source-map",
  output: {
    clean: true,
  },
  devServer: {
    port: 3000,
    compress: true,
    hot: true,
  },
};
