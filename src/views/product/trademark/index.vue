<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px"
      @click="showDialog"
      >添加</el-button
    >

    <!-- 表格组件 -->
    <!-- data是表格组件将来需要展示的数据  数据一定是数组类型的 -->
    <!-- border是给表格添加边框 -->
    <!-- 注意1  elementUI当中的table组件展示的数据是以一列一列的进行展示数据 -->
    <el-table style="width: 100%" :border="true" :data="list">
      <!-- label是显示的标题  -->
      <!-- width是对应列的宽度 -->
      <!-- align是文字的对齐方式 -->
      <!-- tpye='index' 可以展示这一列的序号-->
      <!-- prop对应列内容的字段名 -->
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌logo"
        width="width"
        align="center"
      >
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updataTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deletTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- 分页器四大因素：当前页数，数据的总条数，每一页展示的条数，连续的页码数 -->
    <!-- current-page:代表的是当前第几页
      total：代表分页器一共需要展示数据的条数
      page-size：代表每一页需要展示多少数据
      page-sizes：可以设置每一页展示多少数据
      layout：可以实现分页器的布局
      pager-count：代表按钮的数量  如果 pager-count是9  那么连续的页码数是7 
      @size-change: 代表的是page-size发生变化的时候会触发这个回调函数
      @current-change: 代表的是current-page发生变化的时候会触发这个回调函数
   -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      style="margin-top: 20px; text-align: center"
      :pager-count="7"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <!-- 对话框
        :visible.sync控制对话框显示与隐藏用的
        title控制对话框上面的字样
        center属性代表让顶部和底部样式居中
     -->

    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
      width="40%"
      :center="true"
    >
      <!-- form表单 -->
      <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleform">
        <!-- 上面form表单中:model是将表单中的数据收集到tmForm对象中,将来表单验证也需要这个属性 -->

        <!-- 输入框form -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>

        <!-- 图片上传框form 
            
         -->
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <!-- 注意这里收集数据不能使用v-model,因为不是表单元素 
              action属性:设置图片上传的地址
              :on-success可以监测到图片是否上传成功,当图片上传成功就会执行一次
              :before-upload可以在上传图片之前执行一次
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1, //代表分页器第几页
      limit: 3, //当前页数展示数据条数
      total: 0, //总共数据的条数
      list: [], //列表展示的数据
      dialogFormVisible: false, //对话框显示与隐藏的属性
      imageUrl: "", // 上传图片使用的属性
      tmForm: {
        tmName: "",
        logoUrl: "",
      }, //收集品牌的信息:对象身上的属性不能乱写,需要看接口文档

      // 表单验证的规则，是个对象
      rules: {
        // 品牌名称的验证
        tmName: [
          // required ： 需要验证的字段（true的话就代表这个字段需要验证，表单标签的前面就会有一个*）
          // message ： 是提示信息   trigger ： 是用户行为的设置（事件的设置，blur，change）
          // min  max ：代表品牌名称的长度 2-10
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        // 品牌logo的验证
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    // 组件挂载完毕就要发送请求 获取列表数据的方法
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList() {
      // 接口需要带两个参数
      const { page, limit } = this;
      // 向服务器发请求的时候，函数需要带参数因此在data中初始化两个字段，代表给服务器传递的参数
      let result = await this.$API.trademark.reqTrademark(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },

    // 点击分页器按钮重新发送请求
    handleCurrentChange(pagger) {
      this.page = pagger;
      this.getPageList(this.page, this.limit);
    },

    // 当page-size发生改变的时候会触发  点击时会返回一个选中的数字
    handleSizeChange(size) {
      this.limit = size;
      this.getPageList(this.page, this.limit);
    },

    // 点击添加品牌的按钮  显示遮罩层
    showDialog() {
      // 每一次显示对话框的时候就要清除一次数据
      this.tmForm = { tmName: "", logoUrl: "" };
      this.dialogFormVisible = true;
    },

    // 点击修改品牌按钮
    async updataTradeMark(row) {
      // row就是当前用户选中的品牌的信息
      this.tmForm = { ...row }; //将数据浅拷贝给tmForm  就让tmForm接受的不是服务器返回的那个对象
      // 将已有的品牌的信息赋值给tmForm进行展示   注意是将服务器返回的信息直接赋值给了tmForm  会出现问题 也就是说tmForm存储的即为服务器返回的品牌信息
      this.dialogFormVisible = true;
    },

    // 下面两个函数时上传图片相关的回调
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res是上传成功后服务器返回给前端的数据
      // file是上传成功之后,服务器返回给前端的数组
      // 收集品牌图片数据,因为将来需要带给服务器
      this.tmForm.logoUrl = res.data;
    },

    // 图片上传之前  就是在判断上传的图片是否是jpg格式
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 添加按钮(添加品牌或者修改品牌)
    async addOrUpdateTradeMark() {
      // 当全部验证的字段通过，再去书写业务逻辑
      this.$refs.ruleform.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          // 发请求(添加品牌或者修改品牌)
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出信息可能是添加成功或者修改成功两种情况
            this.$message.success(this.tmForm.id ? "修改成功" : "添加成功");
            // 添加或者修改成功之后需要再次获取请求列表
            // 如果是添加品牌 没问题  停留在第一页  修改品牌就是留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          this.$message.error("失败");
          return false;
        }
      });
    },

    // 删除品牌的操作

    deletTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //用户点击确定按钮的时候会触发
          // 向服务器发请求
          let result = await this.$API.trademark.reqDeletTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获取请求列表数据  这里需要做一个判断  如果这一页的品牌数量大于1就停留在这一页，如果小于1就去上一页
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          // 用户点击取消按钮的时候触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>