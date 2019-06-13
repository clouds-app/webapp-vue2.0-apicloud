// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import config from '@/config'
import Vant from 'vant';
import 'vant/lib/index.css';
import FastClick from 'fastclick'
// import VueResource from 'vue-resource'
// /*使用VueResource插件*/
// Vue.use(VueResource)
// 使用
FastClick.attach(document.body)

Vue.use(Vant);
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件   @使用说明:http://csxiazai.cn/share/app3/app.html#/install
import {VTable,VPagination} from 'vue-easytable'

// 注册到全局
Vue.component('v-table',VTable)
Vue.component('v-tablePage',VPagination)

/**
 * @description 全局注册应用配置 add by andy 
 */
Vue.prototype.$config = config

// Vue.use(YDUI)
Vue.config.productionTip = false



/* eslint-disable no-new */
if(process.env.NODE_ENV === 'production'){
  window.apiready = () => {
    new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app')

//   window.api.setStatusBarStyle({
//       style: 'dark'
// }); 
  }
}
else{
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
  
}
