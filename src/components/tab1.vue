<template>
    <div class="tab1">
        <input type="text" placeholder="tab11111111111111111" />
        {{tab1}}
    </div>
</template>

<script>
    export default {
        name: 'tab1',
        data(){
            return {
                tab1: "tab1,你好"
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
