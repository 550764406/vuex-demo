const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');

const app = new Koa();
const router = new Router();
const Vue = require('vue');
const VueServerRender = require('vue-server-renderer');
const vm = new Vue({
    data(){
        return{
            msg: 'hello zf'
        }
    },
    template:'<div>{{msg}}</div>'
})
//创建一个渲染器
const fs = require('fs');
const template = fs.readFileSync('./template.html','utf8');
//创建渲染函数
const render = VueServerRender.createRenderer({
    template //模板字符串 模板里必须有vue-ssr-outlet
});

router.get('/',async ctx=>{
    //通过渲染函数 把vue挂载到render上
    ctx.body = await render.renderToString(vm)
})


app.use(router.routes())

app.listen(7777)