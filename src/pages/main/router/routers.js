import Home from '@/pages/home/App.vue'
import Menu from '@/components/Menu'
import Login from '@/pages/login/App.vue'
export default[
    {
      path: '/',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]