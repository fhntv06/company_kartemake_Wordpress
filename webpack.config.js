const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const MODULES = require('./src/app/modules/manifest.js');
const PAGES   = require('./src/app/pages-manifest.js');
const {WebpackAssetsManifest} = require("webpack-assets-manifest");

// ── Утилиты ──────────────────────────────────────────────────────
const toPosix = (p) => p.replace(/\\/g, '/');
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const resolveFromRoot = (...parts) => toPosix(path.resolve(__dirname, ...parts));

// ── Генерация файлов страниц ─────────────────────────────────────
// Один файл на страницу: scss + imports + app-класс + boot.
const PAGES_DIR = path.resolve(__dirname, '.webpack/pages');

function generatePages() {
  fs.rmSync(PAGES_DIR, { recursive: true, force: true });
  fs.mkdirSync(PAGES_DIR, { recursive: true });

  for (const [page, config] of Object.entries(PAGES)) {
    const scssPath = resolveFromRoot('src/shared/styles/pages', config.scss);
    const appClass = `${capitalize(page)}App`;

    // Импорты модулей
    const imports = (config.modules || []).map(name => {
      const mod = MODULES[name];
      if (!mod) {
        throw new Error(`[pages-manifest] Page "${page}" references unknown module "${name}"`);
      }
      return `import ${name} from '${resolveFromRoot(mod.path)}';`;
    }).join('\n');

    // Тело registry
    const registry = (config.modules || []).join(',\n    ');

    // Один файл — всё внутри
    const content = `// AUTO-GENERATED from pages-manifest.js. Do not edit.
import '${scssPath}';

import BaseApp from '${resolveFromRoot('src/app/core/base-app.js')}';
${imports}

class ${appClass} extends BaseApp {
  constructor() {
    super({
      ${registry}
    }, '${appClass}');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ${appClass}();
  console.log('[${page}] initialized');
});
`;

    fs.writeFileSync(path.join(PAGES_DIR, `${page}.js`), content);
  }
}

// ── Entry ────────────────────────────────────────────────────────
// global — особый, руками. Остальные — сгенерированные.
function buildEntries() {
  return {
    global: './src/app/entries/global.entry.js',
    ...Object.fromEntries(
        Object.keys(PAGES).map(page => [
          page,
          path.join(PAGES_DIR, `${page}.js`),
        ])
    ),
  };
}

// ── Карта: имя HTML → имя entry ──────────────────────────────────
// index.html собирается из home.entry (ключ home в pages-manifest.js).
const HTML_TO_ENTRY = {
  index: 'home',
  'privacy-policy': 'policy',
  'cookie-policy': 'policy',
}

// ── Страницы для HtmlWebpackPlugin ───────────────────────────────
function getPageEntries() {
  const pages = glob.sync('./src/pages/*.html');
  return pages.map(page => {
    const name = path.basename(page, '.html');
    const route = page.replace('./src/pages', '').replace('.html', '');
    return { name, path: page, route: route === '/index' ? '/' : route };
  });
}

// ── Chunks для страницы ──────────────────────────────────────────
function getPageChunks(pageName) {
  const entryName = HTML_TO_ENTRY[pageName] ?? pageName;
  return ['runtime', 'vendors', 'npm', 'global', entryName];
}

// ── Точка входа конфига ──────────────────────────────────────────
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  generatePages();

  const entries = buildEntries();
  const pages = getPageEntries();

  return {
    mode: isProduction ? 'production' : 'development',
    entry: entries,

    output: {
      filename: 'assets/js/[name].build.js',
      chunkFilename: 'assets/js/[name].chunk.js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
      publicPath: '/',
      assetModuleFilename: 'assets/images/[name].[hash][ext]',
    },

    module: {
      rules: [
        { test: /\.html$/, loader: 'html-loader' },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] },
          },
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
            'css-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
          generator: { filename: 'assets/images/[name].[hash][ext]' },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: { filename: 'assets/fonts/[name].[hash][ext]' },
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav)$/i,
          type: 'asset/resource',
          generator: { filename: 'assets/media/[name].[hash][ext]' },
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

      new WebpackAssetsManifest({
        output: 'manifest.json',
        publicPath: '',   // ← с build/
        entrypoints: true,
        integrity: false,
        writeToDisk: true,
        transform: (assets) => {
          const filtered = { entrypoints: assets.entrypoints }
          for (const [key, value] of Object.entries(assets)) {
            if (key === 'entrypoints') continue
            if (typeof value !== 'string') continue
            if (value.endsWith('.LICENSE.txt')) continue
            if (value.endsWith('.html')) continue
            filtered[key] = value
          }
          return filtered
        },
      }),

      ...(!isProduction ? pages.map(page => new HtmlWebpackPlugin({
        template: page.path,
        filename: `${page.name}.html`,
        chunks: getPageChunks(page.name),
        chunksSortMode: 'manual',
        inject: 'body',
      })) : []),
    ],

    optimization: {
      chunkIds: 'deterministic',
      minimize: isProduction,
      runtimeChunk: { name: 'runtime' },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 10,
        minSize: 0,
        cacheGroups: {
          vendors: {
            test: /[\\/]lib[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
            enforce: true,
            reuseExistingChunk: true,
          },
          npm: {
            test: /[\\/]node_modules[\\/]/,
            name: 'npm',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: isProduction },
            output: { comments: !isProduction },
          },
          extractComments: isProduction,
        }),
        new CssMinimizerPlugin(),
      ],
    },

    devServer: {
      static: './build',
      port: 3000,
      historyApiFallback: {
        rewrites: pages.map(page => ({
          from: new RegExp(`^${page.route}$`),
          to: `/${page.name}.html`,
        })),
      },
      open: true,
      hot: true,
    },

    devtool: isProduction ? false : 'eval-source-map',
  };
};
