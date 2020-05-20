<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    <!-- 2. 搜索 -->
    <el-row>
      <el-col>
        <el-input placeholder="请输入内容" clearable v-model="query" @clear="loadUserList()" class="input-with-select">
          <el-button slot="append" @click="searchUser()" icon="el-icon-search"></el-button>
        </el-input>
        <el-button class="btn" @click="dialogFormVisible = true" type="success">增加用户</el-button>
        <!-- 对话框增加用户 -->
        <el-dialog title="增加用户" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="用户名" label-width="100px">
              <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="100px">
              <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px">
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px">
              <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="AddUser()">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
    <!-- 3. 表单 -->
      <el-table
      :data="userlist"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email" 
        label="邮箱"
        width="150">
      </el-table-column>
      <el-table-column
        prop="mobile" 
        label="电话"
        width="150">
      </el-table-column>
      <el-table-column
        label="创建日期">
        <!-- 如果单元格内显示的内容不是字符串（文本），
        需要给被显示的内容外层包裹一个template -->

        <!-- template内部要用数据设置slot-scope属性
        该属性的值是要用数据create_time的数据源userlist -->

        <!-- slot-scope的值userlist其实就是el-table绑定的数据userlist
        userlist.row -> 数组中的每个对象 -->

        <template slot-scope="userlist">
                         <!-- scope自动找的 -->
          {{userlist.row.create_time | fmtdate}}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template slot-scope="userlist">
          <el-switch
            @change="changeMgState(userlist.row)"
            v-model="userlist.row.mg_state" 
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            plain 
            type="primary" 
            icon="el-icon-edit" 
            circle
            @click="showEditUserMsgBox(scope.row)">
          </el-button>
          <!-- 编辑用户对话框 -->
          <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
            <el-form :model="form">
              <el-form-item label="用户名" label-width="100px">
                <el-input disabled v-model="form.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" label-width="100px">
                <el-input v-model="form.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="电话" label-width="100px">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
              <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
          </el-dialog>
          <el-button 
            size="mini" 
            plain 
            type="danger" 
            icon="el-icon-delete" 
            circle
            @click="showDeleteUserMsgBox(scope.row.id)">
          </el-button>
          <el-button size="mini"
            plain
            type="success" 
            icon="el-icon-check" 
            @click="showSetUserMgBox(scope.row)"
            circle>
            </el-button>
            <el-dialog title="分配角色" :visible.sync="dialogsetVisible">
              <el-form :model="form">
                <el-form-item label="用户名:" label-width="100px">
                  {{currUsername}}
                </el-form-item>
                <el-form-item label="角色" label-width="100px">
                  <!-- 
                    如果select的绑定的数据的值 和 option的value一样，
                    就会显示该option 的label的值
                   -->
                   {{currRloeId}}
                  <el-select v-model="currRloeId">
                    <el-option label="请选择" :value="-1"></el-option>
                    <el-option :label="item.roleName" :value="item.id" v-for="(item, i) in roles" :key="i"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogsetVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRole()">确 定</el-button>
              </div>
            </el-dialog>
        
        </template>
      </el-table-column>
    </el-table>
    <!-- 4. 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data(){
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userlist:[],
      total: -1,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,
      dialogsetVisible: false,
      form:{
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // currUserId: -1,
      // 分配角色
      currRloeId: -1,
      currUsername: '',
      currUserId: -1,
      // 保存所有角色数据
      roles: []

    }
  },
  created(){
    this.getUserList()
  },
  methods: {
    // 分配角色 - 发送请求
    async setRole(){
      // users/:id/role
      // :id 要修改的用户的id值
      // 请求体总rid修改的新值角色id
      const res = await this.$http.put(`users/${this.currUserId}/role`,{
        rid:this.currRloeId
      })
      console.log(res);
      
      this.dialogsetVisible = false
    },
    //分配角色 - 打开对话框
    async showSetUserMgBox(user){

      this.currUsername = user.username

      // 给currUserId赋值
      this.currUserId = user.id

      //获取所有角色
      const res1 =  await this.$http.get(`roles`)
      // console.log(res1);
      this.roles = res1.data.data
      

      // 获取当前用户的id ->  rid的值
      const res = await this.$http.get(`users/${user.id}`)
      // console.log(res);
      // 接口文档的key名 是role_id 其实是rid
      this.currRloeId = res.data.data.rid

      this.dialogsetVisible = true
    },
    //修改状态
    async changeMgState(user){
      //  users/:uId/state/:type
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      console.log(res);
      
    },
    //编辑用户提交
    async editUser(){
      
      const res = await this.$http.put(`users/${this.form.id}`,this.form)// eslint-disable-line no-unused-vars
      this.dialogFormVisibleEdit = false
      this.getUserList()
      
    },
    // 编辑用户
    showEditUserMsgBox(user){ //user === scope.row
      this.form = user
      this.dialogFormVisibleEdit = true
    },

    // 删除用户 - 打开消息盒子（config）
    showDeleteUserMsgBox(userId){
     this.$confirm('删除用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送删除请求 :id ---> 用户id
          const res = await this.$http.delete(`users/${userId}`)
          console.log(res);
          if (res.data.meta.status===200) {
            this.pagenum = 1
            this.getUserList()
            this.$message({
            type: 'success',
            message: res.data.meta.msg
          });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });           
        });
    },
    
    // 对话框增加用户 -> 发送请求
    async AddUser(){

      const res = await this.$http.post(`users`,this.form)
      // console.log(res);
      const { meta: { status, msg } } = res.data
      if (status === 201) {
        // 1.提示成功
        this.$message.success(msg)
        // 3.更新视图
        this.getUserList()
        // 4.清空文本框
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
        // 2.关闭对话框
        this.dialogFormVisible = false
        this.form = {}
    },
    //搜索用户
    searchUser(){
      // 按照input绑定的query参数发送请求
      this.getUserList()
    },
    //清除数据
    loadUserList(){
      this.getUserList()
    },
    //分页
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize = val
        // this.pagenum = 1
        this.getUserList()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pagenum = val
        this.getUserList()
      },
    // 获取用户列表的请求
    async getUserList(){
      // query 查询参数 可以为空
      // pagenum 当前页码 不能为空
      // pagesize 每页显示条数 不能为空
      
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log(res);
      const {meta: {status, msg}, data:{users, total} } = res.data
      if (status == 200) {
        // 1. 给表格数据赋值
        this.userlist = users
        // 2. 给total赋值
        this.total = total
        // 3. 提示
        this.$message.success(msg)

        this.pagenum = 1
      } else {
        this.$message.warning(msg)
      }
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