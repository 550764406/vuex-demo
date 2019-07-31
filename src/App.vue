<template>
  <div id="app">
     hello <span>{{this.$store.state.age}}</span><br />
    我的年龄 {{ this.$store.getters.myAge}}
    <button @click="add">同步增加10岁</button>
    <button @click="minus">异步减少10岁</button>
  </div>
</template>

<script>
export default {
    name: 'app',
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
