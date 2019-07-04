// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './getLineList.vue'
import store from '@/store'
import config from '@/config'

import Vant from 'vant';
import 'vant/lib/index.css';
import FastClick from 'fastclick'

// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件   @使用说明:http://csxiazai.cn/share/app3/app.html#/install
import {VTable,VPagination} from 'vue-easytable'


// 使用
FastClick.attach(document.body)
Vue.use(Vant);
/**
 * @description 全局注册应用配置 add by andy 
 */
Vue.prototype.$config = config
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

// 注册到全局
Vue.component('v-table',VTable)
Vue.component('v-tablePage',VPagination)

/* eslint-disable no-new */
if(process.env.NODE_ENV === 'production'){
  window.apiready = () => {
    new Vue({
      store,
      render: h => h(App)
    }).$mount('#app')

    window.api.setScreenOrientation({
      orientation: 'landscape_right'
    });

  //   window.addEventListener("orientationchange", function() {
  //     var degree = window.orientation
  //     var w = api.winWidth
  //     var h = api.winHeight
  // })

  }
}
else{
  new Vue({
    store,
    render: h => h(App)
  }).$mount('#app')
  
}
