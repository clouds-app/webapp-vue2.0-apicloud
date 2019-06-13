import home from '@/pages/home/home.vue'
import login from '@/pages/login/login.vue'
import chargeList from '@/pages/chargeList/chargeList.vue'
import payment from '@/pages/payment/payment.vue'
import payFail from '@/pages/payFail/payFail.vue'
import paySuccess from '@/pages/paySuccess/paySuccess.vue'
import getLineList from '@/pages/getLineList/getLineList.vue'
import Menu from '@/components/Menu'
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
      component: home
    
    },
    {
      path: '/login',
      name: 'login',
      component: login
   
    },
    {
      path: '/chargeList',
      name: 'chargeList',
      component: chargeList
     
    },
    {
      path: '/payment',
      name: 'payment',
      component: payment
    
    }
    ,
    {
      path: '/payFail',
      name: 'payFail',
      component: payFail
    }
    ,
    {
      path: '/paySuccess',
      name: 'paySuccess',
      component: paySuccess
     
    }
    ,
    {
      path: '/getLineList',
      name: 'getLineList',
      component: getLineList
     
    }
  ]