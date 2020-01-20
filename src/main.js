import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import MyHttpServer from './plugins/http'

Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
