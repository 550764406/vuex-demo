let Vue;

/**
 * [自定义foreach循环]
 * @author suzhe
 * @DateTime 2019-07-28T11:12:17+0800
 * @param    {[type]}                 obj       [description]
 * @param    {[type]}                 classback [description]
 */
const forEach = (obj, classback) => {
    Object.keys(obj).forEach(key => {
        classback(key, obj[key])
    })
}

/**
 * 格式化模块state
 */
class ModuleCollection{
    constructor(options){
        this.register([], options);
    }
    register(path, rootModule){
        let newModule = {
            _raw: rootModule,
            _children:{},
            state: rootModule.state
        }
        if(path.length === 0){
            this.root = newModule
        }else{
            let parent = path.slice(0,-1).reduce((root, cur)=>{
                return this.root._children[cur]
            },this.root)
            parent._children[path[path.length-1]] = newModule
        }
        if(rootModule.modules){
            forEach(rootModule.modules, (name, val)=>{
                this.register(path.concat(name), val)
            })
        }
    }
}

/**
 * [将结果挂载  getters mutations actions]
 * @author suzhe
 * @DateTime 2019-07-28T13:02:26+0800
 */
const installModule = (store, state, path, rootModule) => {
    if(path.length > 0){
        //子模块  把子模块的状态加到父状态
        let parent = path.slice(0,-1).reduce((states, cur)=>{
            return states[cur]
        },state)
        //设置属性
        Vue.set(parent, path[path.length-1], rootModule.state)
    }
    //先处理根模块的getters属性
    let getters = rootModule._raw.getters
    if(getters){
        forEach(getters, (name, fn)=>{
            //模块中的方法定义到store中的方法
            Object.defineProperty(store.getters, name, {
                get: ()=>{
                    return fn(rootModule.state)
                }
            })
        })
    }
    let mutations = rootModule._raw.mutations
    if(mutations){
        forEach(mutations, (name, fn)=>{
            //将mutations 判断是否有同名处理
            let arr = store.mutations[name] || (store.mutations[name] = [])
            // arr.push((payload)=>{
            // 	fn(payload)
            // })
            arr.push(fn)
        })
    }
    let actions = rootModule._raw.actions
    if(actions){
        forEach(actions, (name, fn)=>{
            //将mutations 判断是否有同名处理
            let arr = store.actions[name] || (store.actions[name] = [])
            // arr.push((payload)=>{
            // 	fn(payload)
            // })
            arr.push(fn)
        })
    }
    forEach(rootModule._children, (name, val) => {
        installModule(store, state, path.concat(name), val);
    })
}

/**
 * Store 对象
 */
class Store{
    // constructor(options){
    // 	this._s = new Vue({
    // 		data:{
    // 			state: options.state
    // 		}
    // 	})
    // 	let getters = options.getters || {}
    // 	this.getters = {}
    // 	//把getters属性定义到 this.getters 中，并且根据状态变化 重新执行此函数
    // 	forEach(getters, (name, fn) => {
    // 		Object.defineProperty(this.getters, name, {
    // 			get:() => {
    // 				return fn(this.state)
    // 			}
    // 		})
    // 	})

    // 	let mutations = options.mutations || {}
    // 	this.mutations = {}
    // 	//把mutations属性定义到 this.mutations 中，并且根据用户触发 重新执行此函数
    // 	forEach(mutations, (name, fn) => {
    // 		this.mutations[name] = (payload) => {
    // 			fn.call(this, this.state, payload)
    // 		}
    // 	})

    // 	//获取actions
    // 	let actions = options.actions || {}
    // 	this.actions = {}
    // 	forEach(actions, (name, fn) => {
    // 		this.actions[name] = (payload) => {
    // 			fn.call(this, this, payload)
    // 		}
    // 	})

    // 	this.modules = new ModuleCollection(options)

    // 	//防止外部调用actionsthis指向全局的问题  或es7语法
    // 	// let {dispatch, commit} = this
    // 	// this.dispatch = (...arg)=>{
    // 	// 	dispatch.call(this, ...arg)
    // 	// }
    // 	// this.commit = (...arg)=>{
    // 	// 	commit.call(this, ...arg)
    // 	// }
    // }
    //
    constructor(options){
        this._s = new Vue({
            data:{
                state: options.state
            }
        })
        this.getters = {}
        this.mutations = {}
        this.actions = {}
        this.modules = new ModuleCollection(options)
        console.log(this.modules)
        installModule(this, this.state, [], this.modules.root)
    }
    //防止外部调用actionsthis指向全局的问题
    dispatch = (type, payload) => {
        this.actions[type].forEach(fn=>fn(this, payload))
    }
    commit = (type, payload) => {
        this.mutations[type].forEach(fn=>fn(this.modules.root.state, payload))
    }
    get state(){
        return this._s.state
    }
}

/**
 * [install插件]
 * @author suzhe
 * @DateTime 2019-07-28T11:12:56+0800
 * @param    {[type]}                 _Vue [description]
 */
const install = _Vue =>{
    Vue = _Vue
    Vue.mixin({
        beforeCreate(){
            //深度遍历   确保每个组件拥有$store方法
            if(this.$options && this.$options.store){
                this.$store = this.$options.store
            }else{
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })
}

export default {
    install,
    Store
}