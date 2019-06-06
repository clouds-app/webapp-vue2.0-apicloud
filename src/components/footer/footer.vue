<template>
   <van-tabbar v-model="active">
        <van-tabbar-item icon="home-o">晨龙生管APP</van-tabbar-item>
        <!-- <van-tabbar-item icon="search" dot>标签</van-tabbar-item>
        <van-tabbar-item icon="friends-o" info="5">标签</van-tabbar-item>
        <van-tabbar-item icon="setting-o" info="20">标签</van-tabbar-item> -->
    </van-tabbar>
</template>
<script>
export default {
    name:'footerTabbar',
    data(){
        return {
            active:0
        }
    }
}
</script>