// Common client-side webpack configuration used by webpack.hot.config and webpack.rails.config.

const webpack = require('webpack');
const path = require('path');

const devBuild = process.env.NODE_ENV !== 'production';
const nodeEnv = devBuild ? 'development' : 'production';
const autoprefixer = require('autoprefixer');

module.exports = {

  // the project dir
  context: __dirname,
  entry: {

    // See use of 'vendor' in the CommonsChunkPlugin inclusion below.
    vendor: [],

    // This will contain the app entry points defined by webpack.hot.config and
    // webpack.rails.config
    app: [
      './app/bundles/GameCreator/startup/clientRegistration',
      './app/bundles/GameIndex/startup/clientRegistration',
      './app/bundles/GameRoom/startup/clientRegistration',
      './app/bundles/DevPanel/startup/clientRegistration',
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      lib: path.join(process.cwd(), 'app', 'lib'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),

    // https://webpack.github.io/docs/list-of-plugins.html#2-explicit-vendor-chunk
    new webpack.optimize.CommonsChunkPlugin({

      // This name 'vendor' ties into the entry definition
      name: 'vendor',

      // We don't want the default vendor.js name
      filename: 'vendor-bundle.js',

      // Passing Infinity just creates the commons chunk, but moves no modules into it.
      // In other words, we only put what's in the vendor entry definition in vendor-bundle.js
      minChunks: Infinity,
    }),
  ],
  module: {
    loaders: [
    ],
  },
  postcss: [autoprefixer],
  // Place here all SASS files with variables, mixins etc.
  // And sass-resources-loader will load them in every CSS Module (SASS file) for you
  // (so don't need to @import them explicitly)
  // https://github.com/shakacode/sass-resources-loader
  sassResources: ['./app/assets/styles/app-variables.scss'],
};
