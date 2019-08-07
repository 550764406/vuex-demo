<template>
    <div>
        父传递子组件的数据:{{parentToChild}}<br>
        <button
                type="button"
                @click="$listeners.childToParentMsg(childToParentMsgData)"
        >子组件传递父组件</button>
        <hr/>
        <Childchild
            v-on="$listeners"
        />

        <hr />
        子组件调用父组件的方法一： <button @click="$listeners.click(childToParentMsgData)">【子组件调用父组件的方法1】</button><br>
        子组件调用父组件的方法二： <button @click="$emit('click',childToParentMsgData)">【子组件调用父组件的方法2】</button>
        子组件调用父组件的方法三： <button v-on="$listeners">【子组件调用父组件的方法3-批量调取】</button>

    </div>
</template>

<script>
import Childchild from './childchild.vue';
export default {
    data(){
        return{
            childToParentMsgData:'子传父数据'
        }
    },
//    props:['parentToChild'],
    props:{
        parentToChild:{
            type: String,
            default: '',
//            validator(value){
//                return value > 3
//            }
        }
    },
    mounted(){
      console.log('child---listeners=======>',this.$listeners)
      console.log('child---$parent=======>',this.$parent)
    },
    methods:{
        childMethods1(){
            console.log('children-methods11111111111')
        }
//        【子组件向父组件传递的数据】
//        方法一：使用$emit  @click="$emit('childToParentMsg',childToParentMsgData)"
//        childToParentMsgFn(){
//            this.$emit('childToParentMsg',this.childToParentMsgData)
//        }

//        方法二：使用$listeners  @click="$listeners.childToParentMsg(childToParentMsgData)"
//        这种方法如果是孙子组件传递到父组件的话，在子组件中需要使用v-on="$listeners"来接收一下，
//        然后父组件可以直接接收到孙子组件传递到父组件的数据

//        【子组件调用父组件的方法】
//        方法一：在元素上调用$listeners方法 $listeners.click(childToParentMsgData)
//        注意：这里$listeners可以获取到父组件上所有传递过来的方法，所以可以自己根据需要调取的方法自己调用即可

//        方法二：@click="$emit('click',childToParentMsgData)" 使用$emit来传递

//        方法三：v-on="$listeners" 这里的批量调取，必须是传递过来的方法是和原生函数同名的click、mouseup、mouseover等这些一致才可以

//        v-on="$listeners" 这个是绑定所有方法的  v-bind="$attr" 是绑定所有属性的
    },
    components:{
        Childchild
    }
}
</script>