//import Home from '@/pages/home/App.vue'
import Menu from '@/components/Menu'
//import Login from '@/pages/login/App.vue'
export default[
    {
      path: '/',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/index',
      name: 'index',
      component: Menu
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "UserCenter" */ '@/pages/home/home.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "UserCenter" */ '@/pages/login/login.vue'),
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import(/* webpackChunkName: "UserCenter" */ '@/pages/payment/payment.vue'),
    }
  ]