<template>
  <div>
    <!-- inline 代表的是行内表单  代表一行可以放置多个表单元素 -->
    <!-- label属性用于表示选项所含的文本内容 -->
    <!-- value属性用于表示该选项被选中时提交给表单的值 -->
    <el-form :inline="true"  class="demo-form-inline" :model="cform">
      <el-form-item label="一级分类">
        <el-select  placeholder="请选择" v-model="cform.category1id" @change="handler1" :disabled="Show">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select  placeholder="请选择" v-model="cform.category2id" @change="handler2" :disabled="Show">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select  placeholder="请选择" v-model="cform.category3id" @change="handler3" :disabled="Show">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['Show'],
  data() {
    return {
      list1:[],  //一级分类的数据
      // 收集相应的一级二级三级分类的id
      cform:{
        category1id:'',
        category2id:'',
        category3id:''
      },
      list2:[],  //接收二级分类的数据
      list3:[],  //接收三级分类的数据
    } 
  },
  // 组件挂载完毕向服务器发请求，获取相应的一级分类的数据
  mounted() {
    this.getCategory1List()
  },
  methods:{
    // 获取一级分类数据的方法
    async getCategory1List(){
        let result = await this.$API.attr.reqCategory1List()   // 这个请求不需要参数
        if(result.code == 200){
          this.list1 = result.data
        }
    },

    // 一级分类select事件回调（当一级分类的option发生变化的时候获取相应的二级分类数据
    async handler1(){
      // 当一级分类发生变化的时候要清除掉二级分类和三级分类
      this.cform.category2id = ''
      this.cform.category3id = ''
      this.list2 = []
      this.list3 = []
      // 结构出一级分类的id
      const {category1id} = this.cform
      // 通过一级分类的id获取二级分类的数据
      let result = await this.$API.attr.reqCategory2List(category1id)
      if(result.code == 200){
        this.list2 = result.data
      }
      this.$emit('getCategotyId',{categoryId:category1id,level:1})
    },

    // 三级分类select事件回调（当二级分类的option发生变化的时候获取相应的三级分类数据
    async handler2(){
      // 当二级分类的数据发生变化的时候清除三级分类
      this.cform.category3id = ''
      this.list3 = []
      const {category2id} = this.cform
      let result = await this.$API.attr.reqCategory3List(category2id)
      if(result.code == 200){
        this.list3 = result.data
      }
      this.$emit('getCategotyId',{categoryId:category2id,level:2})
    },

    // 三级分类的事件的回调
    handler3(){
      const {category3id} = this.cform
      this.$emit('getCategotyId',{categoryId:category3id,level:3})
    }
  }
};
</script>

<style>
</style>