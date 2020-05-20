<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 按钮 -->
    <el-row class="addrolebtn">
      <el-col>
        <el-button type="success" @click="dialogFormVisibleAdd = true">添加角色</el-button>
        <!-- 对话框增加角色 -->
        <el-dialog title="增加角色" :visible.sync="dialogFormVisibleAdd">
          <el-form :model="addRoleForm">
            <el-form-item label="角色名称" label-width="100px">
              <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" label-width="100px">
              <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="AddRole()">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
    <!-- 展开栏表格 -->
    <el-table :data="rolelist" style="width: 100%">
      <el-table-column type="expand" width="150">
        <template slot-scope="props">
          <el-row v-for="(item, index) in props.row.children" :key="index">
            <el-col :span="4">
              <!-- 转角色id 和 权限id -->
              <el-tag @close="deleRight(props.row, item.id)" closable>{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item1, index) in props.row.children" :key="index">
                <el-col :span="4">
                  <el-tag
                    @close="deleRight(props.row, item1.id)"
                    type="success"
                    closable
                  >{{item1.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRight(props.row, item2.id)"
                    closable
                    type="warning"
                    v-for="(item2, index) in props.row.children"
                    :key="index"
                  >{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限的提示 -->
          <span v-if="props.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>
      <!-- 标签栏 -->
      <el-table-column label="#" width="60" type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
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
          <el-button
            @click="showSetRightDia(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改权限" :visible.sync="dialogFormVisible">
      <!-- 树形结构 
      data->数据源[]
      show-checkbox -> 选择框
      node-key 每个节点的唯一标识 通常时data数据源中key名id
      default-expanded-keys 默认展开[要展开的节点的id]
      default-checkbox-keys [要选择的节点的id]
      props 配置项{label,children}
      label 节点的文字标题和children节点的子节点

      值都来源于data绑定的数据源中的改数据的key名'label'和'children'-->
      <!-- 
        :default-expanded-keys="arrexpand"
        :default-checked-keys="[5]" 
      -->
      <el-tree
        ref="tree"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrcheck"
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="editRoleForm" ref="editRoleFormRef" :rules="editRoleFormRules">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="editRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleAdd: false,
      // 添加角色
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 树形结构的数据
      defaultProps: {
        label: "authName",
        children: "children"
      },
      treelist: [],
      arrexpand: [],
      arrcheck: [],
      currRoleId: -1,
      editRoleForm: {
        id: "",
        roleName: "",
        roleDesc: ""
      },
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getRolelist();
  },
  methods: {
    // 添加角色 -> 发送请求
    async AddRole() {
      const res = await this.$http.post(`roles`, this.addRoleForm);
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 1.提示成功
        this.$message.success(msg);
        // 2.更新视图
        this.getRolelist();
        // 3.清空文本
        this.addRoleForm = {};
      } else {
        this.$message.error(msg);
      }
      // 4.关闭对话框
      this.dialogFormVisibleAdd = false;
    },
    //  编辑角色权限对话框
    async editRoles() {
      // put roles/:id
      this.$refs.editRoleFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/` + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新角色信息失败！");
        }
        // 隐藏编辑角色对话框
        this.dialogFormVisibleEdit = false;
        this.$message.success("更新角色信息成功！");
        this.getRolelist();
      });
      // const res = await this.$http.put(`roles/${this.editRoleForm.id}`,this.editRoleForm)
      // console.log(res);
      // this.dialogFormVisibleEdit = false
      // this.getRolelist()
    },
    // 编辑角色权限
    async showEditRoleMsgBox(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色失败");
      }
      // const { data: res } = await this.$http.get('roles/' + id)
      // if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')

      this.editRoleForm = res.data;
      this.dialogFormVisibleEdit = true;
    },
    // 删除权限
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete(`roles/${id}`);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      this.$message.success("删除权限成功！");
      this.getRolelist();
    },
    // 修改权限 - 发送请求
    async setRoleRight() {
      // roles:/roleId/rights
      // roleId 当前要修改权限的角色id
      // rids树形节点中所有全选和半选的label的id []

      // 获取全选的id的数组arr1 getCheckedKeys()

      let arr1 = this.$refs.tree.getCheckedKeys();

      // 获取半选的id的数据arr2 getHalfCheckedKeys()

      let arr2 = this.$refs.tree.getHalfCheckedKeys();

      // arr = arr1 + arr2

      // arr1.concat(arr2)
      let arr = [...arr1, ...arr2];

      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      // if (res.meta.status !== 200) {
      //    return this.$message.error('分配权限失败！')
      // }
      // this.$message.success('分配权限成功!')
      // 更新视图
      console.log(res);

      this.getRolelist();

      // 关闭对话框
      this.dialogFormVisible = false;
    },
    // 修改/分配 -打开对话框
    async showSetRightDia(role) {
      this.currRoleId = role.id;

      this.dialogFormVisible = true;
      console.log(role);
      // 获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      this.treelist = res.data.data;

      // 获取当前角色role的权限id
      let arrtemp2 = [];
      role.children.forEach(item1 => {
        // arrtemp2.push(item1.id)
        item1.children.forEach(item2 => {
          // arrtemp2.push(item2.id)
          item2.children.forEach(item3 => {
            arrtemp2.push(item3.id);
          });
        });
      });
      this.arrcheck = arrtemp2;

      // 通过遍历取到id值 进行展开
      var arrtemp1 = [];
      this.treelist.forEach(item1 => {
        arrtemp1.push(item1.id);
        item1.children.forEach(item2 => {
          arrtemp1.push(item2.id);
          item2.children.forEach(item3 => {
            arrtemp1.push(item3.id);
          });
        });
      });
      // console.log(arrtemp1);
      this.arrexpand = arrtemp1;
    },
    // 取消权限
    async deleRight(role, rightId) {
      // roles/:roleId/rights/:rightId
      // roleId 当前角色的id
      // rightId 要删除的权限id
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      // console.log(res)
      // 删除成功 返回了200和该角色的剩余权限

      role.children = res.data.data;
      // this.roleList = res.data
      // this.getRolelist()
    },
    async getRolelist() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.rolelist = res.data.data;
      // console.log(this.rolelist);
    }
  }
};
</script>

<style scoped>
.addrolebtn {
  margin-top: 20px;
}
</style>

 