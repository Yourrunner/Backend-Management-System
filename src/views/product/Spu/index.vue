<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 三级联动已经是全局组件了，可以直接使用 -->
      <CategorySelect @getCategotyId="getCategotyId" :Show="scene !== 0" />
    </el-card>

    <el-card>
      <!-- 底部这里将来是有三部分切换的 -->
      <div v-show="scene === 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu(1)"
          >添加SPU</el-button
        >

        <el-table style="width: 100%" border :data="records">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80px"
          >
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <!-- 这里的按钮将来需要二次封装 -->
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="addSku(row)"
              />
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="updateSpu(row)"
              />
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前SKU的全部SPU"
                @click="handler(row)"
              />
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 
           -->
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, total, sizes"
          :total="total"
        >
        </el-pagination>
      </div>

      <SpuForm v-show="scene === 1" @changeScene="changeScene" ref="Spu" />

      <SkuForm v-show="scene === 2" ref="sku" @changeScene="changeScene" />
      
    </el-card>

    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- 用table展示列表数据即可 -->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>

        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>

        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>

        <el-table-column  label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, //代表分页器当前第几页
      limit: 3, //代表每一页需要展示多少数据
      records: [], //存储spu列表的数据
      total: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示SPU列表数据  1代表添加SPU|修改SPU  2代表添加SKU
      dialogTableVisible:false,  //控制对话框的显示与隐藏
      spu:{},   
      skuList:[],  //存储的sku列表的数据
      loading:true ,  //给table表格添加加载效果
    };
  },
  methods: {
    getCategotyId({ categoryId, level }) {
      // 三级联动的自定义事件，可以把子组件的相应的id传递给父组件
      // categoryId可以获取到三级分类的id  level是为了区分是几级id
      if (level === 1) {
        this.category1Id = categoryId;
        // 清除二三级的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 获取spu列表进行展示
        this.getSpuList();
      }
    },

    // 获取spu列表数据的方法
    async getSpuList() {
      // 需要携带三个参数，page，limit，每一页展示多少条数据，三级分类的id
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },

    // 点击分页器的第几页按钮的回调
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },

    // 当分页器的某一页展示数据的条数发生变化的时候触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },

    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      //通知子组件spuForm发请求，发两个
      this.$refs.Spu.addSpuData(this.category3Id);
    },

    // 修改某一个Spu按钮回调
    updateSpu(row) {
      this.scene = 1;
      // 获取spuForm子组件
      // 再父组件中可以通过$ref获取子组件或者用children获取子组件身上的方法
      this.$refs.Spu.initSpuData(row);
    },

    // SpuForm自定义事件的回调
    changeScene({ scene, flag }) {
      this.scene = scene;
      //子组件通知父组件修改场景，但是修改完数据别忘了再次重新获取数据
      // flag是为了区分这个按钮是保存还是修改
      if (flag === 1) {
        this.getSpuList(this.page);
      } else {
        this.getSpuList(1);
      }
    },

    // 删除spu的按钮回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code === 200) {
        this.$message.success("删除成功");
        let jumpToPage = this.records.length > 1 ? this.page : this.page - 1;
        this.getSpuList(jumpToPage);
      }
    },

    // 添加Sku按钮的回调
    addSku(row) {
      // 切换场景为2
      this.scene = 2;
      // 调用子组件的方法发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },

    // 查看sku的按钮的回调
    async handler(row){
      this.dialogTableVisible = true
      this.spu = row
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(row.id)
      if(result.code === 200){
        this.loading = false
        this.skuList = result.data
      }
    },

    // 关闭dialog的回调
    close(done){
      this.loading = true
      // 清除sku列表的数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  },
};
</script>

<style>
</style>