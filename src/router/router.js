import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login/login'

Vue.use(VueRouter)

export default new VueRouter({
 
  routes: [
    {
      name: 'login',
      path: '/login',
      component: login
    }
  ]
})