<template>
  <el-container class="container">
  <el-header class="header">
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="../../assets/logo.png" alt="无法显示图片">
        </div>
      </el-col>
      <el-col :span="18" class="middle">
        <h3>电商后台管理系统</h3>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple">
          <a @click.prevent="handleSignout()" class="loginout">退出</a>
        </div>  
      </el-col>
    </el-row>
  </el-header>
  <el-container>
    <!-- 侧边导航 -->
    <el-aside width="200px" class="aside">
      <!-- 开启路由模式 -->
      <el-menu 
        active-text-color="#b3c0d1"
        :unique-opened="true"
        :router="true">
        <el-submenu :index="'' + item.order" v-for="(item, index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item1.path" v-for="(item1, index) in item.children" :key="index">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return {
      menus: []
    }
  },
  beforeCreate(){
  // 获取token 
  // const token = localStorage.getItem('token');

  // if (!token) {
      //token 没有 -> 登录
    // this.$router.push({ name: 'login' })
  // }
  // if token 有 -> 继续渲染组件

  // newVue 之前自动触发
  },
  created(){
    this.getMenus()
  },
  methods:{
    async getMenus(){
      const res = await this.$http.get(`menus`)
      // console.log(res);
      this.menus = res.data.data
    },
    handleSignout(){
      //  1.清除token
      localStorage.clear()
      //  2.提示
      this.$message.success('退出成功')
      //  3.来到login组件
      this.$router.push({ name: 'login' })
    }
  }

}
</script>

<style scoped>
  .container {
    height: 100%;
  }

  .header {
    background-color: #b3c0d1;
  }

  .header img {
    height: 30%;
    width: 30%;
  }

  .aside {
    background-color: #d3dce6;
  }

  .main {
    background-color: #e9eef3;
    height: 100%;
  }

  /*头部样式 */
  
  .middle { 
    text-align: center;
  }

  .loginout {
    line-height: 60px;
    text-decoration: none;
  }

</style>