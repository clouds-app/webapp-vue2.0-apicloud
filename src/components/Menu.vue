<template>
    <div class="main-container">
         
  <NavBar title="主 页"/>
  <van-cell-group>
  <van-cell title="查看数据" @click="turnToPage('home')"  icon="location-o" is-link />
    <van-cell @click="turnToPage('login')"
        title="登 陆"
        is-link
        arrow-direction="down"
       value="内容"
      />
  <van-cell title="功能三" is-link value="内容" />
  <van-cell title="功能四" is-link value="内容" />
  <van-cell title="功能五" is-link>
  <van-icon slot="right-icon"  name="search" class="custom-icon" />
</van-cell>
</van-cell-group>

    </div>
</template>
<script>
import NavBar from '_c/header'
import base_mixin from '@/pages/mixins/common'
import * as switchMethods  from '@/libs/switchMethods'
import {setCookie,getCookie} from '@/libs/util'
import * as type from '@/enums'
export default {
    name:'Menu',
    mixins:[base_mixin],
    components:{NavBar},
    data(){
        return{
            msg:''
        }
    },
    methods:{
       turnToPage(path){
           switchMethods.turnToPage(path)
       },
       //获取设备编码
       getDeviceId(){
           let deviceId = 'dk408F8B-9598-48B6-A740-B9037ADCXXXE'
           if(process.env.NODE_ENV === 'production'){
                deviceId = window.api.deviceId;  //比如： FC408F8B-9598-48B6-A740-B9037ADCXXXE
                console.log('deviceId :' +deviceId)
           }
           return deviceId
       },
       //根据状态调整到指定页面或指定操作
       turnToPageByStatus(status){
             switch(status.toString()){
                   case type.login_status_notExist : //用户不存在-注册 10002
                        switchMethods.turnToPage('login') 
                        break
                   case type.login_status_errParams : //参数不正确-退出app 10003
                        this.$toast.fail('参数不正确，程序即将退出！');
                        break
                   case type.login_status_notExist : //未付费用户 -付费 10004
                        this.$dialog.confirm({
                                title: '提示',
                                message: '未付费，马上付费'
                                }).then(() => {
                                // on confirm
                                 
                                }).catch(() => {
                                // on cancel
                                });
                        break
                   case type.login_status_errParams : //服务已经到期-付费 10005
                       this.$dialog.confirm({
                                title: '提示',
                                message: '服务已经到期，马上续费'
                                }).then(() => {
                                // on confirm
                                }).catch(() => {
                                // on cancel
                                });
                        break
                   case type.login_status_errParams : //未授权登陆-退出app 10006
                       this.$toast.fail('非法登陆，程序即将退出！');
                        break
               }
       },
       //检查是否已经登陆
       checkLogin(){
            let params ={
                systemId:getCookie('userSystemId'),
                deviceId:this.getDeviceId()
            }
            this.$store.dispatch('handleCheckLogin',params).then(res=>{
                 this.$toast.success('欢迎回来');
            }).catch(err=>{
                
                //根据返回状态，判断跳转的页面
                let errData =err
                this.turnToPageByStatus(errData.status)
         })
       }

    },
    mounted(){
        this.checkLogin()
    }
}
</script>