<template>
  <div id="app">
      <NavBar title="图 表" :isHideTitleAndArrow="false"/>
       <!-- <div style="margin-top:50px;"></div> -->
       <van-row>
        <van-col span="8" class="dayWeekMonthButton"> 
           <van-button tapmode :disabled="currentDateType=='day'" size="mini" style="minWidth:40px;width:auto;"   @click="handleDataFilter('day')"   type="primary" >当 天</van-button>
           <van-button tapmode :disabled="currentDateType=='week'" size="mini" style="minWidth:40px;width:auto"   @click="handleDataFilter('week')"   type="info" >本 周</van-button>
           <van-button tapmode :disabled="currentDateType=='month'" size="mini" style="minWidth:40px;width:auto"   @click="handleDataFilter('month')"   type="danger" >本 月</van-button>
        </van-col>
        <van-col span="16" >
            <van-row > 
              <van-col span="8"> 
                <van-button tapmode icon="clock" size="mini" style="minWidth:80px;width:auto;" @click="handlePickupData(1)" type="default">{{StartDate}}</van-button>
                <!-- <van-field @focus="handlePickupData(1)" size="mini" :border="false" left-icon="clock"   style="width:160px;" v-model="StartDate" placeholder="起始日期" /> -->
                </van-col>
              <van-col span="8">
                <!-- <van-field @focus="handlePickupData(2)" size="mini" left-icon="clock" style="width:160px;"  v-model="EndDate" placeholder="结束日期" /> -->
                <van-button tapmode  icon="clock" size="mini" style="minWidth:80px;width:auto;" @click="handlePickupData(2)" type="default">{{EndDate}}</van-button>
              </van-col>
              <van-col span="8"><van-button size="mini" style="minWidth:80px;width:auto"   @click="handleSearch()"   type="warning">查询</van-button></van-col>
            </van-row>
            <van-popup
              v-model="showGetContainer"
              get-container="body"
              :style="{ width:'60%',padding: '30px 50px' }"
            >
            <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :formatter="formatter"
                    @confirm="handleConfirm"
                    @cancel="handleCancel"
                  />
           </van-popup>
          
       </van-col>
      </van-row>
       
       <div class="subButton">
            <!-- <ul>
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
              </ul> -->
               <chart-bar style="height:300px;" :value="barData" text="生产报表图"/>
       </div>
       <div class="lineButton">
            <div>
              <van-button tapmode  size="mini"    @click="filterDataByLineId(allLineList.toString())"   type="primary" >线 别</van-button>
              <van-button  tapmode size="mini"    @click="filterDataByLineId(allLineList.toString())"   type="info" >全 部</van-button>
              <van-button tapmode v-for="item in allLineList" :key="item" round size="mini" :disabled="currentSelectLineId==item"   @click="filterDataByLineId(item)"   type="danger" >{{item}}</van-button>
            </div>
              <div style="margin-top:6px;">
                <van-button tapmode size="mini"    @click="filterDataByClassId(allClassList.toString())"   type="primary" >班 别</van-button>
                <van-button tapmode size="mini"    @click="filterDataByClassId(allClassList.toString())"   type="info" >全 部</van-button>
                <van-button tapmode v-for="item in allClassList" :key="item" size="mini" :disabled="currentSelectClassId==item" round   @click="filterDataByClassId(item)"   type="danger" >{{item}}</van-button>
            </div>
       </div>
       <div class="jumpButton">
          <van-button tapmode size="normal" round   @click="turnToPage('getLineList')"   type="warning" >生产现场</van-button>
       </div>
      
  </div>
</template>

