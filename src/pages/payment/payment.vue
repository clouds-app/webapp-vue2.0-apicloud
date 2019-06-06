<template>
  <div id="app">
      <NavBar title="支 付"/>
       <userStatus/>
    

        <van-cell-group title="">
          <van-cell>
             <template slot="title">
              <div>
                  <van-collapse v-model="activeName" accordion>
                  <van-collapse-item title="选择套餐" name="1">
                      <van-card v-for="(item) in ChargeList" :key="item.id"
                        num="1"
                        tag=""
                        :price="item.serverPrice"
                        :title="item.serverName"
                        :origin-price="item.serverPrice+item.serverPriceDiscount"
                      >
                    <div slot="desc" style="margin:10px;">
                     <van-cell :title="`有效时长(天)：${item.serverUseTime}`"  />
                    </div>
                    <div slot="footer">
                      <van-button tapmode :loading='isLoding' round @click="handleSubmit(item)" type="primary" size="normal">购买</van-button>
                    </div>
                  </van-card>
                  </van-collapse-item>
                </van-collapse>
              
              </div>
             </template>
          </van-cell>
        </van-cell-group>
       <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import userStatus from '_c/userStatus'
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import {getViewportSize} from '@/libs/switchMethods'
import Footer from '@/components/footer'
import {setCookie,getCookie,setSession,getSession} from '@/libs/util'
export default {
  name: 'payment',
  mixins:[base_mixin],
  components:{
    Footer,NavBar,userStatus
  },
   data() {
            return {
                  isLoding:false,
                  activeName: '1',
                  ChargeList:[],
                }
        },
   methods:{
      //获取收费信息
       getChargeList(){
         let params ={}
          let _self=this
          this.$store.dispatch('getChargeList_actions',params).then(res=>{
            // debugger
              _self.ChargeList =res.data
          }).catch(err=>{
             //console.log('获取收费信息列表 失败'+JSON.stringify(err))
             _self.$toast('获取收费信息列表 失败'+err);
          })
       },
       //购买套餐下单
        handleSubmit2(item){
          debugger
            if(item && item.id!=null){
              
                let params={
                  systemId : getCookie('userSystemId'),
                  serverId :item.id
                }
                // console.log(params.systemId,params.serverId)
                  let _self=this
                  this.$store.dispatch('orderSubmit_action',params).then(res=>{
                    _self.$toast('下单成功！');
                   //return done
                  }).catch(err=>{
                    _self.$toast('下单错误：'+err);
                   //return done
                  })
                }
            
        },
        handleSubmit(item) {
          let _self=this
          function beforeClose(action, done) {
            if (action === 'confirm') {
              if(item && item.id!=null){
                let params={
                  systemId : getCookie('userSystemId'),
                  serverId :item.id
                }
                  _self.$store.dispatch('orderSubmit_action',params).then(res=>{
                   setTimeout(done, 0);
                     _self.$toast('下单成功！')
                  }).catch(err=>{
                    setTimeout(done, 0);
                    _self.$toast('下单错误：'+err)
                  })
                }
              
            } else{
               done()
            }
          }
          this.$dialog.confirm({
            title: '确认购买？',
            message: `<ul style="text-align:left; "><li>套餐：${item.serverName}</li><li>价格：${item.serverPrice}</li><li>有效时长(天)：${item.serverUseTime}</li></ul> `,
            beforeClose
          });
      },
      //
   },
   mounted(){
     this.getChargeList()
   }

}
</script>
<style>
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

