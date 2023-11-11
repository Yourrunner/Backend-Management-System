<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{spu.spuName}} </el-form-item>
    
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>

      <el-form-item label="重量(kg)">
        <el-input placeholder="重量(kg)" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table border style="width: 100%" :data="spuImageList"  @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            prop="prop"
            width="80px"
          >
          </el-table-column>

          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width:100px;width:100px">
            </template>
          </el-table-column>

          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault===0" type="primary" size="mini" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else size="mini" type="success">默 认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spuImageList: [], //存储图片的信息
      spuSaleAttrList: [], //存储销售属性
      attrInfoList: [], //存储平台属性的数据
      // 收集sku数据的字段
      skuInfo: {
        // 收集父组件给的数据
        // 第一类收集的数据是父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类数据需要双向绑定v-model来收集的
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 第三类收集数据是需要自己写代码的
        // 默认图片
        skuDefaultImg: "",
        // 平台属性
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          },
        ],
        // 收集图片的字段
        skuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          }, */
        ],
        // 销售属性
        skuSaleAttrValueList: [
         /*  {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0,
          }, */
        ],
      },
      spu:{},  //父组件给传递的数据
      // 收集图片的数据的字段  但是需要注意  收集的数据缺少isDefault字段
      imageList:[]  
    };
  },
  methods: {
    // 获取sku数据
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片的数据
      let result = await this.$API.spu.reqSpuImageListSku(spu.id);
      if (result.code === 200) {
        let list = result.data
        list.forEach(item => {
          item.isDefault = 0
          // 0代表不是默认图片，1代表是默认图片
        });
        this.spuImageList = list;
      }
      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台属性的数据
      let result3 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result3.code === 200) {
        this.attrInfoList = result3.data;
      }
    },
    // 是table表格复选框按钮的事件
    handleSelectionChange(params){
      // 这里可以获取到用户选中图片信息的数据，但是当前收集到的数据中缺少isDefault字段
      this.imageList = params
    },
    // 选择默认图片  排他操作
    changeDefault(row){
      // 图片列表数据的isDefault字段变为0，其余变为1
      this.spuImageList.forEach(item=>{
        item.isDefault = 0
      })
      // 点击的图片的变为1
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消添加Sku按钮
    cancel(){
      this.$emit('changeScene',{scene:0})
      Object.assign(this._data,this.$options.data())
    },
    // 保存按钮的事件
    async save(){
      // 整理参数
      // 整理平台属性  在attrInfoList里面
      const {attrInfoList,spuSaleAttrList,imageList} = this
      /* let arr = []
      attrInfoList.forEach(item=>{
        // 当前平台属性用户进行了选择
        if(item.attrIdAndValueId){
          // 将字符串切割为数组
          const [attrId,valueId] = item.attrIdAndValueId.split(':')
          // 携带给服务器的参数应该是一个对象
          let obj = {attrId,valueId}
          arr.push(obj)
        }
      })
      this.skuInfo.skuAttrValueList = arr
      console.log(this.skuInfo.skuAttrValueList) */

      // reduce 高级用法
      this.skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(':')
          prev.push({attrId,valueId})
        }
        return prev
      },[])

      // 整理销售属性
      this.skuInfo.skuSaleAttrValueList=spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])

      // 整理图片的数据
      this.skuInfo.skuImageList = imageList.map(item=>{
        return {
          imgName:item.imgName,
          imgurl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
      
      // 发请求提交数据
      let result =  await this.$API.spu.reqAddSku(this.skuInfo)
      if(result.code===200){
        this.$message.success('保存成功')
        this.$emit('changeScene',{scene:0})
      }
    }
  },   
};
</script>

<style>
</style>