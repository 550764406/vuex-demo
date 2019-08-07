<template>
    <div>
        <Collapse>
            <template v-slot:hello>
                <Collapse1 title="react">内容一内容一内容一</Collapse1>
                <Collapse1 title="vue">内容二<br>内容二内容二</Collapse1>
                <Collapse1 title="node">内容三</Collapse1>
            </template>
        </Collapse>

    </div>
</template>

<script>
// provide 在根组件provide:{a:1} 在其他的子组件里通过注入的方式都可以获取到该值 inject:['a']
export default {
    data(){
        return{

        }
    },
    methods:{
        parentclick(uid){
            this.$children[0].$children.forEach(child=>{
                if(child._uid !== uid){
                    child.isshow = false;
                }
            })
        }
    }
}
</script>

<style>
    .title{
        border: 1px solid #ccc;
        background: #eee;
        width: 200px;
        height:30px;
        text-align: center;
        line-height:30px;
    }
</style>