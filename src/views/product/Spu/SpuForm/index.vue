<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4px"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <!-- 上传图片
        action是图片上传的地址
        list-type文件列表类型
        :on-preview  :on-remove 图片预览和删除的时候触发
        file-list ： 照片墙需要展示的数据（数组，数组里面的元素务必要有name  url）
        :on-preview：图片的预览功能
        :on-remove：照片墙删除功能
        :on-success: 图片上传成功的回调
         -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndattrName">
          <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" v-for="unSelect in unSelectSaleAttr" :key="unSelect.id"></el-option>
        </el-select>

        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndattrName" @click="addSaleAttr">添加销售属性</el-button>

        <!-- table展示的是当前spu自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, }">
              <!-- el-tag用于展示已有的属性值列表的数据 -->
              <el-tag :key="tag.id"  v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="deletSaleAttrValue(row.spuSaleAttrValueList,index)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 地下的结构可以当作之前的span与input的切换 
              @keyup.enter.native="handleInputConfirm"
               -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)">
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ 添 加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // spu这个属性初始化的时候是一个空对象 再修改spu的时候会向服务器发请求，返回spu的信息是一个对象，修改的时候可以利用服务器返回的对象收集最新的数据提交给服务器
      // 还有一个操作是添加spu，如果是添加spu 的时候，并没有向服务器发请求，数据还是需要收集到spu里面，收集数据的时候需要哪些字段呢？
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 品牌id
        tmId: '',
        // 描述
        description: "",
        // spu的名称
        spuName: "",
        // 收集spu图片的信息
        spuImageList: [
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          },
        ],
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          }, */
        ],
      }, // 存储spu信息属性

      tradeMarkList: [], //存储的品牌信息
      spuImageList: [], //存储spu图片的数据
      saleAttrList: [], //存储销售属性列表，项目的全部销售属性
      attrIdAndattrName:'',   //收集未选择的销售属性的ID
    };
  },
  computed:{
    // 计算出还未选择的销售属性
    unSelectSaleAttr(){
      // 整个平台的销售属性有三个  颜色，尺寸，版本------saleAttrList
      // 当前spu拥有的属于自己的销售属性，--------spu.spuSaleAttrValueList
      // 数组过滤，从已有的数组当中过滤出用户需要的元素，并且返回一个新的数组
      let result =  this.saleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    // 照片墙删除的功能
    handleRemove(file, fileList) {
      // file，代表删除的那张图，filelist代表照片墙删除某一张图片以后剩余的其它的图片
      // 收集照片墙图片的数据
      // 对于照片墙中显示的图片，有name和url字段的，因为照片墙显示数据需要这两个属性，对于服务器而言不需要name与url字段，将来对于已有图片的数据，在提交给服务器的时候需要注意
      this.spuImageList = fileList
      console.log(file, fileList);
    },
    // 预览
    handlePictureCardPreview(file) {
      // 将数据中图片的地址赋值给dialogImageUrl
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response,file,fileList){
      // 收集图片的信息
      this.spuImageList = fileList
    },

    // 初始化SpuForm数组
    async initSpuData(Spu) {
      // 获取spu信息的数据
      let spuResult = await this.$API.spu.reqGetSpu(Spu.id);
      if (spuResult.code === 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(Spu.id);
      if (spuImageResult.code === 200) {
        let listArr = spuImageResult.data;
        // 由于照片墙显示图片的数据需要数组,数组里面的元素需要有name与url字段
        // 需要把服务器返回的数据进行修改
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 把整理好的数据返回给data里的spuImageList
        this.spuImageList = listArr;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加新的销售属性
    addSaleAttr(){
      // 以及收集到了需要添加的销售属性的信息
      // 要把收集到的销售属性的数据进行分割
      let baseSaleAttrId=this.attrIdAndattrName.split(':')[0]
      let saleAttrName = this.attrIdAndattrName.split(':')[1]
      // 向spu对象的spuSaleAttrList属性里面添加新的销售属性
      let newSale = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList:[]
      }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSale)
      this.attrIdAndattrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row){
      // 点击添加按钮，需要由button变为input，通过当前销售属性的inputVisible控制
      // 但是当前的销售属性没有这个字段
      this.$set(row,'inputVisible',true)
      // 通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row,'inputValue','')
    },
    // el-input失去焦点事件
    handleInputConfirm(row){
      // 修改inputVisible为false
      row.inputVisible = false
      // 应该再往销售属性里面新增这个值
      const {baseSaleAttrId,inputValue} = row   //解构出新增的销售属性值
      // 新增的销售属性值的名称不能为空
      if(inputValue.trim() === ''){
        this.$message.warning('属性值不能为空')
        return
      }
      // 属性值不能重复
      let result = false
      row.spuSaleAttrValueList.forEach(item=>{
        if(item.saleAttrValueName == inputValue){
          result = true
        }
      })
      if(result){
        this.$message.warning('属性值不能重复')
        return
      }
      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newSaleAttrValue)
    },
    // 删除 属性值的回调
    deletSaleAttrValue(attrValue,index){
      attrValue.splice(index,1)
    },
    // 保存按钮的回调
    async addOrUpdateSpu(){
      // 整理参数  需要整理照片墙的数据
      // 携带参数：对于图片需要携带imageName，imageUrl字段
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return {
          imgName:item.name,
          imgUrl:(item.response&&item.response.data)||item.url
          //这里imgurl不一定是item.url如果是上传的图片那就是response.data
        }
      })
      let result =  await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code===200){
        this.$message.success('保存成功')
        this.$emit('changeScene',{scene:0,flag:this.spu.id?1:0})
      }
      Object.assign(this._data,this.$options.data())
    },
    // 点击添加spu按钮的时候发请求的函数
    async addSpuData(category3Id){
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
      // 添加spu的时候需要收到三级分类的id
      this.spu.category3Id = category3Id
    },
    // 取消按钮的回调函数
    cancel(){
      this.$emit('changeScene',{scene:0})  //切换场景
      // 清除数据
      Object.assign(this._data,this.$options.data())
      // Object.assign是es6中新增的方法，可以合并对象
      // 组件实例this._data可以操作data当中的响应式的数据
      // this.$options是当前组件的配置对象，其中有data函数,data数据一执行就返回响应式数据为空，再将其赋值给响应式数据就完成了数据的清除
    }
  },

  /* mounted() {
    console.log('发请求')
  }, */
};
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>