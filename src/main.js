import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import MyHttpServer from './plugins/http'
import moment from 'moment'
import MyBread from '../src/components/cuscom/myBread'

Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.config.productionTip = false

// 全局过滤器-处理日期
Vue.filter('fmtdate',(v) => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.component('my-bread',MyBread)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
