import vueAxios from '@/libs/api.request'
import ApiCloudAjax from '@/libs/ApiCloudAjax.request'
import Qs from 'qs'

var axios = process.env.NODE_ENV === 'development' ? vueAxios : ApiCloudAjax
/**
* @description 获取收费信息
* @params { lineNumber }
*/
export const getChargeList = ({lineNumber}) => {
    //参数
    let data = {
      lineNumber
    }

    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 

    return axios.request({
      url: `/api/charge/list`,
      data,
      method: 'post',
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }],
    })
  }


  /**
* @description 提交订单
* @params { systemId,serverId }
*/
export const orderSubmit = ({systemId,serverId,lineNumber}) => {
    //参数
    let data = {
        serverId,
        lineNumber
    }
    //debugger
    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 

    return axios.request({
      url: `/api/order/orderSubmit/${systemId}      `,
      data,
      method: 'post',
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }],
    })
  }

 /**
* @description 支付订单
* @params { orderNo,payType }
*/
export const orderPayment = ({orderNo,payType}) => {
  //参数
  let data = {
    orderNo,payType
  }

  if(process.env.NODE_ENV === 'production'){
    //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
    data= {values: data} 
  } 

  return axios.request({
    url: '/api/pay/orderPay',
    data,
    method: 'post',
    transformRequest: [function (data) {
      // 对 data 进行任意转换处理
      return Qs.stringify(data)
    }],
  })
}


 /**
* @description 订单状态查询
* @params { orderNo }
*/
export const orderPayStatus = ({orderNo}) => {
  //参数
  let data = {
   // orderNo
  }

  if(process.env.NODE_ENV === 'production'){
    //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
    data= {values: data} 
  } 

  return axios.request({
    url: `/api/order/orderPayStatus/${orderNo}`,
    data,
    method: 'post',
    transformRequest: [function (data) {
      // 对 data 进行任意转换处理
      return Qs.stringify(data)
    }],
  })
}

 /**
* @description  验证版本是否可以更新
* @params {version  }
*/
export const checkAppUpdate = ({version}) => {
  //参数
  let data = {
   // version
  }

  if(process.env.NODE_ENV === 'production'){
    //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
    data= {values: data} 
  } 

  return axios.request({
    url: `/api/appVeriosn/getAppVeriosn?version=${version}`,
    data,
    method: 'post',
    transformRequest: [function (data) {
      // 对 data 进行任意转换处理
      return Qs.stringify(data)
    }],
  })
}