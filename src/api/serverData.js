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
* @params {storedProcedureName,StartDate,EndDate}
*/
  export const getQueryDatasList = ({storedProcedureName,StartDate,EndDate}) =>{
    //debugger
    //参数
    let data = {
      //storedProcedureName,StartDate,EndDate
    }
    storedProcedureName ='spAppXLAanlyzer'
    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 

    return axiosServer.request({
      url: `${api}/GetQueryDatas&${storedProcedureName}&${StartDate}&${EndDate}`,
      data,
      method: 'post',
      // transformRequest: [function (data) {
      //   // 对 data 进行任意转换处理
      //   return Qs.stringify(data)
      // }],
    })

  }


