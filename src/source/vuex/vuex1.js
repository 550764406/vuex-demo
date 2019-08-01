let Vue;
const forEach = (obj, callback)=>{
    Object.keys(obj).forEach(key=>{
        callback(key,obj[key]);
    })
}
class Store{
    constructor(options){
       this._vm = new Vue({ //面试会问什么时候用到new Vue
           data: { //只要放在data里数据 会根据object.observer 自动添加get和set方法
               state: options.state , //把对象变成了可监控的对象
           }
       });
       let getters = options.getters || {}; //用户传递过来的getters
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
        forEach(getters,(getterName,value)=>{
            Object.defineProperty(this.getters,getterName,{
                get: ()=>{
                    return getters[getterName](this.state);
                },

            })
        })

        let mutations = options.mutations || {};
        this.mutations = {};
        //这个是没有使用forEach 封装之前的
        // Object.keys(mutations).forEach( mutationName => {
        //     //先把用户传递过来的mutations放在我们的store实例上
        //     this.mutations[mutationName] = (payload)=>{
        //         mutations[mutationName](this.state,payload); //这里调用的store里的mutations里的方法
        //     }
        // })

        forEach(mutations, (mutationName,value) => {
            //先把用户传递过来的mutations放在我们的store实例上
            this.mutations[mutationName] = (payload)=>{
                value(this.state,payload);
            }
        })

        let actions = options.actions || {};
        this.actions = {};
        forEach(actions,(actionName,value)=>{
            this.actions[actionName] = (payload)=>{
                value(this,payload)
            }
        })

    }
    //处理action 的dispatch
    dispatch = (type, payload)=>{
        this.actions[type](payload);
    }

    commit = (type, payload) =>{ //提交找到对应的action执行
        this.mutations[type](payload);
    }

    get state(){ //调用store.state时默认调用这个方法，这个和Object.defineProperty 一样
        return this._vm.state
    }
}

const install = (_Vue)=>{ //install 默认会被执行
    Vue = _Vue;
    //我需要给每个组件都注册一个this.$store的属性
    Vue.mixin({
        beforeCreate(){ //声明周期 组件创建之前
            //需要先判别是父组件还是子组件，如果是子组件 应该把父组件的store增加给子组件
            if(this.$options && this.$options.store){
                this.$store = this.$options.store;
            }
            else{
                //这里是子组件添加父组件的store
                this.$store = this.$parent && this.$parent.$store;
            }
        }
    })
}
export default{
    Store,
    install
};
