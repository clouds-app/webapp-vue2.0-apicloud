<template>
  <div id="app">
      <div id="lineData" title='123' >
        <NavBar title="生产数据" :isHideTitleAndArrow="false" :offSetHight="true">
          <div >
              <van-tabs @click="getDataDetailByLine">
                    <van-tab 
                      v-for="(index) in tableData"
                      :title="index.LineID"
                      :key="index.LineID"
                    >
                    <div slot="title">
                            <van-icon :name="handleLineStatusIcon(index.LineStatus)" 
                            :color="handleLineStatusIconColor(index.LineStatus)"/>
                            {{`第 ${getChargeListTitle(index.LineID)} 线(${handleLineStatus(index.LineStatus)})`}}
                      </div>
                      <div class="dataTable">
                          <v-table
                          titleBgColor="#1989fa"
                          id="dataTableLine"
                          ref="dataTableLine"
                          is-vertical-resize
                          style="width:100%;"
                          is-horizontal-resize
                          :vertical-resize-offset='5'
                          :columns="columns"
                          :column-cell-class-name="columnCellClass" 
                          :table-data="getDataByLine(index.LineID)"
                          :show-vertical-border="true">
                          </v-table>
                              <!-- :width="tableWidth" -->
                      </div>
                      
                  </van-tab>
              </van-tabs>
        </div>
        </NavBar>
          <div :style="`width:100%;height:${virtualMarginHeight};`"/>
          <div class="dataTableDetail">
                              <v-table
                              titleBgColor="#1989fa"
                              :is-vertical-resize="true"
                              :style="`width:100%;`"
                              :is-horizontal-resize="true"
                              :vertical-resize-offset='resizeOffset'
                              id="dataTableDetail"
                              ref="dataTableDetail"
                              :height="tableHeight"
                              :columns="columnsDetail"
                              :table-data="tableDataDetail"
                              :show-vertical-border="true"
                              even-bg-color="#f4f4f4"
                              row-hover-color="#eee"
                              row-click-color="#edf7ff"/>
                              
          </div>
          <!--  :width="tableWidth" :style="`width:${tableWidth}px`" -->
       </div>
  </div>
</template>
<script>
import virtualList from 'vue-virtual-scroll-list'
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import LoginForm from '_c/login-form'
import {getCookie,getLocalStorage} from '@/libs/util'
import axios from 'axios'
import * as type from '@/enums'

