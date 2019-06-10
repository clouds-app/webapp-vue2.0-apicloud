<template>
    <div class="loginForm-container">
     <van-cell-group>
            <van-field
                v-model="loginForm.name"
                required
                clearable
                label="用户名"
                right-icon="question-o"
                placeholder="请输入用户名"
                @click-right-icon="$toast('请输入用户名')"
            />
            <van-field
                v-model="loginForm.phoneNo"
                required
                clearable
                label="手机号"
                right-icon="question-o"
                placeholder="请输入手机号"
                @click-right-icon="$toast('请输入手机号')"
            />

            <van-field
                v-model="loginForm.userCode"
                label="授权码"
                clearable
                 right-icon="question-o"
                placeholder="请输入授权码"
               @click-right-icon="$toast('请输入授权码')"
                required
            />
            </van-cell-group>
            <div style="margin-top:10px;height:1px;"></div>
            <van-cell-group>
                <van-button :disabled="disabledLogin" :loading="loadingSubmit" loading-txt="提交中.." @click="handleLogin()" round  long type="primary" size="large">注 册</van-button>
            </van-cell-group>
          
    </div>
</template>
<script>
import * as switchMethods  from '@/libs/switchMethods'
import base_mixin from '@/pages/mixins/common'
export default {
    name:'login-form',
    mixins:[base_mixin],
    data(){
        return {
            loadingSubmit:false,
            disabledLogin:false,
            loginForm:{
                name:'',
                phoneNo:'',
                userCode:'489521'//489521
            }
       
        }
    },
    computed:{ //只能计算DATA中的属性数据
         watchLoginForm(){
             if(this.loginForm.name.length > 0 && this.loginForm.phoneNo.length > 0 && this.loginForm.userCode.length > 0){
                 return true
             }else{
                 return false
             }
         }
    },
    //如果watch监测的是一个对象的话，直接使用watch是不行的，此时我们可以借助于computed计算属性来完成
    watch:{
        //监控数据的变化 是否可以提交 登陆按钮 【取反】
       watchLoginForm(val) {
           if(val){
                this.disabledLogin=false 
           }else{
                this.disabledLogin=true
           }
       }
    },
    mounted(){
         //首次验证数据
        //this.CheckDataBeforeMount()
    },
    methods:{
        // //登陆
        handleLogin(){
            this.loadingSubmit=true
            if(this.checkInputData()){
               let params = this.loginForm
                   params.deviceId =  this.getDeviceId()
                
               let _self=this
               this.$store.dispatch('handleUserRegister',params).then(res=>{
                     _self.loadingSubmit=false 
                     this.turnToPage('index')
                    _self.$toast('注册成功');
               }).catch(err=>{
                   _self.loadingSubmit=false 
                  _self.$toast('注册失败: '+err);

               })
               
            }else{
           
                  this.$toast('请填写必要信息');
            }
            
        },
        //数据验证
        checkInputData(){
            let flag=true
          
            if(!this.loginForm.name !=""){
               flag =false
            }
            if(!this.loginForm.phoneNo!=""){
               flag =false
            }
           if(!this.loginForm.userCode!=""){
               flag =false
            }
            return flag
        },
        //首次验证数据
        CheckDataBeforeMount(){
            this.disabledLogin=true
            if(this.checkInputData()){
                this.disabledLogin=false
            }
        }
       
        
    }
}
</script>