const path = require('path');
const webpack = require('webpack');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  entry: {
    client: './javascript/client/client.ts',
    host: './javascript/host/host.ts',
  },
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
          'style-loader',
          'css-loader',
        ],
        exclude: /node_modules/,
        sideEffects: true,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      '__SERVER_URL__': JSON.stringify(process.env.SERVER_URL || ''),
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../dist/client/javascript'),
  },
};
