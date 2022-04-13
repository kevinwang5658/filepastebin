const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  plugins: [new MiniCssExtractPlugin()],
  entry: {
    client: './javascript/client/client.ts',
    host: './javascript/host/host.ts'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { modules: true }
          }
        ],
        exclude: /node_modules/,
        sideEffects: true
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../dist/client/javascript'),
  },
};