const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env) => ({
  cache: {
    type: 'filesystem',
  },

  context: path.resolve(__dirname, '../..'),

  devtool: env.production ? 'source-map' : 'eval-source-map',

  entry: {
    module: './src/module.ts',
  },

  externals: [
    '@grafana/data',
    '@grafana/runtime',
    '@grafana/ui',
    '@emotion/css',
    '@emotion/react',
    'react',
    'react-dom',
  ],

  mode: env.production ? 'production' : 'development',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: false,
                dynamicImport: true,
              },
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          publicPath: `public/plugins/uptime-kuma-status-panel/`,
          outputPath: `img/`,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          publicPath: `public/plugins/uptime-kuma-status-panel/`,
          outputPath: `fonts/`,
        },
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  output: {
    clean: {
      keep: /gpx_/,
    },
    filename: '[name].js',
    library: {
      type: 'amd',
    },
    path: path.resolve(__dirname, '../../dist'),
    publicPath: `public/plugins/uptime-kuma-status-panel/`,
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'plugin.json', to: '.' },
        { from: 'README.md', to: '.' },
        { from: 'CHANGELOG.md', to: '.', noErrorOnMissing: true },
        { from: 'LICENSE', to: '.' },
        { from: 'img/*', to: 'img/[name][ext]', noErrorOnMissing: true },
      ],
    }),

    new ForkTsCheckerWebpackPlugin({
      async: env.development,
      typescript: {
        mode: 'write-references',
        configFile: path.resolve(__dirname, '../../tsconfig.json'),
      },
    }),

    new ESLintPlugin({
      extensions: ['.ts', '.tsx'],
      lintDirtyModulesOnly: true,
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
});