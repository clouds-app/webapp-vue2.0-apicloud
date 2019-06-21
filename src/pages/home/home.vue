<template>
  <div id="app">
      <NavBar title="监控列表"/>
      <van-cell-group title="生产线">

        <van-cell icon="location-o" @click="turnToPage('getLineList')" title="生产线数据" is-link value="查看" />
        <van-cell icon="location-o" @click="turnToPage('dataEcharts')" title="图表查看" is-link value="查看" />
        <van-cell icon="location-o" title="单元格测试2" arrow-direction="down"  />
      </van-cell-group>

    <van-cell-group title="分组2">
      <van-cell icon="location-o" title="单元格测试1" />
    </van-cell-group>

  </div>
</template>

<script>
const isApp = process.env.NODE_ENV === 'development' ? false : true 
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import Footer from '@/components/footer'
export default {
  name: 'MonitoringList',
  mixins:[base_mixin],
  components:{
    Footer,NavBar
  },
   data() {
            return {
                
            }
        },
   methods:{
     //跳转到指定页面，默认字符串
       turnToPage(path){
          let params ={
              name:path,
              slidBackEnabled:true //划屏 回退

          }
          switchMethods.turnToPage(params)
      },
   },
   mounted(){
     if(isApp){
       this.RefreshEventListener(function(){
            //横竖屏 自动 模式
                window.api.setScreenOrientation({
                  orientation: 'auto'
                })
       })
     }
   }

}
</script>
<style>
#app {
  text-align: center;
}
</style>

