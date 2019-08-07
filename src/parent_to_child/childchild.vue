<template>
    <div>
        我是childchild组件
        <button @click="$listeners.childToParentMsg(childchildMsg)">childchild按钮</button>
    </div>
</template>

<script>
export default {
    data(){
        return{
            childchildMsg:'我是childchild的数据'
        }
    }
}
</script>