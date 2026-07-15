const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Функция для получения всех HTML-файлов из pages
function getPageEntries() {
  const pages = glob.sync('./src/pages/*.html');

  return pages.map(page => {
    const name = path.basename(page, '.html');
    const route = page.replace('./src/pages', '').replace('.html', '');

    return {
      name,
      path: page,
      route: route === '/index' ? '/' : route
    };
  });
}

const pages = getPageEntries();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // Режим зависит от флага
    mode: isProduction ? 'production' : 'development',

    entry: './src/index.js',
    output: {
      filename: isProduction ? 'bundle.js' : 'bundle.[contenthash].js',
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
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource', // исправлено
          generator: {
            filename: 'images/[name].[hash][ext]'
          }
        },
      ],
    },
    plugins: [
      // MiniCssExtractPlugin только в production
      ...(isProduction ? [new MiniCssExtractPlugin({
        filename: 'style.css' // фиксированное имя
      })] : []),

      // Динамически создаем плагины для всех страниц
      ...pages.map(page => new HtmlWebpackPlugin({
        template: page.path,
        filename: `${page.name}.html`,
        chunks: ['main'],
        inject: 'body',
        // В production добавляем минификацию HTML
        // minify: false // isProduction ? {
        //   collapseWhitespace: true,
        //   removeComments: true,
        //   removeRedundantAttributes: true,
        //   removeScriptTypeAttributes: true,
        //   removeStyleLinkTypeAttributes: true,
        //   useShortDoctype: true
        // } : false,
      }))
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        // Минификация JS
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // убирает console.log в production
            },
            output: {
              comments: false, // убирает комментарии
            },
          },
          extractComments: false,
        }),
        // Минификация CSS
        new CssMinimizerPlugin(),
      ],
    },
    devServer: {
      static: './build',
      port: 3000,
      historyApiFallback: {
        rewrites: [
          ...pages.map(page => ({
            from: new RegExp(`^${page.route}$`),
            to: `/${page.name}.html`
          }))
        ]
      },
      open: true,
      hot: true,
    },
    // Source maps для удобства отладки
    devtool: isProduction ? false : 'eval-source-map',
  };
};
