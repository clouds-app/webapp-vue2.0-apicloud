/* eslint-disable */
import { login,checkLogin,userRegister} from '@/api/user'
import { setToken, getToken,setCookie,getCookie,setSession,getSession} from '@/libs/util'
const serverBusyTips="服务繁忙，请稍后再试！";


export default {
   //使用方法：this.$store.state.user.属性名称
    state: {
      statusCheck:getSession('statusCheck'),
      token: getToken(),
      userSystemId:getCookie('userSystemId'),
      userInfo:getCookie('userInfo'),
      paymentStatus:getSession('paymentStatus'),
    },
    //使用方法：this.$store.getters.属性名称
    getters:{
      token_state:state=>state.token,
      userSystemId_state:state=>state.userSystemId,
      statusCheck_state:state=>state.statusCheck,
      userInfo_state:state=>state.userInfo,
      paymentStatus_state:state=>state.paymentStatus,
      // doneTodos: state => {//通过方法访问
      //   return state.todos.filter(todo => todo.done)
      // },
      // doneTodosCount: (state, getters) => {//通过属性访问
      //     return getters.doneTodos.length
      //   }
  
    },
    //使用方法：this.$store.commit('method name',data)
    mutations: {
      setToken (state, token) {
        state.token = token
        setToken(token)
      },
      //用户SystemId 登陆后服务返回
      setUserSystemId (state, data) {
        state.userSystemId = data
        setCookie('userSystemId',data)
      },
      //用户续费选择状态
      setStatusCheck (state, data) {
        state.statusCheck = data
        setSession('statusCheck',data)
      },
      //保存用户信息
      setUserInfo (state, data) {
        state.userInfo = data
        setCookie('userInfo',JSON.stringify(data))
      },
       //保存用户付款套餐状态
       setPaymentStatus (state, data) {
        state.paymentStatus = data
        setSession('paymentStatus',JSON.stringify(data))
      }
    },
    //使用方法：this.$store.dispatch('method name',params)
    actions: {
   
      /**
      * @description 验证登录
      * @params { systemId,deviceId } 
      */
      handleCheckLogin ({commit}, params) {
        //debugger
        return new Promise((resolve, reject) => {
          try {
            checkLogin(params).then(res => {
              const data = process.env.NODE_ENV === 'production' ? res : res.data //因为web 浏览器 多封装了一层 data 包裹
              if(data.success)
              {
                resolve(data)
              }
              else
              {
                reject(data)
              }
            }).catch(err => {
              console.error(JSON.stringify(err))
              reject(serverBusyTips)
            })
          } catch (error) {
            console.error(JSON.stringify(error))
            reject(serverBusyTips)
          }
          
         
        })
      },
         /**
      * @description 用户注册
      * @params { userCode,phoneNo,name,deviceId }  授权码 手机号码 姓名 手机识别码
      */
       handleUserRegister ({commit}, params) {
        //debugger
        return new Promise((resolve, reject) => {
          try {
            userRegister(params).then(res => {
              const data = process.env.NODE_ENV === 'production' ? res : res.data //因为web 浏览器 多封装了一层 data 包裹
              if(data.success)
              {
               // debugger
                commit('setUserInfo',params)
                commit('setUserSystemId',data.data)
                resolve(data)
              }
              else
              {
                reject(data.msg)
              }
            }).catch(err => {
              console.error(JSON.stringify(err))
              reject(serverBusyTips)
            })
          } catch (error) {
            console.error(JSON.stringify(error))
            reject(serverBusyTips)
          }
        
         
        })
      },

    }
  }