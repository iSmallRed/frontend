<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2. 搜索 -->
    <el-row>
      <el-col>
        <el-input placeholder="请输入内容"  v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button class="btn" type="success">增加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3. 表单 -->
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
         
        label="邮箱"
        width="150">
      </el-table-column>
      <el-table-column
         
        label="电话"
        width="150">
      </el-table-column>
      <el-table-column
         
        label="创建日期">
      </el-table-column>
      <el-table-column
         
        label="用户状态">
      </el-table-column>
      <el-table-column
        label="操作">
      </el-table-column>
    </el-table>
    <!-- 4. 分页 -->
  </el-card>
</template>

<script>
export default {
  data(){
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      tableData:[{}]
    }
  },
  created(){
    this.getUserList()
  },
  methods: {
    // 获取用户列表的请求
    async getUserList(){
      // query 查询参数 可以为空
      // pagenum 当前页码 不能为空
      // pagesize 每页显示条数 不能为空
      
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res);
      
    }
  }
}
</script>

<style scoped>

  .input-with-select{
    margin-top: 20px;
    width: 45%;
  }

  .btn{
    margin-left: 15px;
  }

</style>