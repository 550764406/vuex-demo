<template>
    <div>
        同级组件传递1
        <button type="button" @click="child1ToChild2Data">child1 给child2 传递数据</button>
    </div>
</template>

<script>
import Child2 from '@/parent_to_child/child2.vue';
import Bus from '@/parent_to_child/eventBus';
export default {
    data(){
        return{
            child1Data:"我是child里的data数据"
        }
    },
    components:{
        Child2
    },
    methods:{
        child1ToChild2Data(){
            Bus.$emit('reChild1Tochild2Data',{ child1Data:this.child1Data} )
        }
    }
}

/******
 * 同级组件传递数据
 * 组件一引用一个bus，就是创建一个中间件
 * 然后通过Bus.$emit传递数据
 * 另外一个组件通过Bus.$on接收数据既可
 * ********/
</script>