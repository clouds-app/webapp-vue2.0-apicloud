<template>
  <div id="app">
      <div id="lineData">
        <!-- <NavBar title="生产数据"> -->
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
                            {{`第 ${index.LineID} 线(${handleLineStatus(index.LineStatus)})`}}
                      </div>
                      <div class="dataTable">
                          <v-table
                          titleBgColor="#1989fa"
                          id="dataTable"
                          ref="dataTable"
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
                              is-vertical-resize
                              :style="`width:100%;`"
                              is-horizontal-resize
                              :vertical-resize-offset='5'
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
                 virtualMarginHeight:'136px', //区分真机和网页的不兼容问题
                 dataWindowH: document.body.clientHeight,
                 currentIndex:0,
                 tableWidth:window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                 tableData: [],
                 tableDataDetail:[],
                 columns: [
                    {field: 'LineID', title:'订单', width: 36, titleAlign: 'center',columnAlign:'center',
                     formatter: function (rowData, index) {
                               return '<span style="color:green;font-weight: bold;">本班</span><br/><span style="font-weight: bold;">本笔</span>'
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
                   
                    {field: 'ClassProdTime', title: '生产时间(s)',width: 80, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            rowData.ClassProdTime = 1000
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassProdTime) + '</span><br/><span style="font-weight: bold;">' + (rowData.CurProdTime) + '</span>'
                        }
                    },
                    {field: 'ClassBreakCount', title: '停车次数',width: 40, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassBreakCount) + '</span><br/><span style="font-weight: bold;">' + (rowData.CurBreakCount) + '</span>'
                        }
                    },
                    {field: 'ClassBreakTime', title: '停车时间(s)',width: 80, titleAlign: 'center',columnAlign:'right',
                     formatter: function (rowData, index) {
                           rowData.ClassBreakTime = 1000
                            return '<span style="color:green;font-weight: bold;">' + (rowData.ClassBreakTime) + '</span><br/><span style="font-weight: bold;">' + (rowData.CurBreakTime) + '</span>'
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
          //设置class
          columnCellClass(rowIndex,columnName,rowData){
              // 给三行column为‘Parts1Material’和‘Parts2Material’的列设置className
              /*根据你自己的cloumn设置*/
              //debugger
              if (columnName==='ClassProdTime'||columnName==='ClassBreakTime'){
               // debugger
                console.log('rowData.ClassBreakTime:'+rowData.ClassBreakTime)
                  this.tableData.ClassBreakTime = this.totalData(rowData.ClassBreakTime)
                   console.log('this.tableData.ClassBreakTime:'+this.tableData.ClassBreakTime)
                //return 'column-cell-class-name-cailiao';//这是你的css名字
              }
          },
         //计算数据合并
          totalData(val1){
              return val1+100
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
          //获取生产数据列表
          GetLineList(){
            let params = {}
            this.$store.dispatch('getGoodsList_actions',params).then(res=>{
              //debugger
              let currentData =[...res]
              //console.warn(JSON.stringify(currentData))
              this.tableData = currentData
               this.currentIndex = currentData[0].LineID
               this.GetLineDetailList(currentData[0].LineID)
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
          }
   },
   computed:{
     tableHeight(){
       if(isApp){
           return window.api.winHeight - 220;
       }else
       {
          return this.dataWindowH - 100;
       }

    
     }
   },
   mounted(){
       this.GetLineList()
       let _selt =this
        window.addEventListener("orientationchange", function() {
          //监听横屏事件
       })
       if(isApp){
         this.virtualMarginHeight ='116px'
       }

   }

}
</script>

<style >
.v-table-body-cell{
  line-height: 20px !important;
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
  /* .dataTable{
      position: fixed;
      left:0px;
      top:50px;
  } */
  .dataTableDetail{
     /* position: fixed;
      left:0px;
      top:50px; */
   
  }
</style>


