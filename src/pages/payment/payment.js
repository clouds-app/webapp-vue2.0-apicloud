// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './payment.vue'
import store from '@/store'
import config from '@/config'

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
/**
 * @description 全局注册应用配置 add by andy 
 */
Vue.prototype.$config = config
Vue.config.productionTip = false



/* eslint-disable no-new */
if(process.env.NODE_ENV === 'production'){
  window.apiready = () => {
    new Vue({
      store,
      render: h => h(App)
    }).$mount('#app')
    window.api.setScreenOrientation({
      orientation: 'auto'
    });
  }
}
else{
  new Vue({
    store,
    render: h => h(App)
  }).$mount('#app')
  
}
