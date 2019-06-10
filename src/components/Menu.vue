<template>
    <div class="main-container">
         
  <NavBar :hideArrow="false" title="  我  "/>
  
  <userStatus/>

  <marginLine></marginLine>
  <van-cell-group>
  <van-cell title="查 看" @click="turnToPage('home')"  icon="location-o" is-link />
  <van-cell @click="turnToPage('login')"  title="注 册" icon="location-o"  is-link  arrow-direction="down"  />
  <van-cell title="套 餐" @click="turnToPage('chargeList')" icon="location-o" is-link  />
  <van-cell title="支 付" @click="turnToPage('payment')" icon="location-o" is-link  />
</van-cell-group>
<Footer/>
    </div>
</template>
<script>

import Footer from '@/components/footer'
import userStatus from '_c/userStatus'
import marginLine from '_c/margin-line'
import NavBar from '_c/header'
import base_mixin from '@/pages/mixins/common'
import * as switchMethods  from '@/libs/switchMethods'
import {getCookie,getLocalStorage} from '@/libs/util'
import * as type from '@/enums'

export default {
    name:'Menu',
    mixins:[base_mixin],
    components:{NavBar,userStatus,Footer,marginLine},
    data(){
        return{
            statusCheck:getCookie('statusCheck'),
        }
    },
    methods:{
    //    //获取设备编码
    //    getDeviceId(){
    //        let deviceId = 'dk408F8B-9598-48B6-A740-B9037ADCXXXE'
    //        if(process.env.NODE_ENV === 'production'){
    //             deviceId = window.api.deviceId;  //比如： FC408F8B-9598-48B6-A740-B9037ADCXXXE
    //             console.log('deviceId :' +deviceId)
    //        }
    //        return deviceId
    //    },
       //根据状态调整到指定页面或指定操作
       turnToPageByStatus(status){
           //debugger
             switch(status.toString()){
                   case type.login_status_notExist : //用户不存在-注册 10002
                        this.turnToPage('login') 
                        break
                   case type.login_status_errParams : //参数不正确-退出app 10003
                        this.$toast.fail('参数不正确，程序即将退出！');
                        break
                   case type.login_status_pendingPay : //未付费用户 -付费 10004
                        if(this.statusCheck =="" || this.statusCheck =="true"){
                            this.$store.commit('setStatusCheck',"true")
                            this.$dialog.confirm({
                                title: '提示',
                                message: '未付费，马上付费'
                                }).then(() => {
                                // on confirm
                                 this.turnToPage('chargeList') 
                                }).catch(() => {
                                // on cancel
                                });
                        }
                        
                        break
                   case type.login_status_outOfDate : //服务已经到期-付费 10005
                           if(this.statusCheck =="" || this.statusCheck =="true"){
                              this.$store.commit('setStatusCheck',"true")
                              this.$dialog.confirm({
                                title: '提示',
                                message: '服务已经到期，马上续费'
                                }).then(() => {
                                // on confirm
                                 this.turnToPage('chargeList') 
                                }).catch(() => {
                                // on cancel
                                });
                            }
                     
                        break
                   case type.login_status_unAuthorize : //未授权登陆-退出app 10006
                       this.$toast.fail('非法登陆，程序即将退出！');
                        break
               }
       },
       //检查是否已经登陆
       checkLogin(){
            let params ={
                systemId:getLocalStorage('userSystemId'),
                deviceId:this.getDeviceId()
            }
            this.$store.dispatch('handleCheckLogin',params).then(res=>{
                 //debugger
                 this.$toast.success('欢迎回来');
                 this.turnToPage('index') 
            }).catch(err=>{
               //debugger
                //根据返回状态，判断跳转的页面
                console.log("判断跳转的页面 :"+JSON.stringify(err));
                let errData =err
                // if(typeof(err) == "object" && err.status!="10002"){
                //     this.$store.commit('setPaymentStatus',err)
                // }
                if(errData && errData.status){
                    console.log("跳转login");
                    this.turnToPageByStatus(errData.status)
                }
              
         })
       }
      

    },
    mounted(){
        this.checkLogin()
    }
}
</script>