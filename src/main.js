import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false

//最好不要这样定义组件
Vue.component('Collapse',{
    template:`
        <div><slot name="hello"></slot></div> 
        <!-- 
            注意：这里必须添加slot才可以，否则子组件不显示
            在tab里template v-slot:hello 简写#hello
        -->
    `
});
Vue.component('Collapse1',{
    template: `<div>
        <div class="title" @click="change1">{{title}}</div>
        <div v-show="isshow"><slot></slot></div>
    </div>`,
    props:['title'],
    data(){
      return{
        isshow: false
      }
    },
    methods:{
        change1(){
          this.$parent.$parent.parentclick(this._uid)
            this.isshow = !this.isshow;
        }
    }
})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
