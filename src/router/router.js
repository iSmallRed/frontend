import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/login'
import Home from '../components/home/home'
import Users from '../components/users/users'
import Right from '../components/rights/right'
import Role from '../components/rights/role'
import Goodslist from '../components/goods/goodslist'
import Goodsadd from '../components/goods/goodsadd'
import Cateparams from '../components/goods/cateparams'
import Goodscate from '../components/goods/goodscate'
import Order from '../components/order/order'

import { Message } from 'element-ui';

Vue.use(VueRouter)

const router = new VueRouter({
 
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
        },
        {
          name: 'right',
          path: '/rights',
          component: Right
        },
        {
          name: 'roles',
          path: '/roles',
          component: Role
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goodslist
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: Goodsadd
        },
        {
          name: 'cateparams',
          path: '/params',
          component: Cateparams
        },
        {
          name: 'goodscate',
          path: '/categories',
          component: Goodscate
        },
        {
          name: 'order',
          path: '/orders',
          component: Order
        }
      ]
    },
     
  ]
})
// 在路由配置生效之前 统一判断token
// 路由守卫 在路由配置生效之前
// 路由/导航 守卫
// to -> 要去的路由配置
// from -> 当前的路由配置
//  / -> /login home -> login to 就是login | from 就是home路由配置
router.beforeEach((to, from, next) => {
  // to from next
  // console.log(to, from);
  // 如果要去的是登录 -> next()
  if (to.path==='/login') {
    next()
  } else {
    // 如要要去的不是登录
    // 判断token
    const token = localStorage.getItem('token');
    if (!token) {
      // 如果没有token没有 -> login
      // this.$router.push({name: 'login'}) 不是vue文件所以不能用
      // 提示
      Message.warning('请先登录')
      router.push({name: 'login'})
      return
    }
    next()
  }


  // 如果有 -> next()

})
export default router

// // node 中间件
// app.use((req, res, next) => {
//   // req.body
//   // res.render()
//   // next() 
//   res.send()
//   next()
// })