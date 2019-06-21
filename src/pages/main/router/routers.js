import home from '@/pages/home/home.vue'
import login from '@/pages/login/login.vue'
import chargeList from '@/pages/chargeList/chargeList.vue'
import payment from '@/pages/payment/payment.vue'
import payFail from '@/pages/payFail/payFail.vue'
import paySuccess from '@/pages/paySuccess/paySuccess.vue'
import getLineList from '@/pages/getLineList/getLineList.vue'
import Menu from '@/components/Menu'
import Main from '@/components/Main'
import dataEcharts from '@/pages/dataEcharts/dataEcharts.vue'
export default[
    {
      path: '/',
      name: 'Main',
      component: Main 
    },
    {
      path: '/index',
      name: 'index',
      component: Main
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
      path: '/dataEcharts',
      name: 'dataEcharts',
      component: dataEcharts
     
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