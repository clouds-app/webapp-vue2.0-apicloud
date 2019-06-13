<template>
  <div id="app">
      <NavBar title="生产数据"/>
         <van-tabs >
            <van-tab v-for="(item) in tableData" :key="item.LineID" > 
               <div slot="title">
                  <van-icon :name="handleLineStatusIcon(item.LineStatus)" 
                  :color="handleLineStatusIconColor(item.LineStatus)"/>
                  {{`第 ${item.LineID} 线(${handleLineStatus(item.LineStatus)})`}}
                </div>
              <div class="dataTable">
                  <v-table
                  :width="tableWidth"
                  :columns="columns"
                  :table-data="getDataByLine(item.LineID)"
                  :show-vertical-border="true">
                  </v-table>
             </div>

              <div class="dataTableDetail">
                  <v-table
                  :width="tableWidth"
                  :columns="columnsDetail"
                  :table-data="getDataDetailByLine(item.LineID)"
                  :show-vertical-border="false">
                  </v-table>
             </div>

            </van-tab>
        </van-tabs>
       

      <!-- <Footer></Footer> -->
   
  </div>
</template>

<script>
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import LoginForm from '_c/login-form'
import axios from 'axios'
import * as type from '@/enums'
import Footer from '@/components/footer'
export default {
  name: 'home',
  mixins:[base_mixin],
  components:{
    Footer,NavBar,LoginForm
  },
   data() {
            return {
                 tableWidth:window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                 tableData: [],//生产数据列表
                 tableDataDetail:[],//生产详细数据列表
                 columns: [
                    {field: 'LineID', title:'线别名称', width: 150, titleAlign: 'center',columnAlign:'center',isFrozen: true},
                    {field: 'ClassBadArea', title:'本班不良面积(平方米)', width: 220, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ClassBadLength', title: '本班不良米数(mm)', width: 220, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ClassBadQty', title: '本班不良张数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ClassBreakCount', title: '本班停车次数',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ClassBreakTime', title:'本班停车时间 秒(s)', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ClassGoodArea', title: '本班良品面积(平方米)', width: 220, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ClassGoodLength', title: '本班已产良品米数(mm)', width: 220, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ClassID', title: '当前班别',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ClassProdTime', title:'本班生产时间', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ClassQty', title: '本班已产张数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ClassStartTime', title: '当班开始时间', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CurBadQty', title: '上刀不良品数',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CurBreakCount', title:'本笔停车次数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CurBreakTime', title: '本笔停车时间 秒(s)', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CurLoBadQty', title: '下刀不良品数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CurLoQty', title: '下刀已生产数',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CurProdTime', title:'本笔生产时间(s)', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CurQty', title: '上刀已生产数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CurStartTime', title: '本笔开始时间', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'IsDblCut', title: '是否双刀',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LineStatus', title: '当前状态', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'MachineIDString', title: '产线楞型', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'PrimaryKey', title: '本笔订单主键', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'SetAvgSpeed', title:'设定平均车速', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'Speed_A', title: 'A糊机车速0.1m/S', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'Speed_B', title: 'B糊机车速0.1m/S', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'Speed_C', title: 'C糊机车速0.1m/S', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'Speed_D', title: 'D糊机车速0.1m/S', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'Speed_E', title: 'E糊机车速0.1m/S', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'Speed_H', title: '热板车速0.1m/S', width: 150, titleAlign: 'center',columnAlign:'right'},
                    ],

                  columnsDetail: [ 
                    {field: 'PrimaryKey', title:'订单唯一识别码', width: 150, titleAlign: 'center',columnAlign:'center',isFrozen: true},
                    {field: 'OrderStatus', title:'订单状态', width: 220, titleAlign: 'center',columnAlign:'right'},
                    {field: 'EditFlag', title: '订单修改状态', width: 220, titleAlign: 'center',columnAlign:'right'},
                    {field: 'TotalWidthmm', title: '用纸幅宽 单位:mm', width: 150, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ArtID', title: '纸质编号',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtLB', title:'楞别', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtD', title: '糊机用纸代号', width: 220, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtDDesc', title: '糊机用纸描述', width: 220, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtBF', title: '坑机一芯用纸代号',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtBFDesc', title:'坑机一芯用纸描述', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtBB', title: '坑机一底用纸代号', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtBBDesc', title: '坑机一底用纸描述', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtCF', title: '坑机二芯用纸代号',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtCFDesc', title:'坑机二芯用纸描述', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtCB', title: '坑机二底用纸代号', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtCBDesc', title: '坑机二底用纸描述', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtAF', title: '坑机三芯用纸代号',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtAFDesc', title:'坑机三芯用纸描述', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtAB', title: '坑机三底用纸代号', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtABDesc', title: '坑机三底用纸描述', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtEF', title: '坑机四芯用纸代号',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtEFDesc', title: '坑机四芯用纸描述', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtEB', title: '坑机四底用纸代号', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ArtEBDesc', title: '坑机四底用纸描述', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CutBorder', title:'总修边量 单位:mm', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'OrderNo', title: '上刀订单编号', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CustID', title: '上刀客户号', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CustName', title: '上刀客户名', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'OrderWidthmm', title: '上刀毫米幅宽', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'OrderLengthmm', title: '上刀毫米切长', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'OrderQty', title: '上刀订单数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    
                    // {field: 'Cut', title:'上刀开数', width: 150, titleAlign: 'center',columnAlign:'center'},
                    // {field: 'Kun', title:'上刀张捆数', width: 220, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ScorType', title: '上刀压线类型', width: 220, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ScorStr', title: '上刀压线数据', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LimitedSpeed', title: '上刀限速 单位:m/Min',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CustPO', title:'上刀客户PO号', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CODate', title: '上刀订货日期', width: 220, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'DueDate', title: '上刀交货日期', width: 220, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CSizeW', title: '上刀客方幅宽',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CSizeL', title:'上刀客方切长', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'UnitW', title: '上刀客户幅宽单位制', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'UnitL', title: '上刀客户切长单位制', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'Remark', title: '上刀生产备注',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ProdQty', title:'上刀排产小片数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ProductArea', title: '上刀成品区间', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'DRemark', title: '上刀送货备注', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'IsPrepScor', title: '上刀是否预压',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'CWKun', title:'坑机三芯用纸描述', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoOrderNo', title: '下刀订单编号', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoCustID', title: '下刀客户号', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoCustName', title: '下刀客户名',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoOrderWidthmm', title: '下刀毫米幅宽', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoOrderLengthmm', title: '下刀毫米切长', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoOrderQty', title: '下刀订单数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoCut', title:'下刀开数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoKun', title: '下刀张捆数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoScorType', title: '下刀压线类型', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoScorStr', title: '下刀压线数据', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoLimitedSpeed', title: '下刀限速 单位:m/Min', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoCustPO', title: '下刀客户PO号', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoCODate', title: '下刀订货日期', width: 150, titleAlign: 'center',columnAlign:'right'},

                     // {field: 'LoDueDate', title: '下刀交货日期', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoCSizeW', title: '下刀客方幅宽', width: 260, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoCSizeL', title: '下刀客方切长',width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoUnitW', title: '下刀客户幅宽单位制', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoUnitL', title: '下刀客户切长单位制', width: 150, titleAlign: 'center',columnAlign:'right'},
                    
                    // {field: 'LoRemark', title: '下刀生产备注', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoProdQty', title:'下刀排产小片数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoProductArea', title: '下刀成品区间', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoDRemark', title: '下刀送货备注', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoIsPrepScor', title: '下刀是否预压', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'LoCWKun', title: '下刀错位捆张数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'SlitCutSelection', title: '纵切选择', width: 150, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'ManualScorStr', title: '用户指定分压规格', width: 150, titleAlign: 'center',columnAlign:'right'},
                  ]
            }
        },
   methods:{
          //tab切换获取对应的生产数据
          getDataByLine(lineId){
            //debugger
              alert(lineId)
              let tempTableData = [...this.tableData]
              let currentLineData = tempTableData.filter(item=>{
                    return item.LineID+"" == lineId
              })
              //获取生成详细数据列表
              //this.GetLineDetailList(lineId) 
              return currentLineData
          },
           //tab切换获取对应的生产数据详细
          getDataDetailByLine(lineId){
              //debugger
              let tempTableData = [...this.tableData]
              let currentLineData = tempTableData.filter(item=>{
                    return item.LineID+"" == lineId
              })
              return currentLineData
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
                  return 'question'//离线
              case type.line_status_pendding :
                  return 'checked' //待产
              case type.line_status_working :
                  return 'checked'//在产
              case type.line_status_stop :
                  return 'clear'//停机
              }
          },
           //处理运行状态ICON图片颜色
          handleLineStatusIconColor(statusNum){
            switch(statusNum){
              case type.line_status_offLine :
                  return '#ff976a'//离线
              case type.line_status_pendding :
                  return '#1989fa' //待产
              case type.line_status_working :
                  return '#07c160'//在产
              case type.line_status_stop :
                  return '#f44'//停机
              }
          },
          //获取生产数据列表
          GetLineList(){
            let params = {}
            this.$store.dispatch('getGoodsList_actions',params).then(res=>{
              //debugger
              let currentData =[...res]
              this.tableData = currentData

            }).catch(err=>{
              debugger
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
              debugger
            })
          }
   },
   mounted(){
       this.GetLineList()

   }

}
</script>
<style>
#app {
  text-align: center;
}

 .van-tab .van-icon {
    margin-right: 5px;
    vertical-align: -2px;
  }
  .van-tab__pane {
    /* //margin: 5px 10px; */
    padding: 5px 0px;
    background-color: #fff;
  }
  .van-tabs--card .van-tab__pane {
    background-color: transparent;
  }
  .dataTableDetail{
    margin-top: 10px;
  }
</style>

