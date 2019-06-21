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
         console.log('数据变化：...')
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
         let seriesData = Object.values(itemList[item])
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
      // debugger
       if(tempValue){
            let seriesData = _self.getSeriesData(tempValue)
       
       let option = {
        legend: {
          //  align: 'right',
          //  orient:'vertical',
          //  itemWidth:10,
          //  itemHeight:10,
          //  top:100,
          //  right:5,
          //  selectedMode:'single', //单选
          //  type: 'scroll',
        },
        tooltip: {},
        toolbox: {
        },
        dataset: {
            // 提供一份数据。
            dimensions:  ['product', '面积', '米速', '车速'],
            //dimensions:  ['product', 'LineID','ClassID', 'PDate','FinishArea','BadArea','FinishLength', 'BadLength','FinishWt','BadWt', 'BreakCount','BreakTime','ProdTime', 'BadRate','AvgSpeed'],
            source: seriesData
        },
        title: {
        text: this.text,
        subtext: this.subtext,
        x: 'left'
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: _self.getSeriesCount(14)
    }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
     
   } 
},
  mounted () {
    this.$nextTick(() => {
     
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
