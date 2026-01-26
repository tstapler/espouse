const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

module.exports = {
  mode: 'production',
  entry: {
    app: path.resolve(__dirname, 'src/espouse.js')
  },
  output: {
    path: path.resolve(__dirname, 'source/assets/javascripts'),
    filename: 'bundle.min.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer'],
                  ['cssnano', { preset: 'default' }]
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../stylesheets/bundle.min.css'
    })
  ]
}