<template>
    <div class="loginForm-container">
     <van-cell-group>
            <van-field
                v-model="loginForm.name"
                required
                clearable
                maxlength="11"
                label="用户名"
                right-icon="question-o"
                placeholder="请输入用户名"
                @click-right-icon="$toast('请输入用户名')"
            />
            <van-field
                v-model="loginForm.phoneNo"
                required
                clearable
                maxlength="11"
                label="手机号"
                type="number"
                right-icon="question-o"
                placeholder="请输入手机号"
                :error-message="phoneError"
                @click-right-icon="$toast('请输入手机号')"
            />

            <van-field
                v-model="loginForm.userCode"
                label="授权码"
                 clearable
                 maxlength="11"
                 right-icon="question-o"
                placeholder="请输入授权码"
               @click-right-icon="$toast('请输入授权码')"
                required
            />
            </van-cell-group>
            <div style="margin-top:10px;height:1px;"></div>
            <van-cell-group>
              
                <van-button style="width:250px" :disabled="disabledLogin" :loading="loadingSubmit" loading-txt="提交中.." @click="handleLogin()" round  type="primary" size="normal">注 册</van-button>
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
            phoneError:'',
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
        this.CheckDataBeforeMount()
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
                     _self.$toast('注册成功')
                     this.turnToPage('index')
               }).catch(err=>{
                   _self.loadingSubmit=false 
                  _self.$toast('注册失败: '+err);

               })
               
            }else{
                  this.loadingSubmit=false 
                  
                  //this.$toast('请填写必要信息');
            }
            
        },
        //数据验证
        checkInputData(){
            let flag=true
            this.phoneError=''
            if(this.loginForm.name ==""){
               flag =false
            }
            if(this.loginForm.phoneNo==""){
                flag =false
            }
           if(this.loginForm.userCode==""){
               flag =false
            }
            if(this.loginForm.phoneNo!=""){
               if(!this.isPoneAvailable(this.loginForm.phoneNo)){
                   this.phoneError='手机号格式错误'
                    flag =false
               }
            }
          
            return flag
        },
        //手机号码校验
        isPoneAvailable(tel){
            //debugger
          let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if (!myreg.test(tel)) {
                 return false;
            } else {
                return true;
           }
          
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