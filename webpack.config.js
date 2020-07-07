const webpack = require('webpack')
const path = require('path')

const CompressionPlugin = require("compression-webpack-plugin")
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OfflinePlugin = require('offline-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = {
  mode: 'production',
  target: 'web',
  context: path.resolve(__dirname),
  entry: {
    all: './app.js',
    homePage: './src/homePage.js',
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
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'resolve-url-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
    // // this handles the bundled .css output file
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin(),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {discardComments: {removeAll: true}},
      canPrint: true
    }),
    new CompressionPlugin(),
    new ManifestPlugin(),
    new OfflinePlugin({
      publicPath: '/',
      relativePaths: true
    })
  ]
}

module.exports = config
