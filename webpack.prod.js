'use strict';

const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const htmlWebpackExternalPlugin = require('html-webpack-externals-plugin');

// 此脚本用来支持动态多页面打包
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
    // console.log('entryFiles', entryFiles);
    // 以下为打印结果   需要运行此函数 setMPA();
    // entryFiles [ 'C:/Users/Ge_yang/Desktop/webpack-demo/src/index/index.js',
    // 'C:/Users/Ge_yang/Desktop/webpack-demo/src/search/index.js' ]
    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];

            const match = entryFile.match(/src\/(.*)\/index\.js/);
            // console.log('match', match);
            // 以下为打印结果   需要运行此函数 setMPA();
            // match [ 'src/index/index.js',
            // 'index',
            // index: 38,
            // input: 'C:/Users/Ge_yang/Desktop/webpack-demo/src/index/index.js',
            // groups: undefined ]
            // ====================================
            // match [ 'src/search/index.js',
            // 'search',
            // index: 38,
            // input: 'C:/Users/Ge_yang/Desktop/webpack-demo/src/search/index.js',
            // groups: undefined ]
            const pageName = match && match[1];
            entry[pageName] = entryFile;
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, `src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    chunks: ['vendors', pageName],
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }
                }),
            )
        })

    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    // 多入口文件配置
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        // chunkhash 为js文件指纹配置，配置长度为8位
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'production',
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
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            // 配置less转css
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                    // browsers: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecision: 8
                        }
                    }
                ]
            },
            // 配置图片
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // hash为图片/文字文件指纹配置，配置长度为8位
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
            // 使用url可以对小图片进行base64转换，优于file-loader
            // {
            //     test: /.(png|jpg|gif|jpeg)$/,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 10240
            //             }
            //         }
            //     ]
            // },
            // 配置文字
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // hash为图片/文字文件指纹配置，配置长度为8位
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        // 配置 --> css代码压缩 附：须安装css处理器 npm i cssnano -D
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        // 每次 npm run build 后，解决需手动删除dist目录的问题
        new CleanWebpackPlugin(),
        // 提取页面公共资源，还需到search/index.html中使用js标签将下面二个entry引入
        new htmlWebpackExternalPlugin({
            externals: [
                {
                    module: 'react',
                    entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                    global: 'React',
                },
                {
                    module: 'react-dom',
                    entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
                    global: 'ReactDOM',
                },
            ]
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ].concat(htmlWebpackPlugins),
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
    // devtool: 'inline-source-map'
};