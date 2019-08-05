import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    //ssr渲染测试用的
    // {
    //   path: '/',
    //   name: 'foo',
    //   component: () => import(/* webpackChunkName: "about" */ './components/Foo.vue')
    // },
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
      path: '/bar',
      name: 'bar',
      component: () => import(/* webpackChunkName: "about" */ './components/Bar.vue')
    },
    {
      path: '/Main1',
      name: 'main1',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
      component: () => import(/* webpackChunkName: "about" */ './source/tree/Main1.vue')
    }
  ]
})
