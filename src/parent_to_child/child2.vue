<template>
    <div>
        同级组件传递2
    </div>
</template>

<script>
import Bus from '@/parent_to_child/eventBus';
export default {
    created(){
        Bus.$on('reChild1Tochild2Data',(msg)=>{
            console.log('接收的child传递过来的数据0000000000000000=========》',msg)
        })
    }
}
</script>