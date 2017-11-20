const webpack = require('webpack')
const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const cssExtractTextPlugin = new ExtractTextPlugin({
  filename: (getPath) => {
    return getPath('css/[name].css').replace('css/js', 'css')
  }
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
      '../../theme.config$': path.join(__dirname, './semantic/src/theme.config')
    }
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: cssExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }, {
          loader: 'resolve-url-loader'
        }],
          // use style-loader in development
        fallback: 'style-loader'
      })
    },
    {// this handles .less translation
      use: cssExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: true
          }
        }],
        publicPath: './'
      }),
      test: /\.less$/
    },
    {
      test: /\.css$/,
      use: cssExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'resolve-url-loader'],
        publicPath: './'
      })
    },
    {
      test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
      use: 'file-loader?name=[name].[ext]?[hash]'
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/fontwoff&name=[name].[ext]'
    },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
    // this handles the bundled .css output file
    cssExtractTextPlugin
  ]
}

module.exports = config
