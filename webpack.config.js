const webpack = require('webpack')
const path = require('path')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require("compression-webpack-plugin")
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MinifyPlugin = require("babel-minify-webpack-plugin")
const OfflinePlugin = require('offline-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const cssExtractTextPlugin = new ExtractTextPlugin({
  filename: (getPath) => {
    return getPath('css/[name].css').replace('css/js', 'css')
  },
  publicPath: '/',
  allChunks: true
})

const config = {
  target: 'web',
  context: path.resolve(__dirname),
  entry: {
    all: './app.js',
    homePage: './src/homePage.js',
    photoGallery: './src/gallery.js'
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'js/[name].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '../../theme.config$': path.join(__dirname, './semantic/src/theme.config'),
    }
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: cssExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
        }, {
          loader: 'sass-loader'
        }, {
          loader: 'resolve-url-loader'
        }],
      })
    },
    {// this handles .less translation
      use: cssExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
        }, {
          loader: 'less-loader'
        }],
      }),
      test: /\.less$/
    },
    {
      test: /\.css$/,
      use: cssExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader', 
          options: {
          minimize: true
          },
        }],
      })
    },
    {
      test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
      use: [{
        loader: 'file-loader?name=[name].[ext]?[hash]',
        options: {
          publicPath: "/"
        }
      }]
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [{

        loader: 'url-loader?limit=10000&mimetype=application/fontwoff&name=[name].[ext]',
        options: {
          publicPath: "/"
        }
      }],
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
    // this handles the bundled .css output file
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false,
      },
    }),
    new MinifyPlugin(),
    cssExtractTextPlugin,
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    new ManifestPlugin(),
    new OfflinePlugin({
      publicPath: '/',
      relativePaths: true,
    }),
  ]
}

module.exports = config
