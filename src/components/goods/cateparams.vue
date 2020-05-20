<template>
  <el-card>
    <!-- 1. 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 2.提示 -->
    <el-row>
      <el-alert center class="el-alert" title="只允许为第三级分类设置参数" type="error"></el-alert>
    </el-row>
    <!-- 3.级联选择器 -->
    <el-form class="el-form">
      <el-form-item label="商品名称" prop="attr_name">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          v-model="selectOptions"
          :props="cateProps"
          @change="handleChange"
          :show-all-levels="false"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 4.tab切换 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <!-- 按钮 -->
        <el-button type="danger">设置动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="arrDyparams" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                :key="index"
                v-for="(tag, index) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(index, scope.row)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="#" type="index" width="60"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                @click="showEditRoleMsgBox(scope.row.id)"
                circle
              ></el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                @click="removeById(scope.row.id)"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <!-- 按钮 -->
        <el-button type="danger">设置静态参数</el-button>
        <!-- 表格 -->
        <el-table :data="arrOnlyparams" style="width: 100%">
          <el-table-column label="#" type="index" width="60"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="属性值" prop="attr_vals"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                @click="showEditRoleMsgBox(scope.row.id)"
                circle
              ></el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                @click="removeById(scope.row.id)"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 5.表单 -->
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      //
      // 级联选择器
      options: [],
      selectOptions: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },

      // 动态参数
      arrDyparams: [],
      activeName: "1",
      // catelist: [],
      inputValue: "",
      inputVisible: false,

      // 静态参数
      arrOnlyparams: []
    };
  },
  created() {
    this.getcateparams();
  },
  methods: {
    // 回车或者失去焦点
    handleInputConfirm(row) {
      let inputValue = this.inputValue;
      if (inputValue) {
        row.attr_vals.push(inputValue);
        this.saveAttrVals(row);
      }
      this.inputValue = "";
      this.inputVisible = false;
    },
    // 点击new tag+按钮
    showInput() {
      this.inputVisible = true;
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 点击x按钮关闭 删除
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
    // tab切换点击
    async handleClick() {
      if (this.activeName === "2") {
        if (this.selectOptions.length === 3) {
          // 获取静态参数
          const res = await this.$http.get(
            `categories/${this.selectOptions[2]}/attributes?sel=only`
          );
          this.arrOnlyparams = res.data.data;
        }
      }
    },
    // 提交参数 -> 发送请求
    async saveAttrVals(row) {
      // categories/:id/attributes/:attrId
      // 分类 ID	不能为空携带在url中
      // attr_name	参数名称	不能为空
      // attr_sel	[only,many]	不能为空
      // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔
      let putDate = {
        attr_name: row.attr_name,
        attr_sel: "many",
        attr_vals: row.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectOptions[2]}/attributes/${row.attr_id}`,
        putDate
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败！");
      }
      this.$message.success("修改参数项成功！");
    },
    // 选择当前分类的三级ID
    // categories/:id/attributes
    async getcateparams() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
      // console.log(res);
    },

    getCateId() {
      if (this.selectOptions.length === 3) {
        return this.selectOptions[2];
      }
      return null;
    },
    async handleChange() {
      if (this.selectOptions.length === 3) {
        // 获取动态参数
        const res = await this.$http.get(
          `categories/${this.selectOptions[2]}/attributes?sel=many`
        );
        // console.log(res);
        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach(item => {
          // arr_vals字符串转成数组
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
        // console.log(this.arrDyparams);
      }
    }
  }
};
</script>

<style scoped>
.el-alert {
  margin-top: 20px;
}

.el-form {
  margin-top: 20px;
}

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
    // 只能选择三级分类
    // 通过数组判断长度
    // if (this.selectOptions.length !== '3') {
    //   this.selectOptions = []
    //   return
    // }