const path = require('path');
const webpackMerge = require('webpack-merge');
const { WatchIgnorePlugin } = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const configs = require('./config.js');
const common = require('./webpack.common.js');

const isDev = process.env.NODE_ENV === 'development';

const base = {
  target: 'node',
  node: {
    __dirname: true,
    __filename: true,
  },
  entry: ['@babel/polyfill', path.join(__dirname, '../server/index.js')],
  output: {
    path: path.join(__dirname, '../dist/server/'),
    filename: 'index.js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  externals: [
    (context, request, callback) => {
      if ([
        'body-parser', 'cookie-parser', 'debug', 'express', 'express-http-proxy', 'iron', 'locale',
        'serve-favicon', 'config/server.defaults.js', 'argv', 'winston', 'winston-syslog',
        'lingui-react', 'lingui-i18n',
      ].some(module => module === request)) {
        return callback(null, `commonjs ${request}`);
      }

      if (['locale/.*'].some(module => (new RegExp(module)).test(request))) {
        return callback(null, `commonjs ${request}`);
      }

      return callback();
    },
  ],
  module: {
    rules: [
      {
        test: /\.(s?css|jpe?g|png|gif|svg)$/,
        loader: 'null-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, '../server/'),
        loader: 'babel-loader',
        options: {
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
          ],
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        include: path.join(__dirname, '../server/'),
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react',
          ],
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
          ],
        },
      },
      { test: /\.html$/, loader: 'raw-loader' },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new WatchIgnorePlugin([
      path.join(__dirname, '../src/'),
      path.join(__dirname, '../locale/'),
    ]),
    ...(isDev ? [new HardSourceWebpackPlugin()] : []),
  ],
};

const config = webpackMerge(
  common,
  configs.configureEnv('server'),
  configs.configureSrcBabelLoader({ isNode: true }),
  base
);

module.exports = config;
