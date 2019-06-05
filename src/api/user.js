import vueAxios from '@/libs/api.request'
import ApiCloudAjax from '@/libs/ApiCloudAjax.request'
import Qs from 'qs'

var axios = process.env.NODE_ENV === 'development' ? vueAxios : ApiCloudAjax

/**
* @description 用户登录
* @params { userName, phone，licenseKey } 
*/
export const login = ({ userName,phone,licenseKey }) => {
  //debugger
    //参数
    let data = {
      userName,
      phone,
      licenseKey
     }
     
    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 
    return axios.request({
      url: `/api/user/login`,
      data,
      method: 'post',
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理 将对象 序列化成URL的形式，以&进行拼接。
        return Qs.stringify(data) 

      }],
    })
  }

  /**
* @description 验证登录
* @params { systemId,deviceId } 
*/
export const checkLogin = ({ systemId,deviceId }) => {
  //debugger
    //参数
    let data = {
      systemId,deviceId
     }
     
    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 
    return axios.request({
      url: `/api/user/login`,
      data,
      method: 'post',
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理 将对象 序列化成URL的形式，以&进行拼接。
        return Qs.stringify(data) 

      }],
    })
  }


   /**
* @description 用户注册
* @params { userCode,phoneNo,name,deviceId }  授权码 手机号码 姓名 手机识别码
*/
export const userRegister = ({ userCode,phoneNo,name,deviceId }) => {
  //debugger
    //参数
    let data = {
      userCode,phoneNo,name,deviceId
     }
     
    if(process.env.NODE_ENV === 'production'){
      //apiCloud 参数传递封装，其它另行处理，参考：https://docs.apicloud.com/Client-API/api#3  ajax
      data= {values: data} 
    } 
    return axios.request({
      url: `/api/user/register`,
      data,
      method: 'post',
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理 将对象 序列化成URL的形式，以&进行拼接。
        return Qs.stringify(data) 

      }],
    })
  }