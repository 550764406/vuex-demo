//服务端配置文件
const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');//绝对路径
const serverRenderPlugin =require('vue-server-renderer/server-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = (dir)=>{
    return path.resolve(__dirname,dir);
}

module.exports =merge(base,{
    entry: {
        server: resolve('../src/server-entry.js'),
    },
    target:'node', //要给node来使用 fs = require('fs');
    output:{
        libraryTarget: 'commonjs2'//把最终这个文件的导出结果放在module.exports上
    },
    plugins:[
        new serverRenderPlugin(), //服务端映射
        new HtmlWebpackPlugin({
            filename: 'index.ssr.html',
            template: resolve('../public/index.ssr.html'),
            excludeChunks:['server'], //排除某个模块
        })
    ]
})