<template>
    <section class="main-container">
         
    <NavBar :hideArrow="false" :title="companyName"/>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="otherHeight">
        <userStatus :userStatus="userStatus"/>

        <marginLine></marginLine>
        <van-cell-group v-show="hasAccess">
        <van-cell  title="查 看" @click="turnToPage('home')"  icon="location-o" is-link />
        <van-cell title="支 付" @click="turnToPage('chargeList')" icon="location-o" is-link  />
        </van-cell-group>

        <van-cell-group v-show="!hasAccess">    
        <van-cell  title="查 看"  @click="NoAccess()"  icon="location-o" is-link />
        <van-cell title="支 付" @click="turnToPage('chargeList')" icon="location-o" is-link  />

        </van-cell-group>
         </div>
        <!-- <Footer/> -->
    </van-pull-refresh>
    </section>
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
const isApp = process.env.NODE_ENV === 'development' ? false : true //
export default {
    name:'Menu',
    mixins:[base_mixin],
    components:{NavBar,userStatus,Footer,marginLine},
    data(){
        return{
            companyName:' 我 ',
            isLoading: false,
            hasAccess:false,
            userStatus:{},
            statusCheck:getCookie('statusCheck'),
        }
    },
    methods:{
        //vant 下拉刷新
        onRefresh() {
         let _self=this
        setTimeout(() => {
            this.$toast('刷新成功');
            this.isLoading = false;
               _self.checkLogin()  //必须使用 let _self=this 否则无法识别 方法函数
              _self.getCompanyName()
        }, 500);
        },
        NoAccess(){
            this.$dialog.confirm({
             title: '提示',
             message: '无权查看，立即付费'
             }).then(() => {
              // on confirm
             this.turnToPage('chargeList') 
             }).catch(() => {
             // on cancel
            });                                     
        },
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
            this.$store.commit('setHasAccess','false')
            let params ={
                systemId:getLocalStorage('userSystemId'),
                deviceId:this.getDeviceId()
            }
            let _self=this
            this.$store.dispatch('handleCheckLogin',params).then(res=>{
                 
                 _self.$toast.success('欢迎回来');
                 let currentStatus = res.data
                 _self.userStatus = currentStatus
                _self.hasAccess = (res.status===0)
                //debugger
                this.$store.commit('setHasAccess',_self.hasAccess)
            }).catch(err=>{
                //debugger
                //根据返回状态，判断跳转的页面
                let errData =err
                if(typeof(err) == "object" && err.status!="10002"){
                    _self.$store.commit('setPaymentStatus',err)
                }
                if(errData && errData.status){
                     //console.log("跳转login");
                    _self.turnToPageByStatus(errData.status)
                }
              
         })
        
       },
       //首页 公司名称赋值
       getCompanyName(){
           //debugger
              let userInfo = getLocalStorage('userInfo')
               if(userInfo!=""){
                let user =JSON.parse(userInfo)
                //this.hasAccess =(user.status===0)
                this.companyName = user.companyName
            }
       },
       //下拉刷新 APICLOUD  取消 使用
      initRefresh(){
            let _self=this
            api.setRefreshHeaderInfo({
            visible: true,
            // loadingImg: 'widget://image/refresh.png',
            bgColor: '#fff',
            textColor: '#e1017e',
            textDown: '下拉刷新...',
            textUp: '松开刷新...',
            showTime: true
            }, function(ret, err) {
                 //在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态
                    if(ret){
                         _self.checkLogin()  //必须使用 let _self=this 否则无法识别 方法函数
                         _self.getCompanyName()
                    }
                
                  window.api.refreshHeaderLoadDone() //关闭下拉刷新窗口
            })
      }, 

      

    },
    mounted(){
        this.checkLogin()
        this.getCompanyName()
        if(isApp){
           let _self = this
           this.RefreshEventListener(function(){
                _self.checkLogin()  //必须使用 let _self=this 否则无法识别 方法函数
                _self.getCompanyName()
           })
        }
    }
}
</script>
<style scoped>
.van-pull-refresh{
    height: calc(100vh - 50px);
}
.otherHeight{
    /* height: calc(100vh - 50px); */
    width: 100%;
    height:calc(100vh - 50px);
    /* border: 1px red solid */
  
}
</style>
