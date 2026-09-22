const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const MODULES = require('./src/app/modules/manifest.js');
const PAGES   = require('./src/app/pages/manifest.js');

// ── 1. Собираем список entry: страницы + модульные бандлы ─────────
function buildEntries() {
  const entries = {};

  // 1a. Страницы (каждая — свой entry)
  for (const page of Object.keys(PAGES)) {
    entries[page] = `./src/app/pages/${page}/${page}-entry.js`;
  }

  // 1b. Модульные бандлы (global, home, ...)
  //     Извлекаем уникальные entry-имена из манифеста модулей.
  //     Создаём для каждого виртуальный entry-файл-агрегатор.
  const moduleEntries = new Set();
  for (const mod of Object.values(MODULES)) {
    moduleEntries.add(mod.entry);
  }

  // Эти entry-точки не файлы, а виртуальные: мы их сгенерируем на лету.
  for (const name of moduleEntries) {
    entries[name] = path.resolve(__dirname, `.webpack/modules/${name}.js`);
  }

  return entries;
}

// ── 2. Генерируем виртуальные файлы-агрегаторы ───────────────────
// Для каждого entry-имени модуля создаём файл, который импортирует
// все модули, помеченные этим entry-именем.
function generateModuleAggregators() {
  const fs = require('fs');
  const dir = path.resolve(__dirname, '.webpack/modules');
  fs.mkdirSync(dir, { recursive: true });

  // Группируем модули по entry
  const groups = {};
  for (const [key, mod] of Object.entries(MODULES)) {
    (groups[mod.entry] ??= []).push({ key, path: mod.path });
  }

  for (const [entryName, mods] of Object.entries(groups)) {
    const imports = mods.map((m, i) =>
        `import ${m.key} from '${path.resolve(__dirname, m.path).replace(/\\/g, '/')}';`
    ).join('\n');

    const registrations = mods.map(m =>
        `  ${m.key},`
    ).join('\n');

    const content = `
// AUTO-GENERATED. Do not edit.
${imports}

export const registry = {
${registrations}
};
`;
    fs.writeFileSync(path.join(dir, `${entryName}.js`), content);
  }
}

// ── 3. Определяем, какие чанки подключать к каждой странице ──────
// Для страницы: все модульные entry, к которым относятся её модули,
// + сама страница. Порядок: global → ... → страница.
const ENTRY_ORDER = ['runtime', 'vendors', 'npm', 'global',];

function getPageChunks(pageName) {
  const moduleKeys = PAGES[pageName] ?? [];
  const usedEntries = new Set(
      moduleKeys.map(k => MODULES[k]?.entry).filter(Boolean)
  );

  // Сортируем по ENTRY_ORDER, всё что не в списке — в конец перед страницей
  const ordered = [];
  for (const name of ENTRY_ORDER) {
    if (name === 'runtime' || name === 'vendors' || name === 'npm') {
      ordered.push(name); // эти чанки создаст сам webpack
    } else if (usedEntries.has(name)) {
      ordered.push(name);
    }
  }
  // Остальные модульные entry (home, calculator, ...) — в алфавитном порядке
  for (const name of [...usedEntries].sort()) {
    if (!ordered.includes(name)) ordered.push(name);
  }
  // И сама страница в самом конце
  ordered.push(pageName);

  return ordered;
}

// ── 4. Страницы для HtmlWebpackPlugin ────────────────────────────
function getPageEntries() {
  const pages = glob.sync('./src/pages/*.html');
  return pages.map(page => {
    const name = path.basename(page, '.html');
    const route = page.replace('./src/pages', '').replace('.html', '');
    return { name, path: page, route: route === '/index' ? '/' : route };
  });
}

// ── Точка входа конфига ──────────────────────────────────────────
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  generateModuleAggregators();

  const entries = buildEntries();
  const pages = getPageEntries();

  return {
    mode: isProduction ? 'production' : 'development',
    entry: entries,

    output: {
      filename: 'assets/js/[name].build.js',
      chunkFilename: 'assets/js/[name].build.chunk.js',
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
        { test: /\.css$/, use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'] },
        { test: /\.(png|svg|jpg|jpeg|gif|webp)$/i, type: 'asset/resource',
          generator: { filename: 'assets/images/[name].[hash][ext]' } },
        { test: /\.(woff|woff2|eot|ttf|otf)$/i, type: 'asset/resource',
          generator: { filename: 'assets/fonts/[name].[hash][ext]' } },
        { test: /\.(mp4|webm|ogg|mp3|wav)$/i, type: 'asset/resource',
          generator: { filename: 'assets/media/[name].[hash][ext]' } },
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
        chunks: getPageChunks(page.name),
        chunksSortMode: 'manual',
        inject: 'body',
      })),
    ],

    optimization: {
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
          // ВАЖНО: не даём webpack выносить модули приложения
          // в безымянные чанки — иначе получите 385.bundle.js
          appModules: {
            test: /[\\/]src[\\/]app[\\/]modules[\\/]/,
            name: false,
            chunks: 'all',
            priority: 30,
            enforce: true,
            reuseExistingChunk: false,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: false },
            output: { comments: false },
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