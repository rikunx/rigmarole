const webpack = require('webpack');
const path = require('path');

const outputPath = 'lib';

const common = {
    mode: 'production',
    entry: './rigmarole.js',
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['babel-preset-env']
                }
            },
            exclude: /node_modules/
        }]
    },
    optimization: {
        minimize: true
    }
};

const es6Module = {
    output: {
        path: path.resolve(__dirname, outputPath),
        filename: 'index.js',
        library: 'rigmarole',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        libraryExport: 'default',
        globalObject: 'this'
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