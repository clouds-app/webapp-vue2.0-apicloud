<template>
  <div id="app">
      <NavBar title="图 表" :isHideTitleAndArrow="false"/>
       <!-- <div style="margin-top:50px;"></div> -->
       <van-row>
        <van-col span="8"> 
           <van-button  size="mini" style="minWidth:40px;width:auto;"   @click="handleSearch()"   type="primary" >当 天</van-button>
           <van-button  size="mini" style="minWidth:40px;width:auto"   @click="handleSearch()"   type="info" >本 周</van-button>
           <van-button  size="mini" style="minWidth:40px;width:auto"   @click="handleSearch()"   type="danger" >本 月</van-button>
        </van-col>
        <van-col span="16" >
            <van-row gutter="20"> 
              <van-col span="8"> <van-field size="mini" :border="false" left-icon="clock" style="width:160px;" v-model="StartDate" placeholder="起始日期" /></van-col>
              <van-col span="8"><van-field size="mini" left-icon="clock" style="width:160px;" v-model="EndDate" placeholder="结束日期" /></van-col>
              <van-col span="8"><van-button size="mini" style="minWidth:80px;width:auto"   @click="handleSearch()"   type="warning">查询</van-button></van-col>
            </van-row>
       </van-col>
      </van-row>
       
       <div class="subButton">
            <ul>
                  <li>
                      <van-button   size="mini"  @click="handleSearch()"   type="primary" >产 能</van-button>
                  </li>
                  <li>
                      <van-button  size="mini" @click="handleSearch()"   type="primary" >损 耗</van-button>
                  </li>
                  <li>
                      <van-button  size="mini"   @click="handleSearch()"   type="primary" >停 次</van-button>
                  </li>
                  <li>
                      <van-button  size="mini"  @click="handleSearch()"   type="primary" >车 速</van-button>
                  </li>
              </ul>
               <chart-bar style="height:260px;" :value="barData" text="生产报表图"/>
       </div>
       <div class="lineButton">
            <div>
              <van-button  size="mini"    @click="handleSearch()"   type="primary" >线 别</van-button>
              <van-button  size="mini"    @click="handleSearch()"   type="info" >全 部</van-button>
              <van-button  round size="mini"    @click="handleSearch()"   type="danger" >1</van-button>
              <van-button  round size="mini"   @click="handleSearch()"   type="danger" >2</van-button>
            </div>
              <div style="margin-top:6px;">
                <van-button  size="mini"    @click="handleSearch()"   type="primary" >班 别</van-button>
                <van-button  size="mini"    @click="handleSearch()"   type="info" >全 部</van-button>
               <van-button  size="mini"  round   @click="handleSearch()"   type="danger" >A</van-button>
               <van-button  size="mini"  round @click="handleSearch()"   type="danger" >B</van-button>
            </div>
       </div>
       <div class="jumpButton">
          <van-button  size="normal" round   @click="handleSearch()"   type="primary" >生产现场</van-button>
       </div>
      
  </div>
</template>

<script>
import userStatus from '_c/userStatus'
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import Footer from '@/components/footer'
import { ChartPie, ChartBar } from '_c/charts'
import {getCookie,getLocalStorage} from '@/libs/util'
import {getDate} from '@/libs/tools'
export default {
  name: 'dataEcharts',
  mixins:[base_mixin],
  components:{
    Footer,NavBar,userStatus,ChartPie,ChartBar,
  },
   data() {
            return {
                  StartDate:'',
                  EndDate:'',
                  barData: [],
                  tempBarData:[],
            }
        },
   methods:{
     //获取当天日期 年-月-日
     getCurrentData(offsetDate){
        let currentData = new Date()
        currentData.setTime(currentData.getTime())
        if(offsetDate){
          let offDate =offsetDate*(24*60*60*1000)
          currentData.setTime(currentData.getTime()+offDate)
        }
        let currentMonth = currentData.getMonth()
        if(Number(currentMonth)+1<10){
          currentMonth ='0'+(Number(currentMonth)+1)
        }
        let currentDate =currentData.getDate()
        // if(offsetDate && Number(currentDate)>1){
        //   debugger
        //   //currentDate = Number(currentDate) + offsetDate +''
        //   currentDate = currentData.getDate(offsetDate)+''
        // }
        let currentDataFormat = currentData.getFullYear()+"-" + (currentMonth) + "-" + currentDate
        return currentDataFormat
     },
      //查询报表数据
      handleSearch(){
        let params = {
          StartDate:this.StartDate,
          EndDate:this.EndDate
        }
        let _self=this
        this.$store.dispatch('getQueryDatasList_actions',params).then(res=>{
           //console.log(JSON.stringify(res))
           _self.$toast('获取数据成功')
           _self.barData =res
        }).catch(err=>{
           _self.$toast(err)
        })
      }
   },
   beforeMount(){
     this.StartDate =this.getCurrentData(-150).toString()
     this.EndDate = this.getCurrentData(1).toString()
     this.handleSearch()
   },
    
   mounted(){
   

   }

}
</script>
<style>
   
#app {
  text-align: center;
 
}
.van-cell{
  padding:0;
}

.subButton ul{
    position: absolute;
    left: 10px;
    top: 93px;
}
.subButton li {
  margin-top: 15px;
}
.subButton li button{
   min-width:40px;width:auto;
}
.lineButton{
    z-index: 999;
    position: absolute;
    left: 100px;
    bottom: 36px;
    min-width:40px;
    width:auto;
}

.lineButton button{

   min-width:40px;width:auto;
}
.jumpButton{
    position: absolute;
    right:58px;
    bottom: 36px;
}
</style>

