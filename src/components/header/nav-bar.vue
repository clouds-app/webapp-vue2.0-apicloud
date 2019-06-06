<template>
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
       <div style="margin-top:10px;height:1px;"></div>
    </div>
</template>
<script>
const isApp = process.env.NODE_ENV === 'development' ? false : true 
export default {
    name:'NavBar',
    props:{
        title:{
            type:String,
            default:'首  页'
        },
        hideArrow:{
            type:Boolean,
            default:true
        }
    },
    methods:{
        onClickLeft() {
            location.href="javascript:history.go(-1)";  
            if(isApp){
                window.api.closeWin()
            }
        },
        onClickRight() {

        }
    }
}
</script>
<style scoped>
    .van-nav-bar{
        background-color:#1989fa
    }
   .van-nav-bar__title{
        font-weight: bold;
        color: #fff;
    } 
   
</style>
