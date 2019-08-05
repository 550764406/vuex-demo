const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');//绝对路径
const clientRenderPlugin =require('vue-server-renderer/client-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = (dir)=>{
    return path.resolve(__dirname,dir);
}

module.exports =merge(base,{
    entry: {
        client: resolve('../src/client-entry.js'),
    },
    plugins:[
        new clientRenderPlugin(), //客户端映射
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('../public/index.html')
        })
    ]
})