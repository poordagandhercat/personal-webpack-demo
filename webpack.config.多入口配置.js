'use strict';

const path = require('path');

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
    mode: 'production'
}