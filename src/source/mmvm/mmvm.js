//存放观察者的方法
class Dep{
    constructor(){
        this.subs = [];//存放所有的watch
    }
    //订阅
    addSub(watch){
        this.subs.push(watch); //添加watch
    }
    //发布
    notify(){
        this.subs.forEach(watch=>{
            watch.update()
        })
    }
}

//观察者模式 （ 发布订阅 ） 被观察者
// vm.$watch(vm,'scholl.name',(newValue)=>{})
class Watcher{
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        //默认要现存放一个老值，如果老值和新值不同在调用cb
        this.oldValue = this.get();
    }
    get(){ // 这里就开始取值了 vm.$data.scholl vm.$data.scholl.name
        //获取老值
        Dep.target = this; //相当于添加一个flag,先把自己放在this上
        //取值 把这个观察者和数据关联起来
        let value = CompilerUtil.getVal(this.vm,this.expr);
        Dep.target = null; //不取消 任何值取值都添加watcher
        return value;
    }
    update(){ //更新操作，数据变化后，会调用观察者的update方法
        let newvalue = CompilerUtil.getVal(this.vm,this.expr);
        if(newvalue != this.oldValue){
            this.cb(newvalue);
        }
    }
}

//实现数据劫持功能
class Observer{
    constructor(data){
        this.observer(data);
    }
    observer(data){
        if(data && typeof data == 'object'){
            //如果是对象才进行观察 为了修改数据更新数据
            for(let key in data){
                this.defineReactive(data,key,data[key]);
            }
        }
    }

    //使用Object.definProperty来定义对象
    defineReactive(obj,key,value){
        this.observer(value); //如果里面还是对象，则深度递归
        let dep = new Dep(); //给每个属性都添加上发布订阅的功能
        Object.defineProperty(obj,key,{
            get(){
                //创建watcher 时，会调用get方法，会取到对应的内容，并且把watcher放在全局this上；这样就可以判断是否添加了watcher；
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set:(newVal)=>{ //school:{name:"多多",age:20}}
                if(value != newVal){
                    this.observer(newVal)
                    value = newVal;
                    dep.notify();
                }
            }
        })
    }
}

//定义编译的基类 调度
class Compiler{
    constructor(el,vm){
        //判断el属性是不是一个元素，如果不是元素，就获取
        this.el = this.isElementNode(el) ? el: document.querySelector(el);
        this.vm = vm;
        //把当前元素的节点 放到内存中
        let fragment = this.node2fragment(this.el);
        //把节点内容进行替换
        //编译模板，用数据编译
        this.compile( fragment );
        //把内容放在页面内
        this.el.appendChild(fragment);
    }
    //用来判断是否是带有指令的元素 依据为是否含有v-
    isDirective(attrName){
        return attrName.startsWith('v-');
    }
    //编译元素的方法
    compileElement(node){
        let attributes = node.attributes; //返回的是一个类数组
        [...attributes].forEach(attr =>{ //返回的key：value type="text" v-model="school.name"'
            let { name,value:expr } = attr;
            if(this.isDirective(name)){
                let [,directive]= name.split('-');
                let [directiveName,eventName] = directive.split(":");
                //需要调用不同的指令来处理
                CompilerUtil[directiveName](node,expr,this.vm,eventName);
            }
        })
    }
    //编译文本的方法
    compileText(node){ //判断当前文本节点中的内容是否含有{{}}
        let content = node.textContent;
        if(/\{\{(.+?)\}\}/.test(content)){
            //文本节点
            CompilerUtil['text'](node,content,this.vm); //文本 {{a}}
        }
    }

    //核心的编译方法
    compile( node ){ //用来编译内存中的dom节点
        let childNodes = node.childNodes;
        [...childNodes].forEach(child=>{
            if(this.isElementNode(child)){
                this.compileElement(child);
                //如果是元素的话，需要把自己传进去，在遍历子节点 递归所有子节点
                this.compile(child);
            }
            else{
                this.compileText(child)
            }
        })
    }

    node2fragment(node){
        //创建文档碎片
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = node.firstChild){
            //appendchild 追加到第一个索引上 具有移动性
            fragment.appendChild(firstChild);
        }
        return fragment;
    }

    isElementNode(node){ //判断当前node是否为元素节点
        return node.nodeType ===1;
    }
}

