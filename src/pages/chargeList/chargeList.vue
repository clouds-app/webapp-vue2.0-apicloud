<template>
  <div id="app">
      <NavBar title="套 餐"/>
       <userStatus :userStatus="userStatus"/>
    
      <van-cell-group>
        <van-cell title="生产线数" >
            <div slot="title">
              <van-row>
                <van-col span="8" style="text-align:center;line-height: 50px;">
                  <span>生产线条数</span>
                </van-col>
                <van-col span="16">
                   <van-dropdown-menu >
                    <van-dropdown-item @change="handleLineChange" v-model="valueOfChargeNum" :options="chargeListNum" />
                  </van-dropdown-menu>
                </van-col>
          </van-row>
        </div>
        </van-cell>
        <van-cell title="套 餐">
            <div slot="title">
               <van-col
                v-for="(item) in ChargeList"
                :key="item.id"
                span="8" 
              >
              <div class="changeBox"  @click="handleSubmit(item)">
                    <div class="serverName"> <span >{{ item.serverName }}</span></div>
                   <div class="discountPrice"> <span >￥{{ item.discountPrice }}</span></div>
                    <div > <span class="serverPrice">￥{{ item.serverPrice }}</span></div>
                    <div class="serverUseTime"> <span >有效时长 {{ item.serverUseTime }} 天</span></div>
              </div>
               </van-col>
            </div>
        </van-cell>
      </van-cell-group>
        
        <!-- <van-tabs v-model="active">
          <van-tab title="套 餐">
             
          </van-tab>
        </van-tabs> -->
      
  </div>
</template>

<script>
import userStatus from '_c/userStatus'
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'

import Footer from '@/components/footer'
import {getCookie,getLocalStorage} from '@/libs/util'
export default {
  name: 'chargeList',
  mixins:[base_mixin],
  components:{
    Footer,NavBar,userStatus
  },
   data() {
            return {
                  valueOfChargeNum: 1,
                  chargeListNum: [],
                  userStatus:{},
                  active:"1",
                  isLoding:false,
                  activeName: '1',
                  ChargeList:[],
                }
        },
   methods:{
        //获取 生产线 条数
        getTotalChargeListNum(){
            let userInfo = getLocalStorage('userInfo')
            let tempArray =[]
               if(userInfo!=""){
                let user =JSON.parse(userInfo)
                for(let i =1;i<=user.totalLine;i++){
                  let params ={
                    text:i,
                    value:i
                  }
                  tempArray.push(params)
                }
                this.chargeListNum = tempArray
            }
        },
        //处理生产线条数 选择 改变事件
        handleLineChange(value){
          this.getChargeList() //价格变动，重新获取
        },
        //更新用户状态
        refreshUserStatus(){
          //debugger
           let userStatus = getLocalStorage('userInfo')
           if(userStatus!=""){
                this.userStatus = JSON.parse(userStatus) 
               
           }
        },
      //获取收费信息
       getChargeList(){
         let currentHasAccress = getLocalStorage('hasAccess')
       
         let params ={
           lineNumber:this.valueOfChargeNum
         }
          let _self=this
          this.$store.dispatch('getChargeList_actions',params).then(res=>{
            // debugger
                 //_self.ChargeList =res.data
                let tempChargeList = res.data

                if(currentHasAccress=='true')
                {
                  let newChargeList = tempChargeList.filter(item=>{
                       return item.discountPrice > 0
                    })
                  _self.ChargeList  =newChargeList
                }
                else{
                    _self.ChargeList = tempChargeList
                }
              
          }).catch(err=>{
             //console.log('获取收费信息列表 失败'+JSON.stringify(err))
             _self.$toast('获取收费信息列表 失败'+err);
          })
       },
        //确认下单
        handleSubmit(item) {
          let _self=this
          function beforeClose(action, done) {
            if (action === 'confirm') {
              if(item && item.id!=null){
                let params={
                  systemId : getLocalStorage('userSystemId'),
                  serverId :item.id,
                  lineNumber:_self.valueOfChargeNum //new 
                }
                  _self.$store.dispatch('orderSubmit_action',params).then(res=>{
                   setTimeout(done, 0);
                     _self.$toast('下单成功,请支付！')
                      setTimeout(function(){
                          _self.turnToPage('payment')  //跳转到支付页面
                      }, 1000);
                  }).catch(err=>{
                    setTimeout(done, 0);
                    _self.$toast('下单错误：'+err.msg)
                  })
                }
              
            } else{
               done()
            }
          }
          this.$dialog.confirm({
            title: '确认购买？',
            message: `<ul style="text-align:left; "><li>套餐：${item.serverName}</li><li>价格：${item.discountPrice} 元</li><li>有效时长(天)：${item.serverUseTime}</li></ul> `,
            beforeClose
          });
      },
      //
   },
   mounted(){
     this.getChargeList()
     this.refreshUserStatus()
     this.getTotalChargeListNum()
   }

}
</script>
<style>
    /*  */
    .serverPrice{
        display: inline-block;
        margin-left: 5px;
        color: #7d7e80;
        font-size: 10px;
        text-decoration: line-through;
    }
.serverUseTime{
   font-size: 12px;
   font-weight: bold;
   color: #ccc;
}
.serverName{
   font-size: 13px;
  font-weight: bold;
  margin-top: 10px;
}
.discountPrice {
   font-size: 20px;
  color:burlywood;
  font-weight: bold;
  margin: 10px 0 10px 0;
}
.changeBox{
  text-align: center;
  background-color: rgba(235, 237, 240, 0.5);
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  height: 130px;
  margin: 6px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
#app {
  text-align: center;
 
}
.van-card__title{
  font-weight: bold;
}
.van-card__price{
  font-size: 16px;
  font-weight: bold;
}
</style>

