//服务端入口
import creatApp from './main';

//服务端需要调用当前的文件产生一个vue的实例
export default (context)=>{
    //涉及到异步问题，最好使用promise
    return new Promise((resolve,reject)=>{
        //服务端会执行此方法
        const {app,router} = creatApp();
        router.push(context.url) //渲染当前这个页面
        router.onReady(()=>{
            //获取当前跳转到的匹配的路径
            const matchs = router.getMatchedComponents();
            if(matchs.length===0){
                console.log('1111111111111111111')
                reject({code:404})
            }
            resolve(app);
        },reject)

    })

}

//服务端需要打包成node模板 来给node使用
