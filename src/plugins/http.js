import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {

  axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/',
  //增加实例方法
  Vue.prototype.$http = axios

  // 需要授权的API ，必须在请求头中使用 Authorization 字段提供 token 令牌
  //开启请求头设置token令牌授权
  // const AUTH_TOKEN = localStorage.getItem('token')
  // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;



    // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if(config.url !== 'login'){
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] = AUTH_TOKEN;
    }


    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
}

export default MyHttpServer