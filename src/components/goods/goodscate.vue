<template>
  <el-card>
    <!-- 1. 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 2.按钮 -->
    <el-button class="btn" @click="showAddCate()" type="success">添加分类</el-button>
    <!-- 对话框 -->

    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form :model="cateform">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="cateform.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" :label-width="formLabelWidth">
          <el-cascader
            v-model="selectedKeys"
            :options="options"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="showparams()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="editcateform">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="editcateform.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editcate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 3.表格 -->
    <el-table :data="catedata" style="width: 100%">
      <!-- <el-table-column label="分类名称" prop="cat_name"></el-table-column> -->
      <!-- 
        treeKey -> nodekey ->节点的唯一标识
        parentKey -> 父节点的id
        levelKey ->当前节点的标识
        childKey -> 子节点
      -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-if="scope.row.cat_level === 1">二级</span>
          <span v-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-if="scope.row.cat_deleted === true">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            @click="showEditRoleMsgBox(scope.row.cat_id)"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            @click="removeById(scope.row.cat_id)"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
// 引入element-tree-grid
var ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      // 商品数据
      catedata: [],

      queryInfo: {
        type: 3
        // pagenum: 1,
        // pagesize: 5
      },
      total: 0,
      // 对话框
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,

      formLabelWidth: "120px",

      // 商品添加分类数据

      cateform: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      },

      // 编辑商品数据
      editcateform: ""
      ,

      // 指定级联选择器的配置对象
      cascaderProps: {
        // 配置触发选项 hover/click
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },

      // 分类数据联级选择器

      selectedKeys: [],

      options: []
    };
  },
  created() {
    this.cateparams();
  },
  methods: {
    // 获取商品分类数据
    async cateparams() {
      const res = await this.$http.get(`categories`, {
        params: this.queryInfo
      });
      // console.log(res);
      this.catedata = res.data.data;
      // this.total = res.data.total
    },
    // 获取父类信息添加分类
    showAddCate() {
      this.addgoodscate();
      this.dialogFormVisible = true;
    },
    // 添加分类 -> 发送请求
    async showparams() {
      const res = await this.$http.post(`categories`, this.cateform);
      // console.log(res);
      // if (res.data.meta.status !== 201) {
      //   return  this.$message.error('添加分类失败')
      // }
      //   this.$message.success('添加分类成功');
      const {
        meta: { msg, status }
      } = res.data;

      if (status === 201) {
        // 1.提示成功
        this.$message.success(msg);
        // 2.更新视图
        this.cateparams();
        // 3.清空文本
        this.cateform = {};
      } else {
        this.$message.error(msg);
      }
      // 4.关闭对话框
      this.dialogFormVisible = false;
    },
    async addgoodscate() {
      // 获取商品二级分类
      const { data: res } = await this.$http.get(`categories?type=2`);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败！");
      }
      this.options = res.data;
      this.dialogFormVisible = true;
    },
    handleChange() {
      // 如何selectKeys 数组的长度>0 说明选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.cateform.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        // 当前分类的等级
        this.cateform.cat_level = this.selectedKeys.length;
        return 0;
      } else {
        // 父级分类的Id
        this.cateform.cat_pid = 0;
        // 当前分类的等级
        this.cateform.cat_level = 0;
      }
    },
    // 显示编辑分类对话框
    async showEditRoleMsgBox(id) {
      const res = await this.$http.get(`categories/${id}`);
      // console.log(res);
      // if (res.meta.status !== 200) {
      //   return this.$message.error('查询失败');
      // }
      this.editcateform = res.data;
      this.dialogFormVisibleEdit = true;
    },
    // 编辑分类
    async editcate() {
      const { data: res } = await this.$http.put(
        `categories/` + this.editcateform.cat_id,
        {
          cat_name: this.editcateform.cat_name
        }
      );
      // const res = await this.$http.put(`categories/${this.editcateform.cat_id}`, this.editcateform)
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("更新分类名失败！");
      this.$message.success("更新分类名成功！");
      this.cateparams();
      this.dialogFormVisibleEdit = false;
    },
    // 删除分类
    async removeById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('已取消删除！') }
      const res = await this.$http.delete(`categories/${id}`)
      console.log(res);
      this.cateparams()
    }
  }
};
</script>

<style scoped>
.btn {
  margin-top: 20px;
}
</style>