<template>
  <div id="app">
   <NavBar title="图 表" :isHideTitleAndArrow="false"> </NavBar>
    <van-row style="background-color:#fff">
        <van-col span="8" class="dayWeekMonthButton"> 
           <!-- <van-icon name="arrow-left" /> -->
           <van-button tapmode :disabled="currentDateType=='day'" size="mini" style="minWidth:40px;width:auto;"   @click="handleDataFilter('day')"   type="primary" >当 天</van-button>
           <van-button tapmode :disabled="currentDateType=='week'" size="mini" style="minWidth:40px;width:auto"   @click="handleDataFilter('week')"   type="info" >本 周</van-button>
           <van-button tapmode :disabled="currentDateType=='month'" size="mini" style="minWidth:40px;width:auto"   @click="handleDataFilter('month')"   type="danger" >本 月</van-button>
        </van-col>
        <van-col span="16" >
            <van-row > 
              <van-col span="8"> 
                <van-button tapmode icon="clock" size="mini" style="minWidth:90px;width:auto;" @click="handlePickupData(1)" type="default">{{StartDate}}</van-button>
                </van-col>
                <van-col span="2"> 
                    <span> -> </span>
                </van-col>
              <van-col span="8">
                <van-button tapmode  icon="clock" size="mini" style="minWidth:90px;width:auto;" @click="handlePickupData(2)" type="default">{{EndDate}}</van-button>
              </van-col>
              <van-col span="6"><van-button size="mini" style="minWidth:80px;width:auto"   @click="handleSearch()"   type="warning">查询</van-button></van-col>
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
               <chart-bar style="min-height:268px;height:auto;" :value="barData" text="生产报表图"/>
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
import {getDate,dataDiff} from '@/libs/tools'
export default {
  name: 'dataEcharts',
  mixins:[base_mixin],
  components:{
    Footer,NavBar,userStatus,ChartPie,ChartBar,
  },
   data() {
            return {
                  myChargeListDetail:{},
                  isSearchData:false,
                  isSelectedEndDate:false,
                  currentDate: new Date(),
                  minDate: new Date(2018, 0, 1),
                  maxDate: new Date(),
                  showGetContainer: false,
                  StartDate:'',
                  EndDate:'',
                  barData: [],
                  currentMonthBarData:[],
                  tempBarData:[],//[...mockData] || [],
                  currentDateType:'week',//当天 day （默认），本周 week，本月 month :null
                  currentSelectLineId:'', //当前选中线别
                  currentSelectClassId:'',//当前选中班别
                  allLineList:[], //当前数据所有线别
                  allClassList:[],//当前数据所有班别

            }
        },
   methods:{
       //获取购买的生产线信息
          getChargeListDetail(){
            let userInfo = getLocalStorage('userInfo')
               if(userInfo!=""){
                let user =JSON.parse(userInfo)
                  this.myChargeListDetail = user.chargeList
                }
          },
           //过滤生产线 BY 购买条数 //剩余可用产线数据
          filterLine(itemList){
              let _self=this
              let myPayLines = []
              for (const chargeItem of this.myChargeListDetail) {
                   myPayLines.push(chargeItem.custLineId+"")
              }
              let afterData = itemList.filter(item=>{
                  return myPayLines.indexOf(item.LineID) ==-1 ? false :true
              })
              return afterData
          },
     //验证两个输入的日期 是否有效
     checkInputData(){
       let flag =true
       let msg =''
       if(this.StartDate =='' || this.EndDate ==''){
         msg ='开始/结束日期必填'
         flag=false
       }
       else if(this.StartDate !='' || this.EndDate !='')
       {
          let date1 = this.stringToDate(this.StartDate)
          let date2 = this.stringToDate(this.EndDate)
          let diff =dataDiff('d',date1,date2)
          if(diff>31){
             msg ='时间间隔不能超过30天'
             flag=false
          }
          if(diff<0){
             msg ='结束时间必须大于开始时间'
             flag=false
          }
       }

       if(msg!=''){
          this.$toast(msg)
       }
       return flag
     },
       //跳转到指定页面，默认字符串
       turnToPage(path){
          let params ={
              name:path,
              slidBackEnabled:true //划屏 回 退

          }
          switchMethods.turnToPage(params)
      },
      //过滤数据 线别
      filterDataByLineId(lineId){
           this.currentSelectLineId =lineId
   
          let currentData =this.dateFilter(this)
          this.barData  = currentData
      },
        //过滤数据 班别
      filterDataByClassId(classId){
          this.currentSelectClassId = classId
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
      getGoodsAllLineOrClass(itemList){
        //debugger
        let tempLineList = []
        let tempClassList = []
       
        for(let i=0;i<itemList.length;i++){
              //线别（去重）
              let currentLineId =itemList[i].LineID+""
              if(tempLineList.indexOf(currentLineId)==-1){
                tempLineList.push(currentLineId)
              }
              //班别（去重）
              let currentClassId = itemList[i].ClassID+""
              if(tempClassList.indexOf(currentClassId)==-1){
                tempClassList.push(currentClassId)
              }
        } 

        this.allLineList = tempLineList.sort()
        this.allClassList = tempClassList.sort()
      },
      //根据条件过滤当前数据 当天day，本周week，本月month
      handleDataFilter(type){
           this.isSearchData =false
         
             if(type =='day'){
                 this.StartDate =this.getCurrentData().toString()
                 this.EndDate = this.getCurrentData().toString()
             }else if(type =='week'){
                  this.StartDate = this.getCurrentWeekList()[0] //本周第一天
                  this.EndDate = this.getCurrentWeekList()[6] //本周最后一天
             }else{ //month
                 this.StartDate =this.getCurrentMonthList()[0] //本月第一天
                 this.EndDate = this.getCurrentData().toString()
             }
             //如果列表没有数据，需要重新查询
            if(this.tempBarData.length==0){
                 this.handleSearch()
            }
           
            this.currentDateType = type
            let currentData =this.dateFilter(this)
      },
      //数据过滤
      dateFilter(thisItem){
        let _self = thisItem
         if(!_self){
           _self = this
         }
         let type = _self.currentDateType 
         let currentFilterData = _self.tempBarData

         //当前日期数据
         if(!this.isSearchData){
            
             if(type =='day'){
             let currentDate =_self.getCurrentData().replace('-','/').replace('-','/')
              currentFilterData = _self.tempBarData.filter(item=>{
                    return item.PDate+"" == currentDate
              })

          }
          else if(type =='week'){
             let currentWeekArray = this.getCurrentWeekList() //获取本周列表
                //  for(let i=0;i<7;i++){
                //     let currentDate =_self.getCurrentData(-i).replace('-','/').replace('-','/')
                //     currentWeekArray.push(currentDate)
                //  }

              currentFilterData = _self.tempBarData.filter(item=>{
                     let flag = (currentWeekArray.indexOf(item.PDate+"")==-1 ? false : true)
                    return flag
              })

          }
          else{ //month
             let currentYearAndMonth = _self.getCurrentYearAndMonth() //2019/06

              currentFilterData = _self.tempBarData.filter(item=>{
                     let flag = ((item.PDate).indexOf(currentYearAndMonth)==-1 ? false : true)
                    return flag
              })
          }

          }else{
            //日期搜索数据


          }
         _self.getGoodsAllLineOrClass(currentFilterData) //获取班/线别 但不包含班别线别 过滤
         
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

         
          _self.barData  = currentFilterData
         // debugger
          return currentFilterData
          
      },
      //获取本周日期 列表//type = first,last,all
      getCurrentWeekList(){
        //debugger
        let firstDayOfWeek =''
        let currentWeekArray =[]
        for(let i=1;i<7;i++){
             let day = new Date();
             let num = day.getDay()-1;
             day.setDate(day.getDate() - num); //本周第一天
             if(firstDayOfWeek==''){
                firstDayOfWeek = day.format("yyyy-MM-dd");
                currentWeekArray.push(firstDayOfWeek)
             }
             day.setDate(day.getDate() + i)   
             let currentDate = day.format("yyyy-MM-dd");
             currentWeekArray.push(currentDate)
         }
        return currentWeekArray
      },
      //获取本月第一天/最后一天
      getCurrentMonthList(){
        let currentMonthArray =[]
        let day = new Date()
        day.setDate(1)//本月第一天
        let firstDayOfMonth = day.format("yyyy-MM-dd")
        currentMonthArray.push(firstDayOfMonth)
        day.setMonth(day.getMonth()+1)//下个月
        day.setDate(day.getDate() - 1)//下个月第一天减1得到本月最后一天
        let lastDayOfMonth = day.format("yyyy-MM-dd")
        currentMonthArray.push(lastDayOfMonth)
        return currentMonthArray
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
      //字符串转日期
      stringToDate(dateStr,separator){
          if(!separator){
            separator="-";
          }
          let dateArr = dateStr.split(separator);
          let year = parseInt(dateArr[0]);
          let month;
          //处理月份为04这样的情况                         
          if(dateArr[1].indexOf("0") == 0){
              month = parseInt(dateArr[1].substring(1));
          }else{
                month = parseInt(dateArr[1]);
          }
          let day = parseInt(dateArr[2]);
          let date = new Date(year,month -1,day);
          return date;
      },
      //点击开始/结束日期,确认当前点了那个日期输入框
      handlePickupData(type){
        this.showGetContainer=true
        this.currentDate =new Date()
        if(type=='1'){
           //开始日期 绑定选择日期
           this.currentDate =new Date(this.stringToDate(this.StartDate))
          this.isSelectedEndDate =false;
        }else{
          //结束日子 绑定选择日期
          this.currentDate =new Date(this.stringToDate(this.EndDate))
          
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
        if(Number(currentDate) <10){
          currentDate ='0'+(Number(currentDate))
        }
    
        let currentDataFormat = currentData.getFullYear()+'-'+currentMonth+'-'+currentDate
        return currentDataFormat
     },
      //查询报表数据
      handleSearch(){

        if(!this.checkInputData())
        {
            //return
        }
       this.currentSelectLineId = '', //当前选中线别
       this.currentSelectClassId = '',//当前选中班别
        this.currentDateType ='null' //置空 星期类型
        this.isSearchData =true
        let params = {
          StartDate:this.StartDate,
          EndDate:this.EndDate
        }
        let _self=this
        this.$store.dispatch('getQueryDatasList_actions',params).then(res=>{
           //console.log(JSON.stringify(res))
          // debugger
           let currentData = [...res]
             
           _self.tempBarData = _self.filterLine(currentData)
         
           _self.dateFilter(_self)
           _self.$toast('获取数据成功')
        }).catch(err=>{
           _self.tempBarData = []
           _self.dateFilter(_self)
           _self.$toast(err)
        })
      }
   },
   //初始化数据
   beforeMount(){
     this.StartDate =this.getCurrentData(-60).toString() //测试 60 天 数据
     this.EndDate = this.getCurrentData().toString()
     this.getChargeListDetail()
   
   },
    
   mounted(){
     
   //测试
    //  let currentData =this.dateFilter(this)
    //  this.barData  = currentData
      //this.getCurrentWeekList()
      this.handleSearch()
      this.currentDateType ='month'

    //  let currentData = this.$store.getters.goodsReport_state
    //  if(!currentData){
    //    this.handleSearch()
    //    this.currentDateType ='month'
    //  }else{
    //   // debugger
    //     if(currentData!=""){
    //         this.currentDateType ='null'
    //         this.barData =JSON.parse(currentData)
    //     }
    //     let currentData =this.dateFilter(this)
    //  }
     
   }

}
</script>
<style>
   
#app {
  text-align: center;
  font-size: 14px;
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
    bottom: 6px;
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
    right:15px;
    bottom: 6px;
}
</style>

