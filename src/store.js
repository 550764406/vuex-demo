import Vue from 'vue'
import Vuex from './source/vuex/vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //我希望一个项目分成很多个模块
    modules: {
        a:{
            state:{
                x : 1
            },
            mutations:{
                syncAdd (state,payload){
                    console.log('a-module=========>33333333333333333')
                },
            },
            modules:{
                c:{
                    state:{
                        z: 3
                    }
                }
            }
        },
        b: {
            state: {
                y: 2
            }
        }
  },
  state: {
    age: 10
  },
  getters: {

  },
  mutations: {
    //同步的更新用commit
    syncAdd (state,payload){
      console.log('22222222222222')
        state.age += payload
    },
    syncMinus(state, payload){
      state.age -= payload;
    }
  },
  actions: {
    //异步更新使用dispatch 第一调用其他action 第二提交一个mutation
      ayncMinus({commit,dispatch},payload){
        setTimeout(()=>{
          commit('syncMinus',payload)
        },1000)
    }
  }
})