<script>
import mockData from '@/mock/report'
import userStatus from '_c/userStatus'
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import Footer from '@/components/footer'
import { ChartPie, ChartBar } from '_c/charts'
import * as switchMethods  from '@/libs/switchMethods'
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
                  isSelectedEndDate:false,
                  currentDate: new Date(),
                  minDate: new Date(2018, 0, 1),
                  maxDate: new Date(),
                  showGetContainer: false,
                  StartDate:'',
                  EndDate:'',
                  barData:  [],
                  tempBarData:[...mockData] || [],
                  currentDateType:'week',//当天day （默认），本周week，本月month
                  currentSelectLineId:'', //当前选中线别
                  currentSelectClassId:'',//当前选中班别
                  allLineList:[], //当前数据所有线别
                  allClassList:[],//当前数据所有班别

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
      //过滤数据 线别
      filterDataByLineId(lineId){
           this.currentSelectLineId =lineId
          //  let currentFilterData = []
          //   currentFilterData = this.tempBarData.filter(item=>{
          //         let flag = this.strToArrayNum(lineId).includes(Number(item.LineID))
          //           return flag 
          //     })

          //  this.barData  = currentFilterData
          let currentData =this.dateFilter(this)
          this.barData  = currentData
      },
        //过滤数据 班别
      filterDataByClassId(classId){
          this.currentSelectClassId = classId
        //   let currentFilterData = []
        //    currentFilterData = this.tempBarData.filter(item=>{
        //        let flag = (classId.toUpperCase().indexOf(item.ClassID.toUpperCase()+"")==-1 ? false : true)
        //             return flag
        //       })

        //  this.barData  = currentFilterData
         let currentData =this.dateFilter(this)
          this.barData  = currentData
      },
      //字符串列表 转 数组 数字 列表
      strToArrayNum(itemList){
         let tempArrayList =[]
          if(itemList){
             if(itemList.split(',').length > 0){
                let tempList = itemList.split(',')
                for(let item =0;item<tempList.length;item++){
                    tempArrayList.push(Number(tempList[item]))
                }
             }
             else{
                tempArrayList.push(Number(itemList))
             } 
          }
       
          return tempArrayList
      },
      //获取数据所有 班别/线别 列表 （去重）
      getGoodsAllLineOrClass(){
        //debugger
        let tempLineList = []
        let tempClassList = []
        for(let i=0;i<this.tempBarData.length;i++){
              //线别（去重）
              let currentLineId =this.tempBarData[i].LineID+""
              if(tempLineList.indexOf(currentLineId)==-1){
                tempLineList.push(currentLineId)
              }
              //班别（去重）
              let currentClassId = this.tempBarData[i].ClassID+""
              if(tempClassList.indexOf(currentClassId)==-1){
                tempClassList.push(currentClassId)
              }
        } 

        this.allLineList = tempLineList.sort()
        this.allClassList = tempClassList.sort()
      },
      //根据条件过滤当前数据 当天day，本周week，本月month
      handleDataFilter(type){
          this.currentDateType = type
          let currentData =this.dateFilter(this)
          this.barData  = currentData
      },
      //数据过滤
      dateFilter(thisItem){
        let _self = thisItem
        //  if(!_self){
        //    _self = this
        //  }
         let type = _self.currentDateType 
         let currentFilterData = []
         if(type =='day'){
             let currentDate =_self.getCurrentData().replace('-','/').replace('-','/')
              currentFilterData = _self.tempBarData.filter(item=>{
                    return item.PDate+"" == currentDate
              })

          }
          else if(type =='week'){
             let currentWeekArray =[]
                 for(let i=0;i<7;i++){
                    let currentDate =_self.getCurrentData(-i).replace('-','/').replace('-','/')
                    currentWeekArray.push(currentDate)
                 }

              currentFilterData = _self.tempBarData.filter(item=>{
                     let flag = (currentWeekArray.indexOf(item.PDate+"")==-1 ? false : true)
                    return flag
              })

          }else{ //month
             let currentYearAndMonth = _self.getCurrentYearAndMonth()

              currentFilterData = _self.tempBarData.filter(item=>{
                     let flag = ((item.PDate).indexOf(currentYearAndMonth)==-1 ? false : true)
                    return flag
              })
          }

        //线别过滤
         if(this.currentSelectLineId!='' && this.currentSelectLineId!=null){
               currentFilterData = currentFilterData.filter(item=>{ //本体数据上过滤
                  let flag = this.strToArrayNum(this.currentSelectLineId).includes(Number(item.LineID))
                    return flag 
              })
         }
        //班别过滤
         if(this.currentSelectClassId!='' && this.currentSelectClassId!=null){
                currentFilterData = currentFilterData.filter(item=>{ //本体数据上过滤
                let flag = (this.currentSelectClassId.toUpperCase().indexOf(item.ClassID.toUpperCase()+"")==-1 ? false : true)
                      return flag
                })

         }

          _self.getGoodsAllLineOrClass()
          _self.barData  = currentFilterData
         // debugger
          return currentFilterData
          
      },
      //获取当前年月 字符串 ：2019/06
      getCurrentYearAndMonth(){
         let currentData = new Date()
         let currentMonth = currentData.getMonth()
          if(Number(currentMonth)+1<10){
            currentMonth ='0'+(Number(currentMonth)+1)
          }else{
            currentMonth =(Number(currentMonth)+1)
          }
          let currentDateFormat = currentData.getFullYear()+'/'+currentMonth
          return currentDateFormat
      },
      //点击开始/结束日期,确认当前点了那个日期输入框
      handlePickupData(type){
        this.showGetContainer=true
        if(type=='1'){
          this.isSelectedEndDate =false;
        }else{
          this.isSelectedEndDate =true;
        }
      },
      //格式化 起始/结束 选择日期格式
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`
        }
      return value;
      },
     //确认日期
     handleConfirm(value){
       let currentYear = value.getFullYear()
       let currentMonth = value.getMonth()
       let currentDay = value.getDate()
       if(Number(currentMonth)+1<10){
          currentMonth ='0'+(Number(currentMonth)+1)
        }else{
           currentMonth =(Number(currentMonth)+1)
        }
        let tempDate =currentYear+'-'+currentMonth +'-'+currentDay
        if(this.isSelectedEndDate){
          this.EndDate = tempDate
        }
        else{
          this.StartDate =tempDate
        }
       this.showGetContainer =false
     },
     //取消日期
     handleCancel(){
       this.showGetContainer =false
     },
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
        }else{
           currentMonth =(Number(currentMonth)+1)
        }
        let currentDate =currentData.getDate()
    
        let currentDataFormat = currentData.getFullYear()+'-'+currentMonth+'-'+currentDate
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
           _self.tempBarData =res
           _self.dateFilter(_self)
        }).catch(err=>{
           _self.$toast(err)
        })
      }
   },
   //初始化数据
   beforeMount(){
     this.StartDate =this.getCurrentData(-53).toString()
     this.EndDate = this.getCurrentData(1).toString()
     //this.handleSearch()
   },
    
   mounted(){

  let currentData =this.dateFilter(this)
   this.barData  = currentData
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
    text-align: left;
    position: absolute;
    left: 43px;
    bottom: 10px;
    min-width:40px;
    width:auto;
}
.dayWeekMonthButton{
   text-align: left;
   padding-left: 43px;
}
.lineButton button{

   min-width:40px;width:auto;
}
.jumpButton{
    position: absolute;
    right:43px;
    bottom: 10px;
}
</style>

