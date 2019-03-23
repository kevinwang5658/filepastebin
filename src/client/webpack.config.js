const path = require('path');

module.exports = {
    entry: './javascript/host/host.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: __dirname + '/tsconfig.json',
                        projectReferences: true
                    }
                }],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve('../../dist/client/javascript')
    }
};