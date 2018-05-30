// $ webpack -v
// 4.0.0

// $ npm -v
// 6.1.0

// $ node -v
// v10.3.0


const path = require('path');

// переключение между режимами сборки передача параметра
//$ NODE_ENV=development webpack
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

//для минификации , сжатие
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// npm i extract-text-webpack-plugin
let ExtractTextPlugin = require("extract-text-webpack-plugin");// для сборки css в отдельный файл подключенный в js через import style './css/style.css'

//npm i html-webpack-plugin --save
const HtmlWebpackPlugin = require('html-webpack-plugin');

//npm i imagemin-webpack-plugin --save
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
    mode: NODE_ENV,//  "production" | "development" | "none",
    context: __dirname+'/assets/js/src',
    devtool: ((NODE_ENV == "development") ? "source-map":"") ,
   // devtool: "source-map",// сохраняет не сжатую копию, для отладки
    //entry: './assets/js/src/index.js',
    entry:{
        home:'./index.js',// относительно context
        about:'./about.js'// относительно context
       // login:'./login.js'
    },
    output: {
        path: path.resolve(__dirname, 'assets/js/dist'),
       // filename: 'bundle.js',
        filename: '[name].js',// home , about создастся файл
        library:'mylibrary',//глобальная переменная
        publicPath: "/assets/js/dist/"// доступ url из браузера
    },
    //автосборка отслеживание
    //watch: true,
    // автосборка при development
    //watch: NODE_ENV == 'development',
    watchOptions: {
        //время ожидания после изменения
        aggregateTimeout:100
    },
    plugins:[
        // вынести в окружение переменные окружения
     new webpack.DefinePlugin({
         NODE_ENV:JSON.stringify(NODE_ENV),
         LANG:'"ru"'
     }),
        new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
        new HtmlWebpackPlugin({
            template: '../../../index.html'
        }),

    ],


    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [
                    path.resolve(__dirname, `assets/js/src`)
                ],
                exclude: /(node_modules|bower_components)/,
                use:
                    {
                        loader: "babel-loader?optional[]=runtime",
                        options: {
                            presets: ['env',"es2015", 'stage-3'],
                            //plugins: [require('plugin-proposal-object-rest-spread')]
                        }
                    }
            },

            {
                test: /\.html$/,
                use: 'raw-loader'// npm i raw-loader --save
            },
            // npm install --save-dev style-loader css-loader
           // подключение css
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, `assets/css/src`)
                ],
                use:['style-loader', 'css-loader'],
                exclude: /(node_modules|bower_components)/,
            },

            /* загрузка и оптимизация картинок */
            //npm install --save-dev url-loader file-loader responsive-loader
            {
                test: /\.(png|jpg|gif|ico)$/,
                include: [
                    path.resolve(__dirname, `assets/image/src`)
                ],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100,
                            mimetype: 'image/png',
                            fallback: 'responsive-loader' /* резервный загрузки если размер не подходит*/

                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                include: [
                    path.resolve(__dirname, `assets/image/src`)
                ],
                loader: "file-loader?name=../../../assets/image/dist/[name].[ext]"
            },
        ]
    },
    // для модулей , типа entry: './assets/js/src/index.js',
    resolve: {
        modules:['node_modules'],// в каких директориях искать модуль если нет пути
        extensions: [ '.js', '.json' ]
    },
    //для loaderов
    resolveLoader: {
        modules: [ 'node_modules' ],
        extensions: [ '.js', '.json' ],
        mainFields: [ 'loader', 'main' ]
    },

    optimization: {
        minimizer:
            // we specify a custom UglifyJsPlugin here to get source maps in production
              getPlugin()
      }
};


function getPlugin() {
   return NODE_ENV == "production" ? [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                compress: false,
                ecma: 6,
                mangle: true
            },
            sourceMap: true
        })

    ]:[]
}