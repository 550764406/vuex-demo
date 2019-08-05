const Koa = require('koa');//本地服务器
const Router = require('koa-router');
const static = require('koa-static');
const path =require('path');
const app = new Koa();
const router = new Router();
//创建一个渲染器
const fs = require('fs');
const VueServerRender = require('vue-server-renderer');
// let serverBundle= fs.readFileSync('../../../dist/server.bundle.js','utf8')
const serverBundle= require('../../../dist/vue-ssr-server-bundle.json') //生成字符串
//创建渲染函数 然后渲染打包后的结果
const template = fs.readFileSync('../../../dist/index.ssr.html','utf8')
//客户端clientManifest可以找到客户的js文件，可以自动引入到HTML中 其实是index.ssr.html中引入的client.bundle.js
const clientManifest = require('../../../dist/vue-ssr-client-manifest.json');
const render = VueServerRender.createBundleRenderer(serverBundle,{
    template,
    clientManifest //自动为客户端引入client.bundle.js
});

router.get('/',async ctx=>{
    //通过渲染函数 把vue挂载到render上
    ctx.body = await new Promise((resolve,reject)=>{
        //这里必须要写成回调函数的形式，否则样式不生效
        render.renderToString({url:'/'},(err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
})

app.use(router.routes())
//koa 静态文件中间件
app.use(static(path.resolve(__dirname,'../../../dist')))
//如果服务器没有此路径，则跳转此路径
app.use(async ctx=>{
    try {
        ctx.body = await new Promise((resolve,reject)=>{
            //这里必须要写成回调函数的形式，否则样式不生效
            render.renderToString({url:ctx.url},(err,data)=>{
                if(err) reject(err);
                resolve(data);
            })
        })
    }
    catch (e){
        ctx.body = '404'
    }

})

app.listen(7777)

// 流程 先打包一个客户端代码，再打包一个服务端代码，
// 服务端是负责生成一个字符串，客户端渲染服务端的代码，然后在将客户端代码挂载到页面上
//面试会问到vue ssr中路由跳转的规则
