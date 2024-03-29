const path = require('path');

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
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../dist/client/javascript'),
  },
};
