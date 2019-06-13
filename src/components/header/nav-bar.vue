<template>
<div>
    <div class="NavBarcontainer" id="appheader">
       <van-nav-bar tapmode
            :title="title"
             left-text=" "
            :left-arrow="hideArrow"
            @click-left="onClickLeft"
            @click-right="onClickRight"
            >
            <template slot="left">
                <div v-show="hideArrow">
                  <van-icon size="20" color="white" name="arrow-left" />
                </div>
            </template>
       </van-nav-bar>
    </div>
     <div :style="navBarStyle"></div>
</div>
    
</template>
<script>
const isApp = process.env.NODE_ENV === 'development' ? false : true 
import * as switchMethods  from '@/libs/switchMethods'
export default {
    name:'NavBar',
    data(){
        return{
            navBarStyle:'margin-top:40px;'
        }
    },
    props:{
        title:{
            type:String,
            default:'首  页'
        },
        hideArrow:{
            type:Boolean,
            default:true
        },
        returnUrl:{
            type:String,
            default:''
        },
         closeToWin:{
            type:Boolean,
            default:false
        }
    },
    mounted(){
        if(isApp){
            this.navBarStyle='margin-top:80px;'
        }
    },
    methods:{
        onClickLeft() {
            if(this.returnUrl!=""){
                 let params ={
                     name:this.returnUrl
                 }
                switchMethods.turnToPage(params)
            }else{
                location.href="javascript:history.go(-1)";  
                if(isApp){
                    if(this.closeToWin){
                     window.api.closeToWin({
                        name: 'root'
                      })
                    }
                   window.api.closeWin()
                }
            }
         
        },
        onClickRight() {

        }
    }
}
</script>
<style scoped>
.NavBarcontainer{
    position: fixed;
    left: 0px;
    top:0px;
    width: 100%;
    height: 10px;
    z-index: 999;
    background-color:#1989fa
}
    .van-nav-bar{
      background-color:#1989fa
    }
   .van-nav-bar__title{
        font-weight: bold;
        color: #fff;
    } 
   
</style>
