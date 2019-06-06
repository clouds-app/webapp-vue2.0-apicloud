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
import {setCookie,getCookie,setSession,getSession} from '@/libs/util'
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
            let userInfo = getCookie('userInfo')
            let userPaymentStatus = getSession('paymentStatus')
            if(userInfo!=""){
                let user =JSON.parse(userInfo)
                this.userTelephone =user.phoneNo
                this.userName =user.name
            }
            if(userPaymentStatus!=""){
                 let userPaymentItem =JSON.parse(userPaymentStatus)
                 this.userPaymentMsg = userPaymentItem.msg
            }
        }
    }
}
</script>