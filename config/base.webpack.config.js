/* global require, module, __dirname */

const config = require('./webpack.common.js');
const { resolve } = require('path');

const webpackConfig = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: false,
    optimization: {
        minimize: process.env.NODE_ENV === 'production'
    },
    entry: {
        App: config.paths.entry
    },
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        path: config.paths.public,
        publicPath: config.paths.publicPath
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/i,
            use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }]
        }, {
            test: /\.s?[ac]ss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        }]
    },

    resolve: {
        alias: { react: resolve(__dirname, '../node_modules', 'react') }
    }
};

module.exports = webpackConfig;
