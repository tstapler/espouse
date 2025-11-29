const webpack = require('webpack')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const config = {
  mode: 'production',
  target: 'web',
  context: path.resolve(__dirname),
  // Webpack 5 persistent caching for faster rebuilds
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  entry: {
    all: './app.js',
    semanticExtras: './src/semanticExtras.js',
    homePage: './src/homePage.js',
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'js/[name].bundle.js',
    publicPath: '/',
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
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                outputStyle: 'compressed',
              }
            }
          },
          'resolve-url-loader'
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      // Webpack 5 asset modules (replaces file-loader/url-loader)
      {
        test: /\.(jpe?g|gif|png|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]?[hash]'
        }
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        use: [
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {removeTitle: true},
                {convertColors: {shorthex: false}},
                {convertPathData: false}
              ]
            }
          }
        ],
        generator: {
          filename: '[name][ext]?[hash]'
        }
      },
      {
        test: /\.woff2?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000
          }
        },
        generator: {
          filename: '[name][ext]'
        }
      }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
    // MiniCssExtractPlugin handles the bundled .css output file
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].[id].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // `...` extends default minimizers (terser-webpack-plugin)
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
}

module.exports = config
