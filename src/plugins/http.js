import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {

  axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/',
  //增加实例方法
  Vue.prototype.$http = axios
  // 需要授权的API ，必须在请求头中使用 Authorization 字段提供 token 令牌
  //开启请求头设置token令牌授权
  const AUTH_TOKEN = localStorage.getItem('token')
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
}

export default MyHttpServer