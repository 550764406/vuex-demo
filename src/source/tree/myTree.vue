<template>
    <el-tree
       :data="allData"
       default-expand-all
       :render-content="renderContent"
       :expand-on-click-node = "false"
    >
    </el-tree>
</template>

<script>
    import _ from 'lodash';
export default {
    name:'mytree',
    props:{
        data:{
            type: Array,
            default:()=>[]
        },
        fileDrop: Array,
        diectoryDrop: Array,
        delete: Function
    },
//    props:['data'],
    data(){
      return {
          allData:[],
          currentid: '', //默认谁点击
          currentConent:''//默认点击的内容
      }
    },
    watch:{ // 需要检测父组件传递过来的data属性
      data(){ //数据更新 就需要重新渲染数据
          this.transformData();
      }
    },
    methods:{
        //判断是父元素添加文件夹图标
        isParent(data){
            return data.type === 'parent';
        },
        //重命名方法
        handleRename(data){
            this.currentid = data.id;
            this.currentConent = data.name;
        },
        //删除方法
        remove(id){
          //删除页面中的内容
           let list = _.cloneDeep(this.data);
           let newlist = list.filter((l)=>{
               return l.id !== id;
           });
           this.$message({type: 'success', message: '删除成功!'});
           //.sync 方法可以同步数据
           this.$emit('update:data',newlist) //告诉父组件同步数据
        },
        handleRemove(data){
            this.$confirm(`此操作将永久删除该文件,${data.name} 是否继续?'`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //不能直接将数据删除 需要调用用户的删除方法
                //如果用户传递了delete方法，可以直接删除，如果没传，直接删除即可
                this.delete?this.delete(data.id).then(()=>{
                    this.remove(data.id)
                    }):this.remove(data.id);
//                this.$message({type: 'success', message: '删除成功!'});
            }).catch(() => {
                this.$message({type: 'info', message: '已取消删除'});
            });
        },
        handleCommand(data,value){
            if(value ==='rn'){
                this.handleRename(data);
            }
            else if(value ==='rm'){
                this.handleRemove(data);
            }
        },
        cancel(){
          this.currentid = "";
        },
        ok(id){
            let list = _.cloneDeep(this.data);
            let item = list.find((l)=>{
                return l.id !== id;
            });
            item.name = this.currentConent;
            this.currentid = '';
            this.$message({type: 'success', message: '修改成功!'});
            //.sync 方法可以同步数据
            this.$emit('update:data',list) //告诉父组件同步数据
        },
        handleInput(v){
            this.currentConent = v;
        },
        //渲染图标，也可以放在data里
        renderContent(h, { node, data, store }){ //h:createlement
            let list = this.isParent(data)? this.diectoryDrop : this.fileDrop;
            return (
                <div>
                    { this.isParent(data) ?
                        node.expanded ?<i class= 'el-icon-folder-opened'></i>: <i class='el-icon-folder'></i>
                        :<i class='el-icon-document'></i>}

                    {data.id === this.currentid ? <el-input value={this.currentConent} on-input={this.handleInput}></el-input>: data.name}


                    {data.id !== this.currentid ? <el-dropdown placement="bottom-start" trigger="click" on-command={this.handleCommand.bind(this,data)}>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                        <el-dropdown-menu slot="dropdown">
                        { list.map(item=>(
                            <el-dropdown-item command={item.text}>{item.value}</el-dropdown-item>
                    ))}
                    </el-dropdown-menu>
                    </el-dropdown> :
                    <span style={{marginLeft:'10px'}}>
                        <el-button on-click={this.ok.bind(this,data)}>确认</el-button>
                        <el-button  on-click={this.cancel}>取消</el-button>
                    </span>}
                </div>
            )
        },
      //获取数据
      transformData(){
          //需要根据数据克隆，对克隆后的数据进行操作,防止子组件操作父组件的数据
          let AllData = _.cloneDeep(this.data);
          console.log('mytree--data ==============>',AllData)
          //做一个数组映射 {1,{name: "文件夹1", pid: 0, id: 1}}
          let treeMapList = AllData.reduce((meno,current)=>{
              current.label = current.name;
              meno[current["id"]] = current;
              return meno;
          },{})

          console.log('treeMapList=========>',treeMapList);

          //查找数据里的父id
          let result = AllData.reduce((arr,current)=>{
              let pid = current.pid;
              let parent = treeMapList[pid];
              if(parent){ //如有parent,则把current放在parent里面去
                  parent.children ? parent.children.push(current): parent.children = [current];
              }
              else if(pid === 0 ){ //如果没有就是根文件夹
                  arr.push(current);
              }
              return arr;
          },[])
          this.allData = result;
          console.log('result====>',result)
      }
    },
    mounted(){
        this.transformData();
    }
}
</script>

<style>
    .el-tree{
        width: 50%;
    }
    .el-tree-node__content{
        position: relative;
        height:40px;
    }

    .el-dropdown{
        position: absolute;
        right: 0px;
        top: 0
    }
</style>