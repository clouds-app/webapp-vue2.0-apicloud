<template>
    <div class="userStatus">

         <van-cell :title="userTelephone"  :label="userName" :value="userPaymentMsg" > 
              <van-image slot="icon" style="margin:0 10px"
                width="50"
                height="50"
                src="https://img.yzcdn.cn/vant/cat.jpeg"
                />
                <template slot="label">
                    <div>
                       {{this.userName}}  {{this.endTime}}
                    </div>
                </template>
          </van-cell>
          <!-- <van-cell :title="`到期时间(${this.userStatus.endTime})`" > </van-cell> -->
    </div>
</template>
<script>
import EventListener from '@/apiCloud/EventListener'
import {getCookie,getLocalStorage} from '@/libs/util'
export default {
    name:'userStatus',
    props:{
        userStatus:{
            chargeName:'', //"0元试用"
            companyName:'', //"深圳晨龙包装自动化有限公司"
            endTime:'', //"2019-07-11T10:15:59.100"
            name:'', //"dk"
            phoneNo:'', //"1380****000"
            serverPath:'', //"shop.szclsoft.com"
            systemId:'', //"10948f16bd5a78a8e8c5970f5b70acba"
        }
    },
    data(){
        return {
            userTelephone:'',
            userName:'',
            userPaymentMsg:"",
            endTime:'',
        }
    },
    computed:{
         userStatusValue(){
            // debugger
             if(this.userStatus!=null){
                   return this.userStatus.chargeName + this.userStatus.name +this.userStatus.phoneNo
             }
           
         }
    },
    watch:{
         userStatusValue(val) {
             this.refreshUserStatus()
       }
    },
    mounted(){
        this.initUserInfo()
    },
    methods:{
        initUserInfo(){
            //debugger
            let userInfo = getLocalStorage('userInfo')
            let userPaymentStatus = getCookie('paymentStatus')
            if(userInfo!=""){
                let user =JSON.parse(userInfo)
                this.userTelephone =user.phoneNo
                this.userName =user.name
            }
            if(userPaymentStatus!=""){
                 let userPaymentItem =JSON.parse(userPaymentStatus)
                 this.userPaymentMsg = userPaymentItem.msg
            }
        },
        //更新用户状态
        refreshUserStatus(){
           // debugger
           if(this.userStatus && this.userStatus.chargeName){
                 this.userTelephone =this.userStatus.phoneNo
                 this.userName =this.userStatus.name//+`到期时间`
                 this.userPaymentMsg = this.userStatus.chargeName
                 this.endTime  = `（${this.userStatus.endTime}）`
           }
        },
        //注册监听事件，apiCloud 内部事件
       initEventListenter(){
        //    EventListener.MessageRegister('userInfoChange').then(res=>{
        //        this.initUserInfo()
        //        api.toast({
        //             msg: '用户状态变更',
        //             duration: 1500,
        //             location: 'middle'
        //         })
        //    })
       }
    }
}
</script>
<style>
     /* .van-cell{
        padding: 0;
    }
     .van-cell__value{
         border: 1px solid pink;
         height: 22px !important;
    }
     .van-cell__label{
        width: 250px;
        border: 1px solid red
    } */
</style>
