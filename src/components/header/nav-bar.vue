<template>
    <div class="NavBar-container" id="appheader" >
       <van-nav-bar
            :title="title"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
            @click-right="onClickRight"
            />
       <div style="margin-top:10px;height:1px;"></div>
    </div>
</template>
<script>
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
        },
        onClickRight() {
        
        }
    }
}
</script>