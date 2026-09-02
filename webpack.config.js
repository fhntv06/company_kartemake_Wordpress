const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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

function getChunks() {
  const common = ['runtime', 'vendors', 'global']

  // регулировка подключения в html
  // последовательность common -> pages-common -> global
  // TODO нужно более гибкое управление global модулями.
  //  т.к. уже pages-common был сформирован из-за не гибкости
  //  а что если HeroParticle не нужен будет на какой то странице,
  //  то придется ещё раз дробить и так далее.
  //  поэтому нужно сделать так, чтобы можно был легко для кажой страницы
  //  включать и выключать модули
  return {
    index: [...common, 'pages-common', 'home'],
    policy: [...common, 'policy'],
    about: [...common, 'pages-common', 'about'],
    blog: [...common, 'pages-common', 'blog'],
    calculator: [...common, 'pages-common', 'calculator'],
    contacts: [...common, 'pages-common', 'contacts'],
    services: [...common, 'pages-common', 'services'],
  }
}

const pages = getPageEntries();
const chunks = getChunks()

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDebug = process.env.DEBUG_MODE === 'true';

  return {
    mode: isProduction ? 'production' : 'development',

    // Оставляем только main, vendor будет собран через splitChunks
    entry: {
      global: './src/app/global.js',
      'pages-common': './src/app/pages-common.js',
      home: './src/app/pages/home/home-entry.js',
      policy: './src/app/pages/policy/policy-entry.js',
      about: './src/app/pages/about/about-entry.js',
      blog: './src/app/pages/blog/blog-entry.js',
      calculator: './src/app/pages/calculator/calculator-entry.js',
      contacts: './src/app/pages/contacts/contacts-entry.js',
      services: './src/app/pages/services/services-entry.js',
    },

    output: {
      // Все JS файлы в assets/js
      filename: 'assets/js/[name].build.js',
      chunkFilename: 'assets/js/[name].build.chunk.js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
      publicPath: '/',
      assetModuleFilename: 'assets/images/[name].[hash][ext]',
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
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[hash][ext]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/media/[name].[hash][ext]'
          }
        },
      ],
    },

    plugins: [
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: 'assets/css/[name].build.css',
          chunkFilename: 'assets/css/[name].chunk.css',
        })
      ] : []),

      ...pages.map(page => new HtmlWebpackPlugin({
        template: page.path,
        filename: `${page.name}.html`,
        // Указываем все нужные чанки
        chunks: chunks[page.name],
        chunksSortMode: 'manual',
        inject: 'body',
      }))
    ],

    optimization: {
      minimize: isProduction,
      runtimeChunk: {
        name: 'runtime'
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 10,
        minSize: 0,
        cacheGroups: {
          // Все библиотеки в vendors
          vendors: {
            test: /[\\/]lib[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Библиотеки из node_modules
          npm: {
            test: /[\\/]node_modules[\\/]/,
            name: 'npm',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        }
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: false,
            },
            output: {
              comments: false
            },
          },
          extractComments: false,
        }),
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

    devtool: isProduction ? false : 'eval-source-map',
  };
};