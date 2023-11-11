<template>
  <div>
    <!-- 表格table -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>

      <el-table-column prop="skuName" label="名称" width="width" align="center">
      </el-table-column>

      <el-table-column prop="skuDesc" label="描述" width="width" align="center">
      </el-table-column>

      <el-table-column
        prop="prop"
        label="默认图片"
        width="130px"
        align="center"
      >
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量" width="80px" align="center">
      </el-table-column>

      <el-table-column prop="weight" label="价格" width="80px" align="center">
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-top"
            v-if="row.isSale == 0"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-bottom"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="$message.info('正在开发中')"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteSku(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 
      -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      style="text-align: center"
    >
    </el-pagination>

    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称:</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述:</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格:</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性:</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              style="margin-right: 20px"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="550px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //代表当前第几页
      limit: 10, //代表这一页有多少个数据
      records: [], //存储sku列表的数据
      total: 0, //存储分页器一共展示的数据
      skuInfo: {}, //存储sku信息
      drawer: false, //控制抽屉效果的显示与隐藏
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList() {
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 分页器页码点击按钮
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },
    // 每一页展示数量变化的按钮
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 商品上架按钮回调
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code === 200) {
        row.isSale = 1;
        this.$message.success("上架成功");
      } else {
        this.$message.error("上架失败");
      }
    },
    // 商品下架按钮回调
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code === 200) {
        row.isSale = 0;
        this.$message.success("下架成功");
      } else {
        this.$message.error("上架失败");
      }
    },
    // 获取SKu详情
    async getSkuInfo(row) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code === 200) {
        this.skuInfo = result.data;
      }
    },
    // 删除Sku
    async deleteSku(row){
      let result = await this.$API.sku.reqDeleteSku(row.id)
      if(result.code===200){
        this.$message.success('删除成功')
        this.getSkuList(this.limit>1?this.page:this.page-1);
      }else{
        this.$message.error('删除失败')
      }
    }
  },
};
</script>

<style>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px;
}
 .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>