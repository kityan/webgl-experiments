const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')



const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production'

const srcPath = path.resolve(__dirname, 'src')
const distPath = path.resolve(__dirname, 'dist')

module.exports = {
  devtool: isProduction ? 'hidden-source-map' : 'source-map',
  devServer: {
    // stats: 'verbose',
    disableHostCheck: true,
    host: '127.0.0.1',
    port: 8090,
    public: 'localhost:8090',
    open: true,
    historyApiFallback: true,
    publicPath: '/'
  },
  context: srcPath,
  entry: './main.js',
  output: {
    path: distPath,
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js'],
    alias: {}
  },
  module: {
    rules: [
      { parser: { amd: false } },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.js$/,
        oneOf: [
          {
            resourceQuery: /global/, // *.js?global
            use: [
              {
                loader: 'imports-loader',
                options: {
                  wrapper: 'window'
                },
              },
            ],
          },
          {
            resourceQuery: /^$/,
            loader: ['babel-loader'],
          },
        ],
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        oneOf: [{
          resourceQuery: /global/, // foo.css?global
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
            ]
          })
        },
        {
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'sass-loader'
            }
            ]
          })
        }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [{
          loader: 'url-loader?limit=2000',
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './assets/index.html'
    }),
    new webpack.NormalModuleReplacementPlugin(/(.*)_BUILD_TARGET_(\.*)/, function (resource) {
      resource.request = resource.request.replace(/_BUILD_TARGET_/, isProduction ? 'production' : 'development')
    }),
    new CopyWebpackPlugin([{
      from: './assets/images/favicon.png',
      to: './images'
    }]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.includes('node_modules')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['runtime']
    }),
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true
    })
  ]
}

if (isProduction) {
  module.exports.plugins = [
    // new WebpackCleanupPlugin(),
    new CleanWebpackPlugin(),
    ...module.exports.plugins,
    new UglifyJsPlugin({
      sourceMap: false
    })
  ]
}