import Footer from '@/components/footer'
const isApp = process.env.NODE_ENV === 'development' ? false : true
export default {
  name: 'home',
  mixins:[base_mixin],
  components:{
    Footer,NavBar,LoginForm,'virtual-list': virtualList
  },
   data() {
            return {
                 myChargeListDetail:{},
                 resizeOffset:1,
                 virtualMarginHeight:'126px', //区分真机和网页的不兼容问题
                 dataWindowH: window.innerHeight || document.body.clientHeight,
                 currentIndex:0,
                 tableWidth:window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                 tableData: [],
                 tableDataDetail:[],
                 columns: [
                    {field: 'LineID', title:'订单', width: 36, titleAlign: 'center',columnAlign:'center',
                     formatter: function (rowData, index) {
                               return '<span style="color:green;font-weight: bold;">本班</span><br/><span style="font-weight: bold;">上刀</span><br/><span style="font-weight: bold;">下刀</span>'
                               
                        },isFrozen: true},
                    {field: 'LineID', title:'总数', width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                             return '<span style="color:green;font-weight: bold;">' + (Number(rowData.ClassQty)+Number(rowData.ClassBadQty)) + '</span><br/><span style="font-weight: bold;">' + (Number(rowData.CurQty)+Number(rowData.CurBadQty))+ '</span>'
                        },isFrozen: true},
                    {field: 'ClassQty', title:'良品', width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassQty) + '</span><br/><span style="font-weight: bold;">' + (rowData.CurQty) + '</span>'
                        }
                    },
                    {field: 'ClassBadQty', title: '不良', width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassBadQty) + '</span><br/><span style="font-weight: bold;">' + (rowData.CurBadQty) + '</span>'
                        }
                    },
                    {field: 'ClassGoodLength', title:'良品米数', width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassGoodLength) + '</span><br/><span style="font-weight: bold;">' + '</span>'
                        }
                    },
                    {field: 'ClassBadLength', title:'不良米数', width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassBadLength) + '</span><br/><span style="font-weight: bold;">'  + '</span>'
                        }
                    },
                    {field: 'ClassGoodArea', title: '良品面积(㎡)', width: 58, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassGoodArea) + '</span><br/><span style="font-weight: bold;">'  + '</span>'
                        }
                    },
                    {field: 'ClassBadArea', title: '不良面积(㎡)',width: 58, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {

                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassBadArea) + '</span><br/><span style="font-weight: bold;">'  + '</span>'
                        }
                    },
                   
                    {field: 'ClassProdTime', title: '生产时间',width: 80, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            //rowData.ClassProdTime = 1000
                            function formatSeconds(value){
                               let secondTime = parseInt(value);// 秒
                                let minuteTime = 0;// 分
                                let hourTime = 0;// 小时
                                if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                                    //获取分钟，除以60取整数，得到整数分钟
                                    minuteTime = parseInt(secondTime / 60);
                                    //获取秒数，秒数取佘，得到整数秒数
                                    secondTime = parseInt(secondTime % 60);
                                    //如果分钟大于60，将分钟转换成小时
                                    if(minuteTime > 60) {
                                        //获取小时，获取分钟除以60，得到整数小时
                                        hourTime = parseInt(minuteTime / 60);
                                        //获取小时后取佘的分，获取分钟除以60取佘的分
                                        minuteTime = parseInt(minuteTime % 60);
                                    }
                                }
                                let result = "" + parseInt(secondTime);
                                if(minuteTime > 0) {
                                  result = "" + parseInt(minuteTime) + ":" + result;
                                }else{
                                  result = "00"  +":" + result;
                                }
                                if(hourTime > 0) {
                                  result = "" + parseInt(hourTime) + ":" + result;
                                }else{
                                   result = "00"+ ":" + result;
                                }
                                
                                return result;
                            }
                            return '<span style="color:green;font-weight: bold;">' + formatSeconds(rowData.ClassProdTime) + '</span><br/><span style="font-weight: bold;">' + formatSeconds(rowData.CurProdTime) + '</span>'
                        }
                    },
                    {field: 'ClassBreakCount', title: '停车次数',width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassBreakCount) + '</span><br/><span style="font-weight: bold;">' + (rowData.CurBreakCount) + '</span>'
                        }
                    },
                    {field: 'ClassBreakTime', title: '停车时间',width: 80, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                           //rowData.ClassBreakTime = 1000

                            function formatSeconds(value){
                               let secondTime = parseInt(value);// 秒
                                let minuteTime = 0;// 分
                                let hourTime = 0;// 小时
                                if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                                    //获取分钟，除以60取整数，得到整数分钟
                                    minuteTime = parseInt(secondTime / 60);
                                    //获取秒数，秒数取佘，得到整数秒数
                                    secondTime = parseInt(secondTime % 60);
                                    //如果分钟大于60，将分钟转换成小时
                                    if(minuteTime > 60) {
                                        //获取小时，获取分钟除以60，得到整数小时
                                        hourTime = parseInt(minuteTime / 60);
                                        //获取小时后取佘的分，获取分钟除以60取佘的分
                                        minuteTime = parseInt(minuteTime % 60);
                                    }
                                }

                                // let result = "" + parseInt(secondTime) + "秒";
                                // if(minuteTime > 0) {
                                //   result = "" + parseInt(minuteTime) + "分" + result;
                                // }
                                // if(hourTime > 0) {
                                //   result = "" + parseInt(hourTime) + "小时" + result;
                                // }
                                let result = "" + parseInt(secondTime);
                                if(minuteTime > 0) {
                                  result = "" + parseInt(minuteTime) + ":" + result;
                                }else{
                                  result = "00"  +":" + result;
                                }
                                if(hourTime > 0) {
                                  result = "" + parseInt(hourTime) + ":" + result;
                                }else{
                                   result = "00"+ ":" + result;
                                }
                                
                                return result;
                            }
                            return '<span style="color:green;font-weight: bold;">' + formatSeconds(rowData.ClassBreakTime) + '</span><br/><span style="font-weight: bold;">' + formatSeconds(rowData.CurBreakTime) + '</span>'
                        }
                    },
                    {field: 'ClassBadLength', title:'剩余米数', width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassBadLength) + '</span><br/><span style="font-weight: bold;">'  + '</span>'
                        }
                    },
                    {field: 'ClassProdTime', title: '预估完工时间',width: 70, titleAlign: 'center',columnAlign:'right',isResize:true,
                     formatter: function (rowData, index) {
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassProdTime) + '</span><br/><span style="font-weight: bold;">' + (rowData.CurProdTime) + '</span>'
                        }
                    },
                     {field: 'ClassProdTime', title: '热板车速',width: 70, titleAlign: 'center',columnAlign:'right',isResize:true,
                     formatter: function (rowData, index) {
                            return '<div style="line-height: 40px !important;"><span style="color:blue;font-weight: bold;">' + (rowData.Speed_H) + '</span></div>'
                        }
                    },
                    ],

             

                  columnsDetail:[ 
                    {field: 'TotalWidthmm', title: '门幅',width: 40, titleAlign: 'center',columnAlign:'center',isFrozen: true,},
                   
                    {field: 'CustName', title:'客户名称', width: 80, titleAlign: 'center',columnAlign:'left',isResize:true},
                    {field: 'ArtID', title: '纸质', width: 40, titleAlign: 'center',columnAlign:'left',isResize:true},
                    {field: 'ArtLB', title: '楞别', width: 40, titleAlign: 'center',columnAlign:'center',
                     formatter: function (rowData, index) {
                          
                            return '<span>' + (rowData.ArtLB) + '</span>'
                        }
                    },
                    {field: 'CSizeW', title: '规格',width: 66, titleAlign: 'center',columnAlign:'center',isResize:true,
                      formatter: function (rowData, index) {
                            return '<span>' + (rowData.CSizeW) + '</span> * <span>' + (rowData.CSizeL) + '</span>'
                        }
                    },
                    // {field: 'CSizeW', title: '幅宽',width: 50, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CSizeL', title:'切长', width: 50, titleAlign: 'center',columnAlign:'right'},
                    {field: 'OrderQty', title: '数量', width: 40, titleAlign: 'center',columnAlign:'right',},
                    {field: 'Cut', title: '剖', width: 30, titleAlign: 'center',columnAlign:'right',},
                    {field: 'Cut', title: '完工时间', width: 50, titleAlign: 'center',columnAlign:'right',isResize:true},
                    {field: 'Cut', title: '总长', width: 30, titleAlign: 'center',columnAlign:'right',isResize:true},
                    {field: 'OrderNo', title: '订单号', width: 80, titleAlign: 'center',columnAlign:'center',},
                    ]
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
          //获取线别显示名称
          getChargeListTitle(lineId){
             // debugger
              let showItem =this.myChargeListDetail.filter(item=>{
                return item.custLineId ==lineId
              })
              return showItem[0].lineId
          },
          //设置class
          columnCellClass(rowIndex,columnName,rowData){
              // 给三行column为‘Parts1Material’和‘Parts2Material’的列设置className
              /*根据你自己的cloumn设置*/
              //debugger
              if (columnName==='ClassProdTime'||columnName==='ClassBreakTime'){
               // debugger
                //return 'column-cell-class-name-cailiao';//这是你的css名字
              
              }
          },
            //tab切换获取对应的生产数据
          getDataByLine(lineId){
            //debugger
              let tempTableData = [...this.tableData]
              let currentLineData = tempTableData.filter(item=>{
                    return item.LineID+"" == lineId
              })
              return currentLineData
          },
           //tab切换获取对应的生产数据详细
          getDataDetailByLine(index,key){
            this.$toast(`第 ${key} 线`);
            this.currentIndex = key
            this.GetLineDetailList(key)
          },
          //处理运行状态
          handleLineStatus(statusNum){
             let currentStatus =type.getLineStatus(statusNum+'') //返回生产状态描述
             return currentStatus
          },
           //处理运行状态ICON图片
          handleLineStatusIcon(statusNum){
            switch(statusNum){
              case type.line_status_offLine :
                  return 'clear'//离线
              case type.line_status_pendding :
                  return 'pause-circle' //待产
              case type.line_status_working :
                  return 'play-circle'//在产
              case type.line_status_stop :
                  return 'stop-circle'//停机
              default:
                break
              }
          },
           //处理运行状态ICON图片颜色
          handleLineStatusIconColor(statusNum){
            switch(statusNum){
              case type.line_status_offLine :
                  return '#f44'//离线#ff976a
              case type.line_status_pendding :
                  return '#1989fa' //待产
              case type.line_status_working :
                  return '#07c160'//在产
              case type.line_status_stop :
                  return '#f44'//停机
             default:
                    break
              }
          },
          //过滤生产线 BY 购买条数 //剩余可用产线数据
          filterLine(itemList){
              let _self=this
              let myPayLines = []
              for (const chargeItem of this.myChargeListDetail) {
                   myPayLines.push(Number(chargeItem.custLineId))
              }
              let afterData = itemList.filter(item=>{
                  return myPayLines.indexOf(Number(item.LineID)) ==-1 ? false :true
              })
              return afterData
          },
          //获取生产数据列表
          GetLineList(){
            let _self=this
            let params = {}
            this.$store.dispatch('getGoodsList_actions',params).then(res=>{
              //debugger
              let currentData =[...res]
                
              //console.warn(JSON.stringify(currentData))
              _self.tableData = _self.filterLine(currentData) 
              if(_self.tableData.length>0){
                    this.currentIndex = _self.tableData[0].LineID
                    this.GetLineDetailList(_self.tableData[0].LineID)
              }
            
            }).catch(err=>{
              //debugger
              this.$toast('获取生产数据列表失败：'+err);
            })
          },
           //获取生产详细数据列表
          GetLineDetailList(line){
            let params = {
              line
            }
            this.$store.dispatch('getGoodsDetail_actions',params).then(res=>{
              //debugger
              let currentData =[...res]
              this.tableDataDetail = currentData

            }).catch(err=>{
              //debugger
               this.$toast('获取生产详细数据列表失败：'+err);
            })
          },
          zeptoSetCss(){
            //debugger
         // $('#dataTableLine .table-title').css('font-size','20px')
         //  console.warn($('.v-table-body-cell').css('line-height','20px!important'));
          // console.warn($('.v-table-row').css('font-size','20px'));
          }
   },
   computed:{
     tableHeight(){
        // return this.dataWindowH - 100;
       if(isApp){
           return window.api.winHeight - 160;
       }else
       {
          return this.dataWindowH - 100;
       
       }

    
     }
   },
   mounted(){
       this.getChargeListDetail()
       this.GetLineList()
       let _selt =this
        window.addEventListener("orientationchange", function() {
          //监听横屏事件
         // this.dataWindowH =
       })
       if(isApp){
         this.virtualMarginHeight ='126px'
         this.resizeOffset=-1
       }
       this.$refs.dataTableDetail.resize()
        //设置样式
       // let header = $api.byId('dataTable');
       this.$nextTick(()=>{
           // this.zeptoSetCss() //设置样式
       })
      
       
   }

}
</script>

<style >
#dataTableLine .v-table-body-cell{
  line-height: 13px !important;
}
#dataTableDetail .v-table-body-cell{
  line-height: 40px !important;
}
body{
  width: 100%;
  position: absolute;
  height: 100%;
}
#app {
  text-align: center;
  
  /* font-size: 12px; */
}
#lineData{
font-size: 12px;
}
 .vanTabs{
   position: fixed;
   left:0px;
   top:40px;
   width: 100%;
   z-index: 999;
 }
 .van-tab .van-icon {
    margin-right: 5px;
    vertical-align: -2px;
  }
  .van-tab__pane {
    padding: 5px 0px;
    background-color: #fff;
  }
  .van-tabs--card .van-tab__pane {
    background-color: transparent;
  }
  .v-table-rightview {
    right: -1px;  /*覆盖原有样式，解决表头最右侧有1px的间隙 */
}
.table-title{
  color: #fff;
}

 
</style>