//编译工具
CompilerUtil = {
    getVal(vm, expr){
        //根据表达式取到对应的数据 这里的值是对象
        return expr.split('.').reduce((data,current)=>{ //这里没有点会默认返回当前数据
            return data[current];
        }, vm.$data) //vm.$data作为当前函数的data数据
    },
    setValue(vm,expr,value){
        // 给表达式重新赋值
        return expr.split('.').reduce((data,current,index,arr)=>{
            if(index == arr.length-1){
                return data[current] =value;
            }
            return data[current];
        },vm.$data);

    },
    //解析v-model这个指令
    model(node,expr,vm){//node是节点  expr是表达式 vm是当前实例
        //给输入框赋值 v-modle node.value = xxx
        let fn = this.updater['modelUpdater'];
        new Watcher(vm,expr,(newVal)=>{ //给输入框添加一个观察者，如果稍后更新，会触发此方法，会重新赋值
            fn(node,newVal)
        })
        node.addEventListener('input',(e)=>{
            let value = e.target.value;//获取用户输入的值
            this.setValue(vm,expr,value); //给表达式设置新的输入值
        })
        let value = this.getVal(vm ,expr); //返回的就是data里的value值
        fn(node,value)
    },
    html(node,expr,vm){ //expr : v-html='msg'
        //node.innerHTML = xxx;
        let fn = this.updater['htmlUpdater'];
        new Watcher(vm,expr,(newVal)=>{ //给输入框添加一个观察者，如果稍后更新，会触发此方法，会重新赋值
            fn(node,newVal)
        })
        let value = this.getVal(vm ,expr); //返回的就是data里的value值
        fn(node,value)
    },
    getContentValue(vm,expr){
        return expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            return this.getVal(vm,args[1]); //遍历表达式，将所有的内容都替换成一个完整的字符串并返回回去
        })
    },
    //v-on:click来封装新的方法
    on(node,expr,vm,eventName){ //v-on:click=change expr指的是change
        node.addEventListener(eventName,(e)=>{
            vm[expr].call(vm,e); //this.change
        })
    },
    text(node,expr,vm){ //node 节点 expr =>{{a}} {{b}} {{c}} vm是当前实例
        let fn = this.updater['textUpdater'];
        let content = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{ //箭头函数是没有argument
            //给表达式中每个大括号变量都添加上观察者
            new Watcher(vm,args[1],(newValue)=>{ //给输入框添加一个观察者，如果稍后更新，会触发此方法，会重新赋值
                fn(node,this.getContentValue(vm,expr)); //返回一个全的字符串
            })
            return this.getVal(vm,args[1]) //这里的args[1]是{{a}}
        })
        fn(node,content);
    },
    updater:{
        //处理input 里的数据
        modelUpdater(node,value){
            node.value = value;
        },
        htmlUpdater(node,value){
            //node.innerHTML = xxx;
            node.innerHTML = value;
        },
        //处理文本节点
        textUpdater(node,value){
            node.textContent = value;
        }
    }
}

//定义基类 vue
class Vue{
    constructor(options){
        this.$el= options.el;
        this.$data = options.data;
        let computed = options.computed;
        let methods = options.methods;
        //在根元素 存在模板编译
        if(this.$el){
            //把数据全部转化为Object.defineProperty来定义
            //Object.defineProperty('a','name',{set(){},get(){}})
            new Observer(this.$data);

            //{{getNewName}} reduce  vm.$data.getNewName 上面的get set方法里使用的数据是vm.$data
            for(let key in computed){ //有依赖关系 依赖对应的state里的值
                Object.defineProperty(this.$data,key,{
                    get:()=>{
                        return computed[key].call(this);
                    }
                })
            }

            for(let key in methods){ //有依赖关系 依赖对应的state里的值
                Object.defineProperty(this,key,{
                    get:()=>{
                        return methods[key];
                    }
                })
            }
            //把数据获取操作 把vm上的取值操作都代理到 vm.$data
            this.proxyVm(this.$data);
            new Compiler(this.$el,this);
        }
    }
    //可以通过vm 取到对应vm.$data里的值 代理方法
    proxyVm(data){
        for(let key in data){
            Object.defineProperty(this,key,{
                get(){
                    return data[key]; //将取值操作vm.$data 代理成 vm
                },
                set(newVal){ //设置代理方法
                    data[key] = newVal;
                }
            })
        }
    }
}

//原理：
// 1、定义vue基类，这里包含data、methods、computed，
// 2、将所有的这些都定义成Object.defineProperty的形式
// 3、定义Compiler类来编译模板
//    模板编译原理:
//     a、将template模板通过parse(将模板中指令、class类、style等转化成AST语法数)
//        【这里包含节点的一些描述，包含是否静态节点，渲染模式等】
//     b、通过optimze进行优化(用来标记静态节点，diff算法会直接跳过静态节点，优化性能)
//     c、通过generate得到render和staticRenderFns，最终得到render字符串和staticRenderFns字符串，返回vnode渲染节点
// 4、将vm取值代理到vm.$data里