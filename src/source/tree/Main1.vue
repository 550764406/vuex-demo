<template>
    <div id="Main">
        <myTree
             :data.sync="fdata"
             :fileDrop="fileDrop"
             :diectoryDrop="diectoryDrop"
             v-if="fdata.length"
             :delete="deletefn"
        >
        </myTree>
    </div>
</template>

<script>
import {getTreeList} from './api';
import myTree from './myTree.vue';
export default{
    data(){
      return{
          fdata:[],
          fileDrop:[ //文件只能删除
              {
                  text: 'rm',
                  value: "删除文件"
              }
          ],
          diectoryDrop:[ //文件夹可以修改可以删除
              {
                  text: 'rn',
                  value: "修改名字"
              },
              {
                  text: 'rm',
                  value: "删除文件夹"
              }
          ]
      }
    },
    async mounted(){
        let { data } = await getTreeList();
        // 扁平的数据变成多层数据 递归操作
        data.parent.forEach( p => p.type = 'parent');
        let allData = [...data.parent,...data.child];
        this.fdata = allData;
    },
    components:{
        myTree
    },
    methods:{
        deletefn(id){ //这个方法返回一个promise
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve();
                },3000)
            })
        }
    }
}
</script>
