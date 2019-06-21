import { getGoodsList,getGoodsDetail,getQueryDatasList} from '@/api/serverData'
import { setCookie,getCookie,setLocalStorage,getLocalStorage} from '@/libs/util'
const serverBusyTips="服务繁忙，请稍后再试！";
const serverDataZero="暂无数据";
export default {
    state:{
        goodsList:getLocalStorage('goodsList'),
        goodsDetail:getLocalStorage('goodsDetail'),
        goodsReport:getLocalStorage('goodsReport'),
    },
    getters:{
      
        goodsList_state:state=>state.goodsList,
        goodsDetail_state:state=>state.goodsDetail
       // doneTodos: state => {//通过方法访问
      //   return state.todos.filter(todo => todo.done)
      // },
      // doneTodosCount: (state, getters) => {//通过属性访问
      //     return getters.doneTodos.length
      //   }
    },
    mutations:{
        //生产线数据
        setGoodsList(state,data){
          state.goodsList =data
          setLocalStorage('goodsList',JSON.stringify(data))
        },
        //获取生产线详情
        setGoodsDetail(state,data){
            state.goodsDetail =data
            setLocalStorage('goodsDetail',JSON.stringify(data))
          },
        //获取生产报表列表
        setGoodsReport(state,data){
            state.goodsReport =data
            setLocalStorage('goodsReport',JSON.stringify(data))
          }
    },
    actions:{
        /**
        * @description 获取生产线数据
        * @params { null }
        */
        getGoodsList_actions({commit},params){
            return new Promise((resolve,reject)=>{
                //debugger
                try {
                    getGoodsList(params).then(res=>{
                        const data = process.env.NODE_ENV === 'production' ? res : res.data //因为web 浏览器 多封装了一层 data 包裹
                        //debugger
                        if(data.length > 0)
                        {
                          resolve(data)
                          commit('setGoodsList',data)
                        }
                        else
                        {
                          reject(serverDataZero)
                        }
                    }).catch(err=>{
                        //debugger
                        console.error(JSON.stringify(err))
                        reject(serverBusyTips)
                    })
                } catch (error) {
                    debugger
                    console.error(JSON.stringify(error))
                    reject(serverBusyTips)
                }
               
            })
        },
         /**
        * @description 获取生产线详情
        * @params { line }
        */
       getGoodsDetail_actions({commit},params){
        return new Promise((resolve,reject)=>{
            try {
                getGoodsDetail(params).then(res=>{
                    const data = process.env.NODE_ENV === 'production' ? res : res.data //因为web 浏览器 多封装了一层 data 包裹
                    //debugger
                    if(data.length > 0)
                    {
                      resolve(data)
                      commit('setGoodsDetail',data)
                    }
                    else
                    {
                      reject(serverDataZero)
                    }
                }).catch(err=>{
                    console.error(JSON.stringify(err))
                    reject(serverBusyTips)
                })
            } catch (error) {
                console.error(JSON.stringify(error))
                reject(serverBusyTips)
            }
           
        })
    },
    getQueryDatasList_actions({commit},params){
        return new Promise((resolve,reject)=>{
            try {
                getQueryDatasList(params).then(res=>{
                    const data = process.env.NODE_ENV === 'production' ? res : res.data //因为web 浏览器 多封装了一层 data 包裹
                    //debugger
                    if(data.length > 0)
                    {
                      resolve(data)
                      commit('setGoodsReport',data)
                    }
                    else
                    {
                      reject(serverDataZero)
                    }
                }).catch(err=>{
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

