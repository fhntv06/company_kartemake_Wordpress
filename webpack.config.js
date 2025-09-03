const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Функция для получения всех HTML-файлов из pages
function getPageEntries() {
  const pages = glob.sync('./src/pages/*.html')

  return pages.map(page => {
    const name = path.basename(page, '.html')
    const route = page.replace('./src/pages', '').replace('.html', '')

    return {
      name,
      path: page,
      route: route === '/index' ? '/' : route
    }
  })
}

const pages = getPageEntries()

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader', // Компилирует Sass в CSS
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: './src/shared/asset/images',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    // Динамически создаем плагины для всех страниц
    ...pages.map(page => new HtmlWebpackPlugin({
      template: page.path,
      filename: `${page.name}.html`,
      chunks: ['main', 'styles'], // подключаем скрипты и стили ко всем страницам
      inject: 'body' // гарантируем вставку в body
    }))
  ],
  devServer: {
    static: './build',
    port: 3000,
    historyApiFallback: {
      rewrites: [
        // Автоматически создаем rewrite правила для всех страниц
        ...pages.map(page => ({
          from: new RegExp(`^${page.route}$`),
          to: `/${page.name}.html`
        }))
      ]
    },
    open: true,
    hot: true,
  },
  mode: 'development',
}
