import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/login'
import Home from '../components/home/home'
import Users from '../components/users/users'

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
      component: Home,
      children: [
        {
          name: 'users', 
          path: 'users',
          component: Users
        }
      ]
    }
  ]
})