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
    <input type="text" v-model="inputval" />
    <div  v-html="inputval"></div>
    <br>
    {{inputval}}

    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'app',
    data(){
      return {
          scholl: {
              name: "多多",
              age: 10
          },
          inputval:''
      }
    },
    mounted(){
        console.log('app=====>',this.$store)
    },
    methods: {
        //同步增加用commit
        add(){
          this.$store.commit('syncAdd',10)
        },
        // 异步减少用dispatch
        minus(){
            this.$store.dispatch('ayncMinus',10)
        }
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
</style>