<template>
  <div id="app">
      <NavBar title="图 表" :isHideTitleAndArrow="false"/>
       <!-- <div style="margin-top:50px;"></div> -->
       <van-row>
        <van-col span="8"> 
           <van-button plain size="mini" style="minWidth:30px;width:auto;"   @click="handleSearch()"   type="primary" >当天</van-button>
           <van-button plain size="mini" style="minWidth:30px;width:auto"   @click="handleSearch()"   type="info" >本周</van-button>
           <van-button plain size="mini" style="minWidth:30px;width:auto"   @click="handleSearch()"   type="danger" >本月</van-button>
        </van-col>
        <van-col span="16" >
            <van-row gutter="20"> 
              <van-col span="8"> <van-field size="mini" :border="false" left-icon="clock" style="width:160px;" v-model="StartDate" placeholder="起始日期" /></van-col>
              <van-col span="8"><van-field size="mini" left-icon="clock" style="width:160px;" v-model="EndDate" placeholder="结束日期" /></van-col>
              <van-col span="8"><van-button size="mini" style="minWidth:80px;width:auto"   @click="handleSearch()"   type="warning">查询</van-button></van-col>
            </van-row>
       </van-col>
      </van-row>
         <van-row gutter="20"> 
              <van-col span="2" class="subButton"> 
                 <ul>
                  <li>
                      <van-button  plain size="mini" style="minWidth:40px;width:auto;"   @click="handleSearch()"   type="primary" >产 能</van-button>
                  </li>
                  <li>
                      <van-button plain size="mini" style="minWidth:40px;width:auto;"   @click="handleSearch()"   type="primary" >损 耗</van-button>
                  </li>
                  <li>
                      <van-button plain size="mini" style="minWidth:40px;width:auto;"   @click="handleSearch()"   type="primary" >停 次</van-button>
                  </li>
                  <li>
                      <van-button plain size="mini" style="minWidth:40px;width:auto;"   @click="handleSearch()"   type="primary" >车 速</van-button>
                  </li>
              </ul>
              </van-col>
              <van-col span="22">
                <div style="margin-left:10px;">
                          
                          <chart-bar style="height: 240px;" :value="barData" text="生产报表图"/>
                </div>
              </van-col>
           
       </van-row>
       <div>
          <van-button plain size="mini" style="minWidth:30px;width:auto;"   @click="handleSearch()"   type="primary" >班别</van-button>
           <van-button plain size="mini" style="minWidth:30px;width:auto"   @click="handleSearch()"   type="info" >全部</van-button>
           <van-button plain size="mini" style="minWidth:30px;width:auto"   @click="handleSearch()"   type="danger" >1线</van-button>
            <van-button plain size="mini" style="minWidth:30px;width:auto"   @click="handleSearch()"   type="danger" >2线</van-button>
       </div>
        <div>
          <van-button plain size="mini" style="minWidth:30px;width:auto;"   @click="handleSearch()"   type="primary" >线别</van-button>
           <van-button plain size="mini" style="minWidth:30px;width:auto"   @click="handleSearch()"   type="info" >全部</van-button>
           <van-button plain size="mini" style="minWidth:30px;width:auto"   @click="handleSearch()"   type="danger" >A</van-button>
          <van-button plain size="mini" style="minWidth:30px;width:auto"   @click="handleSearch()"   type="danger" >B</van-button>
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
  margin-top: 50px;
  margin-left: 6px;
}
.subButton li {
  margin-top: 15px;
}
/* .subButton button{
  padding: 1px;
} */
</style>

