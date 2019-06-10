//视图公用方法
import {getCookie} from '@/libs/util'
import * as switchMethods  from '@/libs/switchMethods'
export default {
    data(){
      return {
        showToastLoading: {},
      }
    },
    props: {
    
    },
    computed: {
    },
    methods: {
      //跳转到指定页面，默认字符串
       turnToPage(path){
          let params ={
              name:path
          }
          switchMethods.turnToPage(params)
      },
      fixHeaderStatusBar(){
        if(process.env.NODE_ENV === 'production'){
          // let header = $api.byId('appheader');
          // $api.fixStatusBar(header);
        }
       
      },
      fixFooterStatusBar(){
        if(process.env.NODE_ENV === 'production'){
          let header = $api.byId('appheader');
          let footer = $api.byId('appfooter');
          let headerH = $api.offset(header).h
          let footerH = $api.offset(footer).h
          let otherH = winodw.api.winHeight - headerH - footerH
          return otherH
        }
      },
         //获取设备编码
         getDeviceId(){
          let deviceId = 'dk408F8B-9598-48B6-A740-B9037ADCXXXE'
          if(process.env.NODE_ENV === 'production'){
               deviceId = window.api.deviceId;  //比如： FC408F8B-9598-48B6-A740-B9037ADCXXXE
               console.log('login deviceId :' +deviceId)
          }
          return deviceId
      },
      
    },
    mounted(){
     // this.fixHeaderStatusBar();
    }
  };
  