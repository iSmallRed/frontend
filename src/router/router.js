import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/login'
import Home from '../components/home/home'

Vue.use(VueRouter)

export default new VueRouter({
 
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home
    }
  ]
})