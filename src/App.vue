<template>
  <div id="app">
    <!--=======================vuex-start==========================-->
    <div class="marB20">
      <span>{{this.$store.state.age}}</span><br />
      我的年龄 {{ this.$store.getters.myAge}}
      <button @click="add">同步增加10岁</button>
      <button @click="minus">异步减少10岁</button>
    </div>
    <!--=======================vuex-over==========================-->

    <!--=======================MMVM-start==========================-->
      <div class="marB20">
        <input type="text" v-model="scholl.name" />
        <ul>
          <li>{{scholl.name}}</li>
          <li>{{scholl.age}}</li>
        </ul>

      </div>
    <!--=======================MMVM-over==========================-->

    <!--=======================vModel-start==========================-->
    <input type="text" v-model="inputval" />
    <div  v-html="inputval"></div>
    <br>
    {{inputval}}
    <!--
      这里是测试v-model时如果输入标签时，v-html编译的问题
      解决：需要进行转义或者repalce替换一下，进行模板转义处理
    -->
     <!--=======================vModel-over==========================-->

      <br>
     <!--=======================Ref-start==========================-->
    <div ref="test">{{test}}</div>
    <button @click="handleTest">点击test</button>
      <!--=======================Ref-over==========================-->

      <!--=======================keepAlive-start==========================-->
      <div class="keepBox">
          <keep-alive>
            <span>
                <Tab1 v-if="isKeep"></Tab1>
                <Tab2 v-else></Tab2>
            </span>
          </keep-alive>
          <button @click="handleKeepClick">点击test</button>
      </div>
      <!--=======================keepAlive-over==========================-->
    <router-view/>
  </div>
</template>

<script>
import Tab1 from '../src/components/tab1.vue';
import Tab2 from '../src/components/tab2.vue';
export default {
    name: 'app',
    data(){
      return {
          scholl: {
              name: "多多",
              age: 10
          },
          inputval:'',
          test: 'begin',
          isKeep: true //测试keep-alive缓存使用的
      }
    },
    mounted(){
        console.log('app=====>',this.$store);
    },
    methods: {
        //同步增加用commit
        add(){
          this.$store.commit('syncAdd',10)
        },
        // 异步减少用dispatch
        minus(){
            this.$store.dispatch('ayncMinus',10)
        },
        //这里测试ref异步执行的返回值的调用问题
        handleTest(){
            this.test= 'end';
            this.$nextTick(()=>{
                console.log('inner=========>',this.$refs.test.innerText) // 这里才是返回设置的end值
            })
            console.log(this.$refs.test.innerText) // 这里返回 begin
            // 这里实现的原理
            // 1、设置了data值更新后，会触发date里的setter方法，
            // 2、然后触发闭包里的Dep监听事件，然后去触发Dep所管理的watcher对象方法，
            // 3、然后watcher对象触发update来实现整体的更新操作
            // 4、vue采用的是异步更新操作，当调用update更新时调用queueWatcher函数
            //   （如果是懒加载，等待加载完成设置flag状态，如果是同步，更新，如果是异步调用queueWatcher函数）
            // 5、queueWatcher函数，不会立即更新视图，会生成一个queue队列，状态变为wating，
            //    其他的不是重复id的watcher对象继续被push到队列中，等待下一次的nextTick更新
            // 6、nextTick更新其实是需要返回一个promise对象或者MutationObserver 或者setTimeout()函数，
            //    当前函数的then 栈执行完成后，在调用回调函数，因此实现了异步触发的目的；
        },
        //这里查看keep-alive缓存使用的
        // 使用了两个生命周期函数 created 和 destoryed
        // 本身提供了activated 和deactivated 来判断当前组件是否处于激活状态
        // 缓存原理：
        // 1、在created的时候创建cache 对象，作为缓存容器，保存vnode节点
        //    this.cache = Object.create(null);
        // 2、destoryed的时候销毁cache缓存中的所有组件; 循环销毁每一个cache中组件
        //   pruneCacheEntry(this.cache[key]);
        //3、pruneCacheEntry函数通过判断当前是否是渲染的函数和是否为渲染的组件来销毁vnode里对应的组件实例，从cache中清除
        //   cache[key] = null
        // 4、render函数
        //   缓存原理：首先获取第一个组件的name，然后进行include和exclude进行匹配，匹配不成功，则直接返回vnode进行渲染
        //   匹配规则： 判断是否能匹配到 名称如‘a,b,c’这种的，因为include和exclude中可以在路由中设置多个
        handleKeepClick(){
            this.isKeep = !this.isKeep;
        }
    },
    components:{
        Tab1,
        Tab2
    }
}
</script>

<style>
  body{
    padding: 30px;
  }
  .marB20{
    margin-bottom: 20px;
  }
    .keepBox{
        padding: 30px;
        background: #ccc;
    }
</style>