const CreateFileWebpack = require('create-file-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const { figmaPlugin } = require('./package.json');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            arguments: true,
            drop_console: true,
          },
        },
      }),
    ],
  },
  entry: {
    ui: './src/Ui.tsx',
    code: './src/main/code.ts',
  },
  watchOptions: {
    ignored: ['node_modules/**'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2016',
          tsconfigRaw: require('./tsconfig.json'),
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, figmaPlugin.name),
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
    }),
    new HtmlWebpackPlugin({
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
      inject: false,
      templateContent: ({ compilation, htmlWebpackPlugin }) => `
        <html>
          <body>
          <div id="app"></div>
          ${htmlWebpackPlugin.files.js.map(
            (jsFile) =>
              `<script>${compilation.assets[
                jsFile.substr(htmlWebpackPlugin.files.publicPath.length)
              ].source()}</script>`
          )}
          </body>
        </html>
      `,
    }),
    new CreateFileWebpack({
      path: path.resolve(__dirname, figmaPlugin.name),
      fileName: 'manifest.json',
      content: JSON.stringify(figmaPlugin),
    }),
  ],
});
