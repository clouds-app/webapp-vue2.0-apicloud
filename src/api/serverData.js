import vueAxios from '@/libs/api.request'
import ApiCloudAjax from '@/libs/serverApiCloudAjax.request'
import Qs from 'qs'

var axiosServer = process.env.NODE_ENV === 'development' ? vueAxios : ApiCloudAjax
const api = process.env.NODE_ENV === 'development' ? '/apk' : ''

/**
* @description 获取生产线详情
* @params { line }
*/
export const getGoodsDetail = ({line,timer}) => {
    //参数
    let data = {
      timer
    }
    

    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 

    return axiosServer.request({
      url: `${api}/GetOrdersByLineID&${line}`,
      data,
      method: 'post',
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }],
    })
  }

  /**
* @description 获取生产线数据列表
* @params {  }
*/
export const getGoodsList = ({timer}) => {
    //参数
    let data = {
      timer
    }

    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 

    return axiosServer.request({
      url: `${api}/GetLineList`,
      data,
      method: 'post',
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }],
    })
  }

/**
* @description 获取生产报表数据列表
* @params {storedProcedureName,StartDate,EndDate,LineID,ClassID,DateGroupBy}
* @url  /API/GetQueryDatas&spAppXLAanlyzer&@StartDate=2019-07-01&@EndDate=2019-07-10&@LineID=&@ClassID=&@DateGroupBy=0
*/
  export const getQueryDatasList = ({storedProcedureName,StartDate,EndDate,LineID,ClassID,DateGroupBy}) =>{
    //debugger
    //参数
    let data = {
      //storedProcedureName,StartDate,EndDate
    }
    let LineIDStr =''
    if(LineID && LineID!=null){
      LineIDStr='&@LineID='+LineID
    }
    let ClassIDStr =''
    if(ClassID&& ClassID!=null){
      ClassIDStr='&@ClassID='+ClassID
    }
    let DateGroupByStr =''
    if(DateGroupBy!=null){
      DateGroupByStr='&@DateGroupBy='+DateGroupBy
    }
    storedProcedureName ='spAppXLAanlyzer'
    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 

    return axiosServer.request({
     
      url: `${api}/GetQueryDatas&${storedProcedureName}&@StartDate=${StartDate}&@EndDate=${EndDate}${LineIDStr}${ClassIDStr}${DateGroupByStr}`,
      data,
      method: 'post',
      // transformRequest: [function (data) {
      //   // 对 data 进行任意转换处理
      //   return Qs.stringify(data)
      // }],
    })

  }

  /**
* @description 获取生产报表所有线别班别数据列表
* @params {storedProcedureName}
*/
export const getReportLinesAndClasses = ({storedProcedureName}) =>{
  //debugger
  //参数
  let data = {
    //storedProcedureName,
  }
  storedProcedureName ='spGetAppXLAanlyzerLinesAndClasses'
  if(process.env.NODE_ENV === 'production'){
    //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
    data= {values: data} 
  } 

  return axiosServer.request({
    url: `${api}/GetQueryDatas&${storedProcedureName}&`,
    data,
    method: 'post',
    // transformRequest: [function (data) {
    //   // 对 data 进行任意转换处理
    //   return Qs.stringify(data)
    // }],
  })

}


