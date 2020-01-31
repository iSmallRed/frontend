<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名" v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input placeholder="请输入密码" v-model="formdata.password" show-password></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary" round>登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: '',
        password: ''  
      }
    }
  },
  methods: {
    //登录请求
    //使用async+awit简化登录，使异步更像同步操作
    async handleLogin() {
      const res = await this.$http.post('login', this.formdata)
      const { 
        data, // eslint-disable-line no-unused-vars
        meta: { msg, status }
     } = res.data
      /*
      this.$http.post('login', this.formdata).then(res => {
        console.log(res)    
        const { 
          data,// eslint-disable-line no-unused-vars
          meta: { msg, status }
        } = res.data;
      */
        // 1.登录成功跳转到首页
        if (status === 200) {
          this.$router.push({ name: 'home' })
          // 2.登录成功
          this.$message.success(msg)
        } else {
          // 不成功
          this.$message.warning(msg);
        }

      
    }
  }
}
</script>

<style scoped>
  .login-wrap {
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-wrap .login-form {
    background-color: #fff;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
  }

  .login-wrap .login-form .login-btn {
    width: 100%;
  } 
</style>