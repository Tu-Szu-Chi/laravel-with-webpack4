const path = require('path')

const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const { VueLoaderPlugin } = require('vue-loader')

const vueLoaderConfig = require('./vue-loader.conf.js')

const extractSass = new ExtractTextPlugin('stylesheets/[name]-sass.css')

module.exports = env => {
  return {
    mode: 'development', // production
  // 輸出訊息
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
        '%': path.resolve(__dirname, 'resources/assets/sass')
      },
      extensions: ['.js', '.vue', '.json']
    },
    entry: {
      page1: './resources/assets/js/page1.js',
      page2: './resources/assets/js/page2.js'
    },
    output: {
      filename: env.hot ? '[name].js' : '[name].[hash].bundle.js',
      path: path.resolve(__dirname, 'public'),
      publicPath: env.hot ? 'http://localhost:3000/' : './'
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
          use: extractSass.extract({
            fallback: 'style-loader',
            use: ['css-loader',
              `sass-loader`]
          })
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
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'resources/views/page1.tpl.blade.php'),
        filename: path.resolve(__dirname, 'resources/views/page1.blade.php'),
        chunks: ['page1', 'commons', 'vendor']
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'resources/views/page2.tpl.blade.php'),
        filename: path.resolve(__dirname, 'resources/views/page2.blade.php'),
        chunks: ['page2', 'commons', 'vendor']
      }),
      extractSass
    ]
  }
}
