<template>
  <div id="app" v-cloak>
      <div id="lineData" >
       
        <NavBar title="生产数据" :isHideTitleAndArrow="false" :offSetHight="true">
          <div >
              <van-tabs @click="getDataDetailByLine">
                    <van-tab 
                      v-for="(index) in tableData"
                      :title="index.LineID"
                      :key="index.LineID"
                    >
                    <div slot="title" >
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
         <!-- 本笔尚缺：{{CurleftQty}} -->
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
import {dataAdd,dataDiff} from '@/libs/tools'
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
                 NewTotalCurQty:0,//本笔总数
                 detailFirstPrimaryKey:'',//详细中第一个PrimaryKey
                 mainCutQty :0,//主刀已生产数
                 allTotalLength:0,
                 CurleftQty:0,//本笔尚缺
                 CurrentLineDetailItem:{},
                 currentTipIndex : 0,
                 currentTipPrimaryKey:'',
                 currentAvgSpeed:120, //设定平均车速， 用来计算预估完工时间
                 setDoneTime : 0, //本班预设完工时间 /秒
                 setCurDoneTime : 0, //本笔预设完工时间 /秒
                 scroll: 0, //当前滚动条位置
                 timer: null, //定时器
                 timerValue: 0,//测试 定时器
                 myChargeListDetail:{},
                 resizeOffset:1,
                 virtualMarginHeight:'126px', //区分真机和网页的不兼容问题
                 dataWindowH: window.innerHeight || document.body.clientHeight,
                 currentIndex:1,//默认查询详细线别LineId
                 tableWidth:window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                 tableData: [],
                 tableDataDetail:[],
                 columns: [
                  
                    {field: 'LineID', title:'订单', width: 36, titleAlign: 'center',columnAlign:'center',
                     formatter: function (rowData, index) {
                               if(rowData.IsDblCut=='0'){
                                 return `<span style="color:green;font-weight: bold;">本班</span><br/><span style="font-weight: bold;">本笔</span>`
                               }else{
                                   return '<span style="color:green;font-weight: bold;">本班</span><br/><span style="font-weight: bold;">上刀</span><br/><span style="font-weight: bold;">下刀</span>'
                               } 
                        },isFrozen: true},

                    {field: 'LineID', title:'总数', width: 100, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                       if(rowData.IsDblCut=='0'){
                         let NewTotalCurQty =0
                         if(!!rowData.NewTotalCurQty){
                            NewTotalCurQty =rowData.NewTotalCurQty
                         }
                          return '<span style="color:green;font-weight: bold;">' + ((Number(rowData.ClassGoodLength)+Number(rowData.ClassBadLength))/1000).toFixed(0) + '米</span><br/><span style="font-weight: bold;">' + (NewTotalCurQty)+ '张</span>'
                       }else{
                          return '<span style="color:green;font-weight: bold;">' + ((Number(rowData.ClassGoodLength)+Number(rowData.ClassBadLength))/1000).toFixed(0) + '米</span><br/><span style="font-weight: bold;">' + (Number(rowData.CurQty)+Number(rowData.CurBadQty))+ '张</span><br/><span style="font-weight: bold;">' + (Number(rowData.CurLoQty)+Number(rowData.CurLoBadQty))+ '张</span>'
                       }
                            
                        },isFrozen: true},
                    {field: 'ClassQty', title:'良品', width: 60, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            if(rowData.IsDblCut=='0'){
                                 return '<span style="color:green;font-weight: bold;">' + (Number(rowData.ClassGoodLength)/1000).toFixed(0)+ '米</span><br/><span style="font-weight: bold;">' + (rowData.CurQty) + '张</span>'
                            }else{
                                 return '<span style="color:green;font-weight: bold;">' +(Number(rowData.ClassGoodLength)/1000).toFixed(0) + '米</span><br/><span style="font-weight: bold;">' + (rowData.CurQty) + '张</span><br/><span style="font-weight: bold;">' + (rowData.CurLoQty) + '张</span>'
                            }
                         
                        }
                    },
                    {field: 'ClassBadQty', title: '不良', width: 60, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                         if(rowData.IsDblCut=='0'){
                            return '<span style="color:green;font-weight: bold;">' + (Number(rowData.ClassBadLength)/1000).toFixed(0) + '米</span><br/><span style="font-weight: bold;">' + (rowData.CurBadQty) + '张</span>'
                         }else{
                            return '<span style="color:green;font-weight: bold;">' + (Number(rowData.ClassBadLength)/1000).toFixed(0) + '米</span><br/><span style="font-weight: bold;">' + (rowData.CurBadQty) + '张</span><br/><span style="font-weight: bold;">' + (rowData.CurLoBadQty) + '张</span>'
                         }
                           
                        }
                    },
                      {field: 'ClassBadQty', title: '不良%', width: 60, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                         if(rowData.IsDblCut=='0'){
                            //本班 
                            let notGoodTotal =(Number(rowData.ClassBadLength)/1000).toFixed(0)
                            let goodTotal = ((Number(rowData.ClassGoodLength)+Number(rowData.ClassBadLength))/1000).toFixed(0) 
                            let notGoodPersent = ((notGoodTotal/goodTotal)*100).toFixed(2)

                            //本笔
                            let NewTotalCurQty =0
                            if(!!rowData.NewTotalCurQty){
                                NewTotalCurQty =rowData.NewTotalCurQty
                            }
                            let loNotGoodTotal =rowData.CurBadQty
                            let loNotGoodPersent = ((loNotGoodTotal/NewTotalCurQty)*100).toFixed(2)
                         
                            return '<span style="color:green;font-weight: bold;">' + notGoodPersent + '</span><br/><span style="font-weight: bold;">' + (loNotGoodPersent) + '</span>'
                         }else{
                            return '<span style="color:green;font-weight: bold;">' + (Number(rowData.ClassBadLength)/1000).toFixed(0) + '</span><br/><span style="font-weight: bold;">' + (rowData.CurBadQty) + '</span><br/><span style="font-weight: bold;">' + (rowData.CurLoBadQty) + '</span>'
                         }
                           
                        }
                    },
                    // {field: 'ClassGoodLength', title:'良品米数', width: 40, titleAlign: 'center',columnAlign:'right',
                    //  formatter: function (rowData, index) {
                    //         return '<span style="color:green;font-weight: bold;">' + (rowData.ClassGoodLength) + '</span><br/><span style="font-weight: bold;">' + '</span>'
                    //     }
                    // },
                    // {field: 'ClassBadLength', title:'不良米数', width: 40, titleAlign: 'center',columnAlign:'right',
                    //  formatter: function (rowData, index) {
                    //         return '<span style="color:green;font-weight: bold;">' + (rowData.ClassBadLength) + '</span><br/><span style="font-weight: bold;">'  + '</span>'
                    //     }
                    // },
                    {field: 'ClassGoodArea', title: '面积(㎡)', width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            let tempArea =(Number(rowData.ClassGoodArea)+Number(rowData.ClassBadArea))/100
                           // console.log(rowData.ClassGoodArea,rowData.ClassBadArea,tempArea)
                            return '<span style="color:green;font-weight: bold;">' +tempArea.toFixed(0) + '</span><br/><span style="font-weight: bold;">'  + '</span>'
                        }
                    },
                    // {field: 'ClassBadArea', title: '不良面积(㎡)',width: 58, titleAlign: 'center',columnAlign:'right',
                    //  formatter: function (rowData, index) {

                    //         return '<span style="color:green;font-weight: bold;">' + (rowData.ClassBadArea) + '</span><br/><span style="font-weight: bold;">'  + '</span>'
                    //     }
                    // },
                   
                    {field: 'ClassProdTime', title: '产时',width: 80, titleAlign: 'center',columnAlign:'right',
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
                                if(parseInt(secondTime)<10){
                                    result = "0" + parseInt(secondTime);
                                }
                                if(minuteTime > 0) {
                                     if(parseInt(minuteTime)<10)
                                     {
                                        result = "" + "0"+parseInt(minuteTime) + ":" + result;
                                     }else{
                                        result = "" + parseInt(minuteTime) + ":" + result;
                                     }

                                }else{
                                  result = "00"  +":" + result;
                                }
                                if(hourTime > 0) {
                                  result = "" + parseInt(hourTime) + ":" + result;
                                }else{
                                   result = "0"+ ":" + result;
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
                    {field: 'ClassBreakTime', title: '停时',width: 80, titleAlign: 'center',columnAlign:'right',
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
                                if(parseInt(secondTime)<10){
                                    result = "0" + parseInt(secondTime);
                                }
                                if(minuteTime > 0) {
                                     if(parseInt(minuteTime)<10)
                                     {
                                        result = "" + "0"+parseInt(minuteTime) + ":" + result;
                                     }else{
                                        result = "" + parseInt(minuteTime) + ":" + result;
                                     }

                                }else{
                                  result = "00"  +":" + result;
                                }
                                if(hourTime > 0) {
                                  result = "" + parseInt(hourTime) + ":" + result;
                                }else{
                                   result = "0"+ ":" + result;
                                }
                                
                                return result;
                            }
                            return '<span style="color:green;font-weight: bold;">' + formatSeconds(rowData.ClassBreakTime) + '</span><br/><span style="font-weight: bold;">' + formatSeconds(rowData.CurBreakTime) + '</span>'
                        }
                    },
                    {field: 'ClassBadLength', title:'尚缺', width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                          let leftCurQty = rowData.CurQty
                          if(!!rowData.NewTotalCurQty){
                              leftCurQty =Number(rowData.NewTotalCurQty) - Number(rowData.CurQty) 
                          }

                            return '<span style="color:green;font-weight: bold;">'  + '米</span><br/><span style="font-weight: bold;">'  +(leftCurQty)+ '张</span>'
                        }
                    },
                    {field: 'ClassProdTime', title: '预估完工',width: 70, titleAlign: 'center',columnAlign:'right',isResize:true,
                     formatter: function (rowData, index) {
                            let classDoneTime = 0
                            let curDoneTime =0
                            if(!!rowData.setDoneTime){
                              classDoneTime =rowData.setDoneTime
                            }
                            if(!!rowData.curDoneTime){
                              curDoneTime =rowData.curDoneTime
                            }
                            return '<span style="color:green;font-weight: bold;">' + (classDoneTime) + '</span><br/><span style="font-weight: bold;">' + (curDoneTime) + '</span>'
                        }
                    },
                     {field: 'ClassProdTime', title: '车速',width: 70, titleAlign: 'center',columnAlign:'right',isResize:true,
                     formatter: function (rowData, index) {
                            return '<div style="line-height: 40px !important;"><span style="color:blue;font-weight: bold;">' + (Number(rowData.Speed_H))/10 + '</span></div>'
                        }
                    },
                     //样式控制 Line-heigh 是否双刀
                      {field: 'LineID', title:'', width: 0.1, 
                     formatter: function (rowData, index) {
                         if(rowData.IsDblCut=='0'){
                            return '<style>#dataTableLine .v-table-body-cell{line-height: 20px !important;}</style >'
                         }else
                         {
                            return '<style>#dataTableLine .v-table-body-cell{line-height: 13px !important;}</style >'
                         }
                            
                        }},
                    ],

             

                  columnsDetail:[ 
                     {field: 'OrderNo', title: '订单号', width: 80, titleAlign: 'center',columnAlign:'center',isFrozen: true,
                     formatter: function (rowData, index) {
                          if(rowData.LoOrderNo!=''){
                               return '<span>' + (rowData.OrderNo) + '</span><br/><span>' + (rowData.LoOrderNo) + '</span>'
                           }else{
                              return '<span>' + (rowData.OrderNo) + '</span>'
                           }
                          
                        }
                        },
                      {field: 'CustName', title:'客户名称', width: 80, titleAlign: 'center',columnAlign:'left',isResize:true,
                     formatter: function (rowData, index) {
                           if(rowData.LoOrderNo!=''){
                              return '<span>' + (rowData.CustName) + '</span><br/><span>' + (rowData.LoCustName) + '</span>'
                           }else{
                              return '<span>' + (rowData.CustName) + '</span>'
                           }
                          
                        }},
 
                    {field: 'ArtID', title: '纸质', width: 40, titleAlign: 'center',columnAlign:'left',isResize:true,
                     formatter: function (rowData, index) {
                            if(rowData.LoOrderNo!=''){
                               return '<span>' + (rowData.ArtID)+'('+ (rowData.ArtLB)+ ')' + '</span><br/><span>' + (rowData.ArtLB) + '</span>'
                           }else{
                              return '<span>' + (rowData.ArtID) +'('+ (rowData.ArtLB)+ ')'+ '</span>'
                           }
                          
                        }},
                    // {field: 'ArtLB', title: '楞别', width: 40, titleAlign: 'center',columnAlign:'center',
                    //  formatter: function (rowData, index) {
                    //        if(rowData.LoOrderNo!=''){
                    //          return '<span>' + (rowData.ArtLB) + '</span><br/><span>' + (rowData.ArtLB) + '</span>'
                    //        }else{
                    //           return '<span>' + (rowData.ArtLB) + '</span>'
                    //        }
                            
                    //     }
                    // },
                    {field: 'CSizeW', title: '规格',width: 66, titleAlign: 'center',columnAlign:'center',isResize:true,
                      formatter: function (rowData, index) {
                          if(rowData.LoOrderNo!=''){
                             return '<span>' + (rowData.CSizeW) + '</span> * <span>' + (rowData.CSizeL) + '</span><br/><span>' + (rowData.LoCSizeW) + '</span> * <span>' + (rowData.LoCSizeL) + '</span>'
                           }else{
                             return '<span>' + (rowData.CSizeW) + '</span> * <span>' + (rowData.CSizeL) + '</span>'
                           }
                            
                        }
                    },
                   
                    {field: 'OrderQty', title: '数量', width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                         if(rowData.LoOrderNo!=''){
                            return '<span>' + (rowData.OrderQty) + '</span><br/><span>' + (rowData.LoOrderQty) + '</span>'
                           }else{
                             return '<span>' + (rowData.OrderQty) + '</span>'
                           }
                           
                        }},
                      {field: 'TotalWidthmm', title: '门幅',width: 40, titleAlign: 'center',columnAlign:'center',
                     formatter: function (rowData, index) {
                            if(rowData.LoOrderNo!=''){
                                return '<span>' + (rowData.TotalWidthmm) + '</span><br/><span>' + (rowData.TotalWidthmm) + '</span>'
                           }else{
                               return '<span>' + (rowData.TotalWidthmm) + '</span>'
                           }
                         
                        }},
                    {field: 'Cut', title: '剖', width: 30, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                         if(rowData.LoOrderNo!=''){
                            return '<span>' + (rowData.Cut) + '</span><br/><span>' + (rowData.LoCut) + '</span>'
                           }else{
                              return '<span>' + (rowData.Cut) + '</span>'
                           }
                          
                        }},
                    {field: 'Cut', title: '完工时间', width: 50, titleAlign: 'center',columnAlign:'right',isResize:true,
                     formatter: function (rowData, index) {
                          let curDoneTime =0
                          if(!!rowData.curDoneTime){
                             curDoneTime = rowData.curDoneTime
                          }
                         if(rowData.LoOrderNo!=''){
                              return '<span>' + (curDoneTime) + '</span><br/><span>' + (rowData.LoCut) + '</span>'
                           }else{
                              return '<span>' + (curDoneTime) + '</span>'
                           }
                          
                        }
                        },
                    {field: 'Cut', title: '总长', width: 50, titleAlign: 'center',columnAlign:'right',isResize:true,
                     formatter: function (rowData, index) {
                         if(rowData.LoOrderNo!=''){
                               return '<span>' +  (Number(rowData.MainCutLen)/1000).toFixed(0) + '</span><br/><span>' + NumberN((rowData.LoCut)/1000).toFixed(0) + '</span>'
                           }else{
                             return '<span>' + (Number(rowData.MainCutLen)/1000).toFixed(0) + '</span>'
                           }
                           
                        }
                    },
                  
                      {field: 'OrderNo', title: '样式设置', width: 0.1,
                     formatter: function (rowData, index) {
                          if(rowData.LoOrderNo!=''){
                                return '<style>#dataTableDetail .v-table-body-cell{line-height: 20px !important;}</style >'
                           }else{
                               return '<style>#dataTableDetail .v-table-body-cell{line-height: 40px !important;}</style >'
                           }
                          
                        }
                        },
                    ]
            }
        },
   activated(){
        //在vue对象存活的情况下，进入当前存在activated()函数的页面时，一进入页面就触发；可用于初始化页面数据等
       // this.$refs.wrapper.scrollTop = this.scroll
      //  console.log('开始定时...每过6秒执行一次')
        },
   methods:{
         formatDateTime(value){
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
                                if(parseInt(secondTime)<10){
                                    result = "0" + parseInt(secondTime);
                                }
                                if(minuteTime > 0) {
                                     if(parseInt(minuteTime)<10)
                                     {
                                        result = "" + "0"+parseInt(minuteTime) + ":" + result;
                                     }else{
                                        result = "" + parseInt(minuteTime) + ":" + result;
                                     }

                                }else{
                                  result = "00"  +":" + result;
                                }
                                if(hourTime > 0) {
                                  result = "" + parseInt(hourTime) + ":" + result;
                                }else{
                                   result = "0"+ ":" + result;
                                }
                                
                                return result;
                               
         },
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
            //  if(lineId==undefined){
            //     return
            //  }
            let showItem =this.myChargeListDetail.filter(item=>{
                  return item.custLineId ==lineId
                })
                return showItem[0].lineId
            
          },
          //设置class
          columnCellClass(rowIndex,columnName,rowData){
            
                if (rowIndex === 0 && columnName==='ClassProdTime'){
                  //  return 'column-cell-class-name-test';
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
            //debugger
            this.currentTipIndex = index
            this.$toast(`第 ${key} 线`);
            this.currentIndex = key
            this.getDataLinePrimaryKey(key)
            this.GetLineDetailList(key)
          },
          //获取速度和PrimaryKey
          getDataLinePrimaryKey(lineId){
             //debugger
             let currentLineItem = this.getDataByLine(lineId)
             this.currentTipPrimaryKey = currentLineItem[0].PrimaryKey
             this.currentAvgSpeed = currentLineItem[0].SetAvgSpeed ////设定平均车速， 用来计算预估完工时间
             if( this.currentAvgSpeed <=0){
                this.currentAvgSpeed = 120
             }
             this.addDoneTime(this.setDoneTime)
          },
          //获取当前tab 
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
          GetLineList(timer){
            // this.timerValue++
           // console.log('item...每过2秒执行一次'+this.timerValue)
            let _self=this
            let params = {
              timer
            }
            this.$store.dispatch('getGoodsList_actions',params).then(res=>{
             // debugger
              let currentData =[...res]
             
              //console.warn(JSON.stringify(currentData))
              _self.tableData = _self.filterLine(currentData) 
              if(_self.tableData.length>0){

                    if(timer!="" && timer!=null){
                           if((_self.timerValue==15 || _self.timerValue >15)){
                                //console.log('详细...每过30秒执行一次'+_self.timerValue)
                                _self.timerValue = 0
                                _self.GetLineDetailList(_self.currentIndex,timer) //详细 30秒 更新一次
                           }
                    }
                    else{
                        _self.GetLineDetailList(_self.currentIndex) //详细 30秒 更新一次
                    }
                   _self.getDataLinePrimaryKey(_self.currentIndex)
              }
            
             
            }).catch(err=>{
              //debugger
              //this.$toast('获取生产数据列表失败：'+err);
            })

           
            
            this.addDoneTime(this.setDoneTime)
          },

          //获取预完工时间 = 订单长度 /预设平均车速
          getCrrentOrderDoneTime(itemArray){
              //订单长度
              let item = itemArray
              let _up =item.OrderLengthmm * item.OrderQty //上刀
              let _down =item.LoOrderLengthmm * item.LoOrderQty //下刀
              let speedM = 0
              if(_up>_down){
                 speedM = (_up/1000 / this.currentAvgSpeed)
              }else{
                
                 speedM = (_up/1000 / this.currentAvgSpeed)     
              }
              this.currentAvgSpeed = speedM.toFixed(2)
              return  speedM.toFixed(2)
          },
           //获取生产详细数据列表
          GetLineDetailList(line,timer){
            let params = {
              line,
              timer
            }
            let _self = this
            this.$store.dispatch('getGoodsDetail_actions',params).then(res=>{
             
              let currentData =[...res]
               //debugger
              //延时，因为需要的值比较慢执行
              setTimeout(function(){
                  _self.addDoneTime()
               },300);

              _self.tableDataDetail = currentData

              if(_self.tableDataDetail.length>0){
                  _self.getClassDoneTime(_self.tableDataDetail)
              }
            
            }).catch(err=>{
              //debugger
               _self.$toast('获取生产详细数据列表失败：'+err);
            })
          },
          //获取本班预计完工时间 tableDetailList 为详细数
          getClassDoneTime(tableDetailList){
               this.allTotalLength = 0
           // debugger
                for(let i =0;i<tableDetailList.length;i++){
                    //第一个
                    if(tableDetailList[i].PrimaryKey == this.currentTipPrimaryKey){
                      // debugger
                        let mainCutLen = this.getMainCutlen(tableDetailList[i])
                        let tempLen = (Number(tableDetailList[i].MainCutLen) - Number(mainCutLen) * this.mainCutQty) //必须大于 0

                        let leftCutlen = tempLen >0 ? tempLen : 0
                        this.allTotalLength = leftCutlen
                        this.setTotalCurDoneTime(leftCutlen) //设置本笔预计完工时间
                        let firstCurDoneTime  = this.getCurItemDoneTime(leftCutlen)

                        let params ={
                           curDoneTime:firstCurDoneTime
                         }
                         tableDetailList[i] = Object.assign({}, tableDetailList[i], params) //设置本笔 正在生产中ITEM 完工时间 
                      
                    }
                    else{
                        //剩余总长  
                         this.allTotalLength = this.allTotalLength + Number(tableDetailList[i].MainCutLen)
                         let curDoneTime = this.getCurItemDoneTime(this.allTotalLength) 
                         let params ={
                           curDoneTime
                         }
                         tableDetailList[i] = Object.assign({}, tableDetailList[i], params) //设置本笔ITEM 完工时间 curDoneTime
                       
                    }
                  
                }
               // debugger
                //本班预完工时间 =总长（米） / 速度
                let totalDoneTime =((Number(this.allTotalLength) / 1000 / this.currentAvgSpeed) * 60).toFixed(0)
                this.setDoneTime = this.formatDateTime(totalDoneTime)  //转换为时：分：秒


          },
          //设置本笔预计完工时间
          setTotalCurDoneTime(leftCutlen){
              let tempDoneTime = (leftCutlen)*0.06/this.currentAvgSpeed //秒
              this.setCurDoneTime = this.formatDateTime(tempDoneTime)    
          },
          //获取主刀单个长度，设置主刀已生产数
          getMainCutlen(tableDetailItem){
              let mainCutLen = 0
              let _up =Number(tableDetailItem.OrderLengthmm) * Number(tableDetailItem.OrderQty) //上刀
              let _down =Number(tableDetailItem.LoOrderLengthmm) * Number(tableDetailItem.LoOrderQty) //下刀
              if(_up>_down) //获取主刀
               {
                   this.mainCutQty = this.tableData[this.currentTipIndex].CurQty //主刀已生产数
                   mainCutLen =Number(tableDetailItem.OrderLengthmm)
              }else{
                  this.mainCutQty = this.tableData[this.currentTipIndex].CurLoQty
                   mainCutLen =Number(tableDetailItem.LoOrderLengthmm)
              }
              return mainCutLen
          },
          //本笔详细item完工时间 format
          getCurItemDoneTime(mainCutLen){
             //临时变量：本笔item完工时间
            let curItemDonetime = (mainCutLen)*0.06/this.currentAvgSpeed //米/米/分 =>seconds
            let nowDate =new Date()
            let formatDoneTime = dataAdd('s',curItemDonetime,nowDate)
            //console.warn('tempTime:'+formatDoneTime.format("yyyy-MM-dd hh:mm:ss"))
            return  formatDoneTime.format("MM-dd hh:mm")      
          },
          //获取与当前line 相同PrimaryKey的详细数据
           getCurrentLineDetailBy(primaryKey){
             // debugger
              let currentLineDatailItem ={}
              if(this.tableDataDetail.length ==0){
                return
              }
              for(let i =0;i<this.tableDataDetail.length;i++){
                  let tempKey =this.tableDataDetail[i].PrimaryKey
                 if(tempKey == primaryKey){
                    currentLineDatailItem =this.tableDataDetail[i]
                     i = this.tableDataDetail.length//break
                  }
              }
              //debugger
               this.CurrentLineDetailItem = currentLineDatailItem
               this.NewTotalCurQty =this.CurrentLineDetailItem.OrderQty
               //
               if(this.tableData[this.currentTipIndex] && this.tableData[this.currentTipIndex].CurQty){
                  this.CurleftQty = this.CurrentLineDetailItem.OrderQty - this.tableData[this.currentTipIndex].CurQty
               }
              // console.warn("本笔尚缺："+ this.CurleftQty)
              return currentLineDatailItem
           },
          //添加预设完工时间
          addDoneTime(valueTime){

             this.getClassDoneTime(this.tableDataDetail) //刷新详细数据中的时间

             let newParams ={
                setDoneTime:this.setDoneTime,
                NewTotalCurQty:this.NewTotalCurQty,//本笔总数
                curDoneTime:this.setCurDoneTime  //本笔预计完工时间
              }
              if(valueTime!=null && valueTime!=0){
                newParams.setDoneTime =valueTime
              }else{
                //debugger
                if(this.currentTipPrimaryKey!=""){
                  
                    let currentLineDatailItem =  this.getCurrentLineDetailBy(this.currentTipPrimaryKey)
                    // let willDoneTime =this.getCrrentOrderDoneTime(currentLineDatailItem)
                    // newParams.setDoneTime = willDoneTime
                    // if(willDoneTime ==NaN || willDoneTime ==undefined){
                    //       newParams.setDoneTime =0
                    // }        
                 }else{
                   newParams.setDoneTime =0
                 }
              
              }
               
            this.tableData[this.currentTipIndex] = Object.assign({}, this.tableData[this.currentTipIndex], newParams)
     
            this.tableData = this.tableData.sort()
             //console.warn('this.tableData:' + JSON.stringify(this.tableData))
           
          },
         
        setTimer() { 
                //定时任务
                if(this.timer == null) {
                    let _self = this
                    this.timer = setInterval( () => {
                        //console.log('开始定时...每过2秒执行一次')
                         //定时任务开启-》获取线别数据
                        _self.GetLineList('timerRun')
                        _self.timerValue+=1
                    }, 2000)
                }
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
      
     //  this.$refs.dataTableDetail.resize()
     //this.$refs['dataTableDetail'].resize();
      
       
   },
   created(){
      // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
       clearInterval(this.timer)
       this.timer = null
       this.setTimer()
   },
   beforeDestroy(){
       // 每次离开当前界面时，清除定时器 ，防止内存溢出
         clearInterval(this.timer)
         this.timer = null
   }

}
</script>

<style >
  .title-cell-class-name-test{
        background-color: #f60;
        color:#fff;
    }
    .column-cell-class-name-test{
        background-color: #187;
    }
    .column-cell-class-name-test .v-table-body-cell{
        border-color: #187;
    }
    .column-cell-class-name-test2{
        background-color: #2db7f5;
        font-weight: bold;
    }
    .column-cell-class-name-test2 .v-table-body-cell{
        border-color: #2db7f5;
    }
/* #dataTableLine .v-table-body-cell{
  line-height: 13px !important;
} */
/* #dataTableDetail .v-table-body-cell{
  line-height: 40px !important;
} */
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

[v-cloak] {
    display: none !important;
}
</style>


