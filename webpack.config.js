const path = require('path')

const webpack = require('webpack')

const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const CleanWebpackPlugin = require('clean-webpack-plugin')

const { VueLoaderPlugin } = require('vue-loader')

const AutoWebPlugin = require('./webpack/auto-web-plugin')

const vueLoaderConfig = require('./webpack/vue-loader.conf.js')

module.exports = env => {
  return {
    mode: env.mode ? env.mode : 'development', // production | development
    stats: {
      cached: false,
      cachedAssets: false,
      children: false,
      source: false,
      modules: false
    },
    devServer: {
      hot: true, // this enables hot reload
      inline: true, // use inline method for hmr
      watchOptions: {
        poll: false // needed for homestead/vagrant setup
      },
      contentBase: path.resolve(__dirname, 'public'),
      host: 'localhost',
      port: 3000,
      headers: { 'Access-Control-Allow-Origin': '*' }
    },
    resolve: {
      alias: {
        '%': path.resolve(__dirname, 'resources/assets/sass'),
        '@': path.resolve(__dirname, 'resources/assets/vue'),
        '#': path.resolve(__dirname, 'resources/assets/js')
      },
      extensions: ['.js', '.vue', '.json']
    },
    output: {
      filename: env.hot ? '[name].js' : '[name].[hash].bundle.js',
      path: path.resolve(__dirname, 'public/dist'),
      publicPath: env.hot ? 'http://localhost:3000/dist/' : '/dist/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules',
          loader: 'babel-loader'
        },
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(sass|scss)$/,
          use: ['style-loader','css-loader', `sass-loader`]
        },
        {
          test: /\.(jpg|jpeg|gif|png|woff|woff2|eot|ttf|svg)$/, 
          loader: 'url-loader?limit=100000'
        }
      ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            minSize: 0
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10
          }
        }
      },
      occurrenceOrder: true // To keep filename consistent between different modes (for example building only)
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new AutoWebPlugin('./resources/views/template', {
        outputPath: './resources/views/',
        entryPath: './resources/assets/js/entries',
        defaultChunks: ['vendor', 'commons']
      }),
      new HtmlWebpackHarddiskPlugin(),
      new CleanWebpackPlugin(['dist/'], {
        root: path.resolve(__dirname, 'public')
      })
    ]
  }
}
