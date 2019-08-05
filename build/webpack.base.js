//基础的webpack配置文件，服务端和客户端都要基于它
const path = require('path');//绝对路径
const VueLoader = require('vue-loader/lib/plugin');
const resolve = (dir)=>{
    return path.resolve(__dirname,dir);
}
module.exports = {
    //webpack 入口

    output:{
        filename: '[name].bundle.js',
        path: resolve('../dist')
    },
    resolve:{
        extensions: ['.js','.vue'] //默认先找js 再找vue
    },
    module:{
        rules:[
            {test:/\.js$/,use:{
                loader: 'babel-loader',
                options:{
                    presets:['@babel/preset-env']
                }
            },exclude: /node_modules/},
            {
                test: /\.css$/,
                use:['vue-style-loader','css-loader']
            },
            {
                test: /\.vue$/,
                use: "vue-loader"
            }
        ]
    },
    plugins:[
        new VueLoader()
    ]
}