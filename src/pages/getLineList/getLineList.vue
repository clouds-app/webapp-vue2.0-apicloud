<template>
  <div id="app">
      <NavBar title="生产数据"/>
      <div style="position: fixed;top: 60px;">
             <van-tabs @click="getDataDetailByLine">
                  <van-tab 
                    v-for="index in tableData"
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
                        :width="tableWidth"
                        :columns="columns"
                        :table-data="getDataByLine(index.LineID)"
                        :show-vertical-border="true">
                        </v-table>
                    </div>
                </van-tab>
        </van-tabs>
       </div>
       <div style="width:100%;height:118px;">
         
       </div>
        
      <div class="dataTableDetail">
                        <!-- <virtual-list :size="60" :remain="8"> -->
                            <v-table
                             :height="tableHeight"
                            :width="tableWidth"
                            :columns="columnsDetail"
                            :table-data="tableDataDetail"
                            :show-vertical-border="true"
                            even-bg-color="#f4f4f4"
                            row-hover-color="#eee"
                            row-click-color="#edf7ff"

                            >
                            </v-table>
                          <!-- </virtual-list> -->
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
                 tableWidth:window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                 tableData: [],
                 tableDataDetail:[],
                 columns: [
                    {field: 'LineID', title:'线别名称', width: 150, titleAlign: 'center',columnAlign:'center',isFrozen: true},
                    {field: 'ClassBadArea', title:'本班不良面积(平方米)', width: 220, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ClassBadLength', title: '本班不良米数(mm)', width: 220, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ClassBadQty', title: '本班不良张数', width: 150, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ClassBreakCount', title: '本班停车次数',width: 150, titleAlign: 'center',columnAlign:'right'},
             
                    ],

                  columnsDetail:[ 
                    // {field: 'PrimaryKey', title:'订单唯一识别码', width: 150, titleAlign: 'center',columnAlign:'center',isFrozen: true},
                    // {field: 'OrderStatus', title:'订单状态', width: 220, titleAlign: 'center',columnAlign:'right'},
                    // {field: 'EditFlag', title: '订单修改状态', width: 220, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ArtID', title: '纸质编号',width: 150, titleAlign: 'center',columnAlign:'right',isFrozen: true},
                    {field: 'TotalWidthmm', title: '用纸幅宽 单位:mm', width: 150, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ArtLB', title:'楞别', width: 260, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ArtD', title: '糊机用纸代号', width: 220, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ArtDDesc', title: '糊机用纸描述', width: 220, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ArtBF', title: '坑机一芯用纸代号',width: 150, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ArtBFDesc', title:'坑机一芯用纸描述', width: 260, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ArtBB', title: '坑机一底用纸代号', width: 150, titleAlign: 'center',columnAlign:'right'},
                    {field: 'ArtBBDesc', title: '坑机一底用纸描述', width: 260, titleAlign: 'center',columnAlign:'right'},
                    ]
            }
        },
   methods:{
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
               this.GetLineDetailList(currentData[0].LineID)
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
   computed:{
     tableHeight(){
       if(isApp){
           return window.api.winHeight - 220;
       }else
       {
          return document.body.clientHeight - 220;
       }

    
     }
   },
   mounted(){
       this.GetLineList()

   }

}
</script>
<style>
body{
  width: 100%;
  position: absolute;
  height: 100%;
}
#app {
  text-align: center;
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

