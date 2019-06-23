'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    // 多入口文件配置
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'development',    // production
    module: {
        rules: [
            // 配置js
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            // 配置css
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // 配置less转css
            {
                test: /.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            // 配置图片
            // {
            //     test: /.(png|jpg|gif|jpeg)$/,
            //     use: 'file-loader'
            // },
            // 使用url可以对小图片进行base64转换，优于file-loader
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240
                        }
                    }
                ]
            },
            // 配置文字
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        // 模块热更新
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        // 指定热更新位置
        contentBase: './dist',
        hot: true
    }
};