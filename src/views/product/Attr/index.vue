<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategotyId="getCategotyId" :Show='!isShowTable'/>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格  展示平台属性 -->
        <el-table :border="true" style="width: 100%" :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin-right: 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="250px">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="editAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowTable">
        <!-- 添加属性和修改属性的结构 -->

        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button>取消</el-button>

        <el-table :border="true" style="width: 100%; margin: 20px 0px" :data="attrInfo.attrValueList">

          <el-table-column align="center" type="index" label="序号" width="80px">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要用到span和input进行来回的切换， -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.isShowInput"
                @blur="toLook(row)"
                @keydown.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>

        </el-table>

        <el-button type="primary" @click="addOrUpdateAddr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
// import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      isShowInput: true,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [], //接收平台属性的字段
      isShowTable: true, //这个属性控制table的显示与隐藏的
      // 收集新增属性||将来修改属性用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，可以有多个所以用数组  每一个属性值都是一个对象，需要两个字段attrId 和 valueName
          /* {
            attrId: 0,
            valueName: "",
          }, */
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 0, //服务器也需要区分几级id
      },
    };
  },

  methods: {

    getCategotyId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 代表三级分类的id有了  就可以拿着这些id去发送请求，获取平台的属性
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },

    async getAttrList() {
      // 获取平台属性的数据
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },

    // 添加属性值的回调
    addAttrValue() {
      // 向属性值数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础上新增新的属性值(新增属性值的时候需要携带已有属性的id)
        valueName: "", //相应的属性值的名称
        isShowInput: true,
        //这个isShowInput用于切换查看模式与编辑模式，这样的好处是每一个属性值可以控制自己的模式切换 当前的这个isShowInput是一个响应式数据（数据变化试图变化）
      });
      // 点击添加时增加光标聚焦效果
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },

    // 添加属性按钮的回调  点击添加属性按钮的时候应该要将属性清除一次才行  解决数据回显问题
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，可以有多个所以用数组  每一个属性值都是一个对象，需要两个字段attrId 和 valueName
          /* {
            attrId: 0,
            valueName: "",
          }, */
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 0, //服务器也需要区分几级id
      };
    },

    // 添加编辑属性按钮的功能
    editAttr(row) {
      // 注意这里应该用到深拷贝  由于数据是双向绑定的  所以不能直接修改原来的数据
      // 数据存在对象里面套数组，数组里面套对象  ，所以必须使用深拷贝
      this.attrInfo = JSON.parse(JSON.stringify(row));
      this.isShowTable = false;
      this.attrInfo.attrValueList.forEach((item) => {
        // 这样书写也可以给属性值添加字段  但是会发现视图不会跟着变化  因为isshowInput不是响应式数据
        // vue.set 向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。
        // 它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property
        // item.isShowInput = false  //这样修改的书写不是响应式属性
        this.$set(item, "isShowInput", false); //这样添加的属性就是响应式的了  第一个参数是哪个对象，第二个参数是要添加的新的响应式属性，第三个参数是新的属性的属性值
      });
    },

    // input框blur事件回调
    toLook(row) {
      // row是当前用户添加的最新的属性值
      // 如果属性值为空，不能作为新的属性值，需要给用户提示，让他输入其它属性值
      if (row.valueName.trim() === "") {
        this.$message.warning("属性值格式不正确，请重新输入");
        return;
      }
      // 新增的属性值不能与已有的属性值重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 需要将row从判断的时候去除
        // row是新增的属性值【数组的最后一项元素】
        // 判断的时候需要从已有的数组中新增的内容去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message.error("请不要输入重复属性值");
        return;
      }
      row.isShowInput = false; //这行代码是让当前的编辑模式变为查看模式，即让input消失，显示span
    },

    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.isShowInput = true;
      // 获取input节点，实现自动聚焦
      // 需要注意点击span的时候切换为input变为编辑模式，但是队友浏览器而言页面的重绘与重排是需要耗费时间的
      // 所以点击span的时候，重绘重排一个input是需要耗费时间的，所以不可能一点击就能获取到
      // 这里就用$nextTick,当节点渲染完毕后会执行一次，可以保证input框已经存在
      this.$nextTick(() => {
        // 获取相应的表单元素实现聚焦
        this.$refs[index].focus();
      });
    },

    // 气泡确认框的确认按钮的回调
    deleteAttrValue(index){
      // 注意最新版本的elementUi是2.15.13，而模板中的版本号是2.13.2 要注意  当前删除属性值的操作不需要发请求
      this.attrInfo.attrValueList.splice(index,1)
    },
    
    // 保存按钮  进行添加属性或者修改属性的操作
    async addOrUpdateAddr(){
      // 第一件事：整理参数 1.如果用户添加了空的属性值，那么不能提交给服务器   2.提交给服务器的数据当中不应该出现flag字段
      this.attrInfo.attrValueList =  this.attrInfo.attrValueList.filter(item=>{
        // 过滤掉属性值不为空的
        if(item.valueName !== ''){
          // 删除掉flag属性
          delete item.isShowInput;
          return true
        }
      })
      // 过滤完成要发请求
      try {
        console.log(this.attrInfo)
        // 如果成功
        await this.$API.attr.reqAddAttrorUpdateAttr(this.attrInfo)
        this.$message.success('保存成功')
        // 保存成功需要再次获取平台属性进行展示
        this.getAttrList()
        // 保存成功后要展示平台属性列表
        this.isShowTable = true
      } catch (error) {
        this.$message.warning('系统数据不能更改')
      }
    },
    // 删除Attr属性
    async deleteAttr(row){
      let reslut = await this.$API.attr.reqDeleteAttr(row.id)
      if(reslut.code === 200){
        this.getAttrList()
      }
    }
  },
};
</script>

<style>
</style>