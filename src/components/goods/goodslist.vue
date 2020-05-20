<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 2. 搜索 -->
    <el-row>
      <el-col :span="24">
        <el-input
          placeholder="请输入内容"
          clearable
          v-model="query"
          @clear="loadUserList()"
          class="input-with-select"
        >
          <el-button @click="handleSearch()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button class="btn" @click="$router.push({name: 'goodsadd'})" type="success" plain>增加商品</el-button>
      </el-col>
    </el-row>
    <!-- 3. 表单 -->
    <el-table class="table_column" :data="list" style="width: 100%" border stripe height="450px">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量" width="80"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">{{scope.row.add_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditgoodsMsgBox(scope.row)"
          ></el-button>

          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeletegoodsMsgBox(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="editGoodsForm" ref="editGoodsFormRef" :rules="editGoodsFormRules">
        <el-form-item label="商品名称" label-width="100px" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" label-width="100px" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" label-width="100px" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" label-width="100px" prop="goods_number">
          <el-input v-model="editGoodsForm.goods_number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 4. 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="6"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 6,
      list: [],
      total: -1,
      // 编辑商品
      editGoodsForm: {},
      // 校验
      editGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格(元)", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
         goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      },

      dialogFormVisibleEdit: false
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 提交编辑商品 -> 发送提交数据
    async editGoods() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return;
        const res = await this.$http.put(
          `goods/` + this.editGoodsForm.goods_id,
          {
            goods_name: this.editGoodsForm.goods_name,
            goods_price: this.editGoodsForm.goods_price,
            goods_weight: this.editGoodsForm.goods_weight,
            goods_number: this.editGoodsForm.goods_number
          }
        );
        console.log(res);
        // if (res.meta.status !== 200) {
        //   return this.$message.error('更新商品信息失败！')
        // }

        //关闭对话框
        this.dialogFormVisibleEdit = false;
        this.$message.success("更新商品信息成功！");

        // 更新视图
        this.getGoodsList();
      });
    },
    // 编辑商品
    showEditgoodsMsgBox(goods) {
      this.editGoodsForm = goods;
      this.dialogFormVisibleEdit = true;
    },
    // 删除商品
    showDeletegoodsMsgBox(id) {
      this.$confirm("删除商品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除请求 :id ---> 商品id
          const res = await this.$http.delete(`goods/${id}`);
          console.log(res);
          if (res.data.meta.status === 200) {
            this.pagenum = 1;
            this.getGoodsList();
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //搜索用户
    handleSearch() {
      // 按照input绑定的query参数发送请求
      this.getGoodsList();
    },
    //清除数据
    loadUserList() {
      this.getGoodsList();
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      // this.pagenum = 1
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getGoodsList();
    },
    // 获取用户列表的请求
    async getGoodsList() {
      // query 查询参数 可以为空
      // pagenum 当前页码 不能为空
      // pagesize 每页显示条数 不能为空

      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res);
      const {
        meta: { status, msg },
        data: { goods, total }
      } = res.data;
      if (status == 200) {
        // 1. 给表格数据赋值
        this.list = goods;
        // 2. 给total赋值
        this.total = total;
        // 3. 提示
        this.$message.success(msg);

        this.pagenum = 1;
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style scoped>
.input-with-select {
  margin-top: 20px;
  width: 45%;
}

.btn {
  margin-left: 15px;
}

.table_column {
  margin-top: 20px;
}
</style>

// 删除商品
//      async removeById (id) {
//       const confirmResult = await this.$confirm(
//         '此操作将永久删除该商品, 是否继续?',
//         '提示',
//         {
//           confirmButtonText: '确定',
//           cancelButtonText: '取消',
//           type: 'warning'
//         }
//       ).catch(err => err)
//       if (confirmResult !== 'confirm') {
//         return this.$message.info('已取消删除！')
//       }
//       const { data: res } = await this.$http.delete('goods/' + id)
//       console.log(res);
      
//       if (res.meta.status !== 200) {
//         return this.$message.error('删除商品失败！')
//       }
//       this.$message.success('删除商品成功！')
//       this.getGoodsList()
//     },
