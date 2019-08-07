<template>
    <div>
        <div>
        parent<br>
        子组件传递过来的父组件的数据：{{childToParentMsg_Data}}
        <Child
                :parentToChild="parentToChildMsg"
                @childToParentMsg="childToParentMsgFn"
                @click="parentToChildMethod11"
                @mouseup="parentToChildMethod22"
        >
            <!--
            parentToChild:父组件传递子组件的数据
            childToParentMsg：子组件向父组件传递数据 通过方法参数获取  @childToParentMsg="childToParentMsgFn"

            子组件调用父组件的方法：
             方法一：@click="parentToChildMethod11" 传递，子组件里使用$listeners获取来实现
             此方法相当于： this.$on('自定义名称',父组件里方法名称)

             父组件获取子组件的方法: $parent $children
            -->

        </Child>
        <hr />
        </div>


        <Tab></Tab>
    </div>
</template>

<script>
import Child from './child.vue';
import Tab from './tab.vue';
export default {
    data(){
        return{
            parentToChildMsg:"父to子数据",
            childToParentMsg_Data:''
        }
    },
    components:{
        Child,
        Tab
    },
    mounted(){
        this.$children[0].childMethods1()
    },
    methods:{
        childToParentMsgFn(msg){
            this.childToParentMsg_Data = msg;
        },
        //给组件绑定事件需要添加native,则会绑定会组件里最外层的元素上面，如果不添加则被任务是一个普通属性
        parentToChildMethod11(msg){
            console.log('22222',msg)
        },
        parentToChildMethod22(msg){
            console.log('33333',msg)
        },

    }
}
</script>