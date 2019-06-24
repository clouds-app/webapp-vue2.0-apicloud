<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  watch:{
    value(val){
      if(val){
         console.log('数据变化：...'+val)
        this.initData()
      }
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    //获取图表数据
    getSeriesData(itemList){
      let tempList = []
      for(let item in itemList){
        //车速=生产米数/生产时间     车速单位：米/秒
        let runSpeed = Number.parseFloat(itemList[item].FinishLength)/Number.parseFloat(itemList[item].ProdTime)
       //损耗率=不良面积/良品面积*100    保留两位小数
        let WasteArea =  Number.parseFloat(itemList[item].BadArea)/Number.parseFloat(itemList[item].FinishArea) * 100
        let params = {
                  PDate:itemList[item].PDate,
                  FinishArea:Number.parseFloat(itemList[item].FinishArea),
                  FinishLength:Number.parseFloat(itemList[item].FinishLength),
                  WasteArea:WasteArea,
                  runSpeed:runSpeed,
                  BreakCount:Number.parseFloat(itemList[item].BreakCount),
                  } 
              
         let seriesData = Object.values(params)
         //debugger
         tempList.push(seriesData)
       }
       return tempList
      },
      //获取bar总数
    getSeriesCount(num){
     // debugger
      let seriesArray  = []
      for (var i = 0; i < num; i++) {  
           let series={
              type: 'bar'
            } 
        seriesArray.push(series)
      }  
      return seriesArray
   },
   //初始化数据
   initData(){
       let _self = this
       let tempValue =this.value
       //debugger
       if(tempValue){
            let seriesData = _self.getSeriesData(tempValue)
       console.warn('seriesData'+seriesData)
       let option = {
        legend: {
           align: 'right',
           orient:'vertical',
           itemWidth:30,
           itemHeight:18,
           top:60,
           left:8,
           selectedMode:'single', //单选
           type: 'scroll',
        },
         grid: [
                 {top:40,left:140} //x: '100%', y: '7%', width: '38%', height: '38%',
         ],
        tooltip: {},
        toolbox: {
        },
        dataset: {
            // 提供一份数据。
            dimensions:  ['product', '面积', '米数', '车速','损耗','停次'],
            //dimensions:  ['product', 'LineID','ClassID', 'PDate','FinishArea','BadArea','FinishLength', 'BadLength','FinishWt','BadWt', 'BreakCount','BreakTime','ProdTime', 'BadRate','AvgSpeed'],
            source: seriesData
            // source: [
            //     ['6月1', 43.3, 85.8, 2193.7],
            //     ['6月2', 83.1, 73.4, 55.1],
            //     ['6月3', 86.4, 65.2, 82.5],
            //     ['6月4', 72.4, 53.9, 1239.1],
            //     ['6月5', 72.4, 53.9, 39.1],
            //     ['6月6', 72.4, 353.9, 339.1],
            //     ['6月7', 72.4, 253.9, 39.1],
            //     ['6月8', 43.3, 85.8, 193.7],
            //     ['6月9', 83.1, 73.4, 55.1],
            //     ['6月13', 86.4, 265.2, 1182.5],
            //     ['6月14', 72.4, 253.9, 239.1],
            //     ['6月15', 72.4, 53.9, 39.1],
            //     ['6月16', 72.4, 53.9, 339.1],
            //     ['6月17', 72.4, 53.9, 39.1],
            // ]
        },
        // title: {
        // text: this.text,
        // subtext: this.subtext,
        // x: 'center',
        // y: 0
        // },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: _self.getSeriesCount(5)
    }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
     
   } 
},
  mounted () {
    this.$nextTick(() => {
      this.initData()
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
