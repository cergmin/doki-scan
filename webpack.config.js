/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const IS_DEV = true;

module.exports = {
  mode: IS_DEV ? 'development' : 'production',
  entry: path.resolve(__dirname, './src/index.tsx'),
  output: {
    filename: 'index.js',
    publicPath: './',
    path: path.resolve(__dirname, './build'),
    clean: !IS_DEV,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [path.resolve(__dirname, './node_modules')],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimization: {
    minimize: !IS_DEV,
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: './src/public/index.html',
      favicon: './src/public/static/favicon.ico',
      minify: !IS_DEV,
    }),
    new MiniCssExtractPlugin({
      filename: 'main.[contenthash:6].css',
    }),
    new CssMinimizerPlugin(),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: IS_DEV,
            },
          },
        ],
      },
      {
        test: /.(jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:6].[ext]',
              outputPath: '/images',
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:6].[ext]',
              outputPath: '/fonts',
            },
          },
        ],
      },
    ],
  },
};
