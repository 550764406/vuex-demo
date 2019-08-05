import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

//入口文件，提供vue实例
//如果是服务端调用，每个都应该有一个新的vue实例
export default ()=>{
  const app = new Vue({
      router,
      store, //给每个根组件
      render: h => h(App)
  });
  return {app,router};
}


