// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import config from '@/config'
import Vant from 'vant';
import 'vant/lib/index.css';
// import FastClick from 'fastclick'

// // 使用
// FastClick.attach(document.body)

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

Date.prototype.format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


/* eslint-disable no-new */
if(process.env.NODE_ENV === 'production'){
  window.apiready = () => {
    new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app')
  
    window.api.setScreenOrientation({
      orientation: 'auto'
    });
  // window.addEventListener("orientationchange", function() {
  //     var degree = window.orientation
  //     var w = api.winWidth
  //     var h = api.winHeight
  // })
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
