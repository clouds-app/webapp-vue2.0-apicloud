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
    <van-popup v-model="showProcess">
        <van-circle
            v-model="currentRate"
            :rate="0"
            :speed="100"
            :text="downLoadText"
            />
    </van-popup>
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
            currentRate:0,//下载进度
            showProcess: false,//是否显示下载进度条
            companyName:' 我 ',
            isLoading: false,
            hasAccess:false,
            userStatus:{},
            serviceVerInfo:{
                // version:'1.0.0',//app版本号
                // mustUpdate,//是否强制更新
                // versionRemark,//版本号备注
                // appUrl,//更新地址
            },//当前服务器版本信息
            statusCheck:getCookie('statusCheck'),
        }
    },
     computed: {
            downLoadText() {
              return '下载'+this.currentRate.toFixed(0) + '%'
            }
     },
    methods:{
        //vant 下拉刷新
        onRefresh() {
         let _self=this
        setTimeout(() => {
            this.$toast('刷新成功');
            this.isLoading = false;
               _self.initData()  //必须使用 let _self=this 否则无法识别 方法函数
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
                        
                        //_self.$toast.success('欢迎回来');
                        let currentStatus = res.data
                        _self.userStatus = currentStatus
                        _self.hasAccess = (res.status===0)
                        //debugger
                        this.$store.commit('setHasAccess',_self.hasAccess)
                        this.turnToPageBack('dataEcharts') 
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
        //跳转到指定页面，默认字符串
      turnToPageBack(path){
          let params ={
              name:path,
              slidBackEnabled:true //划屏 回 退

          }
          switchMethods.turnToPage(params)
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
      /**
     * 字符串替换
     * @param  {string} str    要被替换的字符串
     * @param  {string} substr 要替换的字符串
     * @param  {string} newstr 用于替换的字符串
     * @return {string}        替换后的新字符串 replace("ssssss", "ss", "s")
     */
    myReplace(str, substr, newstr) {
    substr = substr.replace(/[.\\[\]{}()|^$?*+]/g, "\\$&"); // 转义字符串中的元字符
    var re = new RegExp(substr, "g"); // 生成正则
    return str.replace(re, newstr);
    },
      //版本更新提示
      UpateAppTips(res){
         let isDone =false
         res =res.data
         let _self =this
         let updateInfo = '新版本型号:' + res.version + ';<br/>更新内容:' + res.versionRemark  + ';<br/>发布时间:' + res.createTime;
        //是否强制更新
        if(res.mustUpdate){
             this.$dialog.alert({
                    title: '版本更新',
                    message: updateInfo
                    }).then(() => {
                     // on confirm
                     isDone =true
                    // alert(1)
                      _self.appDownload(res.appUrl)
                      
                    }).catch(() => {
                    // on cancel  
                     isDone =false
                    });      

         }else{
                this.$dialog.confirm({
                    title: '更新提示',
                    message: updateInfo
                    }).then(() => {
                     // on confirm
                     isDone =true
                      _self.appDownload(res.appUrl)
                    }).catch(() => {
                    // on cancel
                     isDone =false
                      _self.checkLogin()
                      _self.getCompanyName()
                    });      
         }       
      },
      //下载更新文件
      appDownload(downLoadUrl){
           //alert('下载开始....')
           this.showProcess =true
           let _self =this
           if (window.api.systemType == "android") {
                                    window.api.download({
                                        url : downLoadUrl,
                                        report : true
                                    }, function(ret, err) {
                                        if (ret && 0 == ret.state) {/* 下载进度 */
                                            // window.api.toast({
                                            //     msg : "正在下载应用" + ret.percent + "%",
                                            //     duration : 2000
                                            // });
                                            _self.currentRate = ret.percent
                                        }
                                        if (ret && 1 == ret.state) {/* 下载完成 */
                                            _self.showProcess=false
                                            let savePath = ret.savePath;
                                            window.api.installApp({
                                                appUri : savePath
                                            });
                                        }else if (ret && 2 == ret.state)
                                        {
                                          this.$dialog.confirm({
                                            title: '提示',
                                            message: '更新失败，是否重新更新'
                                            }).then(() => {
                                                // on confirm
                                                _self.appDownload(res.appUrl)
                                            }).catch(() => {
                                            // on cancel
                                                _self.checkLogin()
                                                _self.getCompanyName()
                                            });      
                                        }
                                    });
                                }
         if (window.api.systemType == "ios") {
                    window.api.alert({
                            msg : "请到App store下载最新版本"
                        });                
          }
            
      },
      //获取服务app版本信息,
      getServiceVerInfo(){
            let _self=this
            let currentVersion = '0.1.0'
            if(isApp){
                //currentVersion:1.3.29
                currentVersion =  window.api.appVersion 
                //console.log('currentVersion:'+currentVersion)
                //currentVersion = '0.1.0'
            }
             currentVersion =parseInt(this.myReplace(currentVersion,'.',''))
              //console.log('currentVersion format:'+currentVersion)
             
          let params ={
                version:currentVersion
          }
          return new Promise((resolve,reject)=>{
               this.$store.dispatch('checkAppUpdate_action',params).then(res=>{
                // debugger
                 _self.serviceVerInfo =res
                  resolve(res)
                }).catch(err=>{
                    // debugger
                     _self.serviceVerInfo =err
                    reject(err)
                })
          })
         
      },
      //初始化数据
      initData(){
          let _self =this
          this.getServiceVerInfo().then(res=>{
               //alert('发现新版本！！')
                _self.UpateAppTips(res)
          }).catch(err=>{
                  _self.checkLogin()
                  _self.getCompanyName()
          })
            
            
      }

      

    },
    created(){
      //  this.getServiceVerInfo()
    },
    mounted(){
         this.initData()
        if(isApp){
           let _self = this
           this.RefreshEventListener(function(){
                _self.initData()  //必须使用 let _self=this 否则无法识别 方法函数
           })
        }
    }
}
</script>
<style scoped>

.van-circle {
    position: relative;
    display: block;
    text-align: center;
}
.van-popup--center{
    border-radius: 50px;
}
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
