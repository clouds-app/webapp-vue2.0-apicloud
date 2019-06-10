<template>
    <div>
         <van-cell :title="userTelephone"   :label="userName" :value="userPaymentMsg" >
              <van-image slot="icon" style="margin:0 10px"
                width="50"
                height="50"
                src="https://img.yzcdn.cn/vant/cat.jpeg"
                />
          </van-cell>
    </div>
</template>
<script>
import EventListener from '@/apiCloud/EventListener'
import {getCookie,getLocalStorage} from '@/libs/util'
export default {
    name:'userStatus',
    data(){
        return {
            userTelephone:'',
            userName:'',
            userPaymentMsg:"",
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