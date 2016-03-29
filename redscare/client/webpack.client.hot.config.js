// This config file setups up the Webpack Dev Server:
//   https://webpack.github.io/docs/webpack-dev-server.html
// Run like this:
// cd client && node server.js

const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.client.base.config');

config.entry.app.push(

  // Webpack dev server
  'webpack-dev-server/client?http://localhost:4000',
  'webpack/hot/dev-server'

);

config.output = {

  // this file is served directly by webpack
  filename: '[name]-bundle.js',
  path: __dirname,
};
config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
config.devtool = 'eval-source-map';

// All the styling loaders only apply to hot-reload, not rails
config.module.loaders.push(
  {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      plugins: [
        [
          'react-transform',
          {
            transforms: [
              {
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              },
            ],
          },
        ],
      ],
    },
  },
  {
    test: /\.css$/,
    loaders: [
      'style',
      'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]',
      'postcss',
    ],
  },
  {
    test: /\.scss$/,
    loaders: [
      'style',
      'css?modules&importLoaders=3&localIdentName=[name]__[local]__[hash:base64:5]',
      'postcss',
      'sass',
      'sass-resources',
    ],
  },

  // The url-loader uses DataUrls. The file-loader emits files.
  { test: /\.woff$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
  { test: /\.ttf$/, loader: 'file-loader' },
  { test: /\.eot$/, loader: 'file-loader' },
  { test: /\.svg$/, loader: 'file-loader' }
);

module.exports = config;
