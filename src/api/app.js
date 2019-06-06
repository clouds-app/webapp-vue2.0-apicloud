import vueAxios from '@/libs/api.request'
import ApiCloudAjax from '@/libs/ApiCloudAjax.request'
import Qs from 'qs'

var axios = process.env.NODE_ENV === 'development' ? vueAxios : ApiCloudAjax
/**
* @description 获取收费信息
* @params { null }
*/
export const getChargeList = () => {
    //参数
    let data = {
    }

    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 

    return axios.request({
      url: '/api/charge/list',
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
export const orderSubmit = ({systemId,serverId}) => {
    //参数
    let data = {
        serverId
    }

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
