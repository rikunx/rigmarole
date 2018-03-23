const webpack = require('webpack');
const path = require('path');

const outputPath = 'lib';

const common = {
    entry: './rigmarole.js',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};

const es6Module = {
    output: {
        path: path.resolve(__dirname, outputPath),
        filename: 'index.js',
        library: 'rigmarole',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        libraryExport: 'default'
    }
};

const browser = {
    output: {
        path: path.resolve(__dirname, outputPath),
        filename: 'rigmarole.js',
        library: 'rigmarole',
        libraryTarget: 'var',
        libraryExport: 'default'
    }
};

module.exports = [
    Object.assign({}, common, es6Module),
    Object.assign({}, common, browser)
];
