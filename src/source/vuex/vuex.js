let Vue;
//封装的forEach 方法，以便其他地方多次应用
const forEach = (obj, callback)=>{
    Object.keys(obj).forEach(key=>{
        callback(key,obj[key]);
    })
}
//收集所有的module，并返回符合预期的数据结构
class ModuleCollection{
    constructor(options){
        //这里进行所有数据的整合
        this.register([],options); //默认传递空数组
    }
    register(path, rootModdule){
        //这里是希望整理的数据结构模型
        let newModule = {
            _raw: rootModdule,
            state:rootModdule.state,
            _children:{}
        }
        if(path.length ===0){ //根据store.js里是否有modules来判断是否含有子级module
            this.root = newModule;
        }
        else{
            //reduce 如果数组为空，会传上一次的值，直接把值返回；
            let parent = path.slice(0,-1).reduce((root,current)=>{
                return this.root._children[current];
            },this.root);
            parent._children[path[path.length-1]] = newModule;
        }
        if(rootModdule.modules){
            forEach(rootModdule.modules,(moduleName,module)=>{
                this.register(path.concat(moduleName),module);
            })
        }
    }
}
// 我需要递归树， 将结果挂载到 getters mutation actions 里面 收集
const installMoudle = (store, state, path, rootModule)=>{
    //先处理根模块里的getters属性
    let getters = rootModule._raw.getters;
    if(getters){
        forEach(getters,(getterName,fn)=>{
            Object.defineProperty(store.getters,getterName,{
                get:()=>{
                    return fn(rootModule.state)
                }
            })
        })
    }
    let mutations = rootModule._raw.mutations;
    if(mutations){
        forEach(mutations,(mutationName,fn)=>{
            // console.log('mutations===========>',mutations,mutationName)
            let arr = store.mutations[mutationName] || (store.mutations[mutationName] = [])
            arr.push(fn);
        })
    }

    let actions = rootModule._raw.actions;
    if(actions){
        forEach(actions,(actionName,fn)=>{
            let arr = store.actions[actionName] || (store.actions[actionName] = []);
            arr.push(fn)
        })
    }

    forEach(rootModule._children,(name,value)=>{
        installMoudle(store,state,path.concat(name),value);
    })

}

class Store{
    constructor(options){
       this._vm = new Vue({ //面试会问什么时候用到new Vue
           data: { //只要放在data里数据 会根据object.observer 自动添加get和set方法
               state: options.state , //把对象变成了可监控的对象
           }
       });
       this.getters = {};
        //把getters属性定义到this.getters中，并根据状态变化，重新执行此函数
        //这个是没有使用forEach 封装之前的代码
        //  Object.keys(getters).forEach((getterName)=>{
        //      Object.defineProperty(this.getters,getterName,{
        //          get: ()=>{
        //              return getters[getterName](this.state);
        //          },
        //
        //      })
        //  })
        this.mutations = {};
        this.actions = {};
        //这里我需要先格式化当前用户传递过来的数据
        //这里是基本的数据结构
        // let root = {
        //     _raw: rootModdule,
        //     state: {age:10},
        //     _children: {
        //         a:{
        //             _raw: aModule,
        //             _children: {}
        //         },
        //         b:{
        //             _raw: bModule,
        //             _children: {}
        //         },
        //     }
        // }
        //收集模块
        this.modules = new ModuleCollection(options);
        // this.$store 包含getter、mutation、actions
        installMoudle(this,this.state,[],this.modules.root ); //安装模块 第一 当前示例， state 整个状态 []空数组 ，整理的数据
    }
    //处理action 的dispatch
    dispatch = (type, payload)=>{
        // this.actions[type](payload);
        this.actions[type].forEach(fn=>fn(this, payload));
    }

    commit = (type, payload) =>{ //提交找到对应的action执行
        //this.mutations[type](payload);
        console.log('committ=================>',type,payload)
        this.mutations[type].forEach(fn=>fn(this.modules.root.state, payload))
    }

    get state(){ //调用store.state时默认调用这个方法，这个和Object.defineProperty 一样
        return this._vm.state
    }
}
//vue组件渲染，先渲染父组件，再渲染子组件，深度优先
const install = (_Vue)=>{ //install 默认会被执行
    Vue = _Vue;
    //我需要给每个组件都注册一个this.$store的属性
    Vue.mixin({ //可以给每个组件都增加一个方法
        beforeCreate(){ //声明周期 组件创建之前
            //需要先判别是父组件还是子组件，如果是子组件 应该把父组件的store增加给子组件
            if(this.$options && this.$options.store){
                this.$store = this.$options.store;
            }
            else{
                //这里是给子组件添加父组件的store
                this.$store = this.$parent && this.$parent.$store;
            }
        }
    })
}
export default{
    Store,
    install
};
// vuex 原理：
// 1、定义install方法，作用是防止vuex重复安装，然后混入一个this.$store方法，都能获取到this.$store方法
// 2、定义个Store方法，这里包含state、mutation、actions、getters ，另外定义一个modules方法收集所有的模块，定义一个安装模块
// 3、收集模块方法主要为了生成一个
// let root = {
//    _raw: rootModules,
//    state: {age:10},
//    getter:{},...
//   _children:{
//      _raw: aModule,
//      _children: {}
//    }
// }
// 4、这里的安装模块installMoudle函数，是通过参数的方式将getter、state、mutation、actions赋值
// 5、然后在store里这里有调用的所有方法，根据不同的type类型进行调用，实现data更新操作
