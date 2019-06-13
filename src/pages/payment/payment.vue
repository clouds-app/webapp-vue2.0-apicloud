<template>
  <div id="app">
    <div class="payment">
        <NavBar title="支 付"/>
        <!-- <userStatus/> -->
        <van-cell-group>
          <van-cell title="订单编号" :value="orderItem.orderNo" />
          <van-cell title="实付金额"><span class="red">{{orderItem.orderPrice}} 元</span></van-cell>
        </van-cell-group>

      <div class="pay_way_group">
        <div class="pay_way_title">选择支付方式</div>
         <van-radio-group v-model="payWay">
          <van-cell-group>
            <van-cell @click="payWay='2'">
              <van-radio name="2" @click="payWay='2'">
                <img src="../../../static/image/ali_pay.png" alt="支付宝" width="82" height="29">
              </van-radio>
            </van-cell>
            <van-cell @click="payWay='1'">
              <van-radio name="1" @click="payWay='1'">
                <img src="../../../static/image/wx_pay.png" alt="微信支付" width="113" height="23">
              </van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <van-button class="pay_submit" @click="paySubmit" :loading="isSubmit" round  type="primary" size="normal" >去支付</van-button>
		
	</div>
  </div>
</template>

<script>
import userStatus from '_c/userStatus'
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import Footer from '@/components/footer'
import {getCookie,getLocalStorage} from '@/libs/util'
const isApp = process.env.NODE_ENV === 'development' ? false : true
export default {
  name: 'payment',
  mixins:[base_mixin],
  components:{
    Footer,NavBar,userStatus
  },
   data() {
            return {
				            jsAPIConfig: {},
                    orderItem:{
                      orderNo:'0',
                      orderPrice:'0'
                    },
                    payWay:'2',
                    isSubmit:false,
                }
        },
   methods:{
     //确认支付
     paySubmit(){
        this.orderPayment()
     },
     //支付逻辑处理
     orderPayment(){
       let params = {
        orderNo:this.orderItem.orderNo,
        payType:this.payWay
       }
        let _self=this
        //debugger
        this.$store.dispatch('orderPayment_action',params).then(res=>{
           //debugger
            if(res.status == 10011){ //0元使用
                 	//支付成功
					      _self.turnToPage('paySuccess') 
            }else{
             if(_self.payWay == '2'){//支付宝
                if(isApp){
                    _self.payByAlipay(res,_self)
                }
                _self.openWinforCheckState()
            }else{
               if(isApp){
                   _self.payByWeChat(res,_self) //微信支付
               }
                _self.openWinforCheckState()
            }

            }

        }).catch(err=>{
            //debugger
             _self.$toast('支付失败：'+err);
        })
     },
     
     //支付宝--支付
     payByAlipay(resData,_self){
       let aliPayPlus = window.api.require('aliPayPlus')
          aliPayPlus.payOrder({
              orderInfo: resData.data
          }, function(ret, err) {
              // window.api.alert({
              //     title: '支付结果',
              //     msg: ret.code,
              //     buttons: ['确定']
              // });
          });
     },
     //微信--支付
     payByWeChat(res,_self){
       	
 	      let browser = window.api.require('webBrowser')
        let referer = 'shop.szclsoft.com://';
        if (window.api.systemType.toLowerCase() == 'android') {
            referer = 'http://shop.szclsoft.com';
        }
        browser.openView({
              url: res.data.data,
              headers: {
                  Referer: referer,
                  Scheme: 'shop.szclsoft.com'
              },
              rect: {
                  x: 0,
                  y: 64,
                  w: 'auto',
                  h: 'auto'
              }
          }, function(ret, err) {
              switch (ret.state) {
                  case 0:
                      console.log('开始加载');
                      break;
                  case 1:
                    console.log('加载进度发生变化');
                      break;
                  case 2:
                    console.log('结束加载');
                    setTimeout(function(){
                      browser.closeView();
                    },5000);
                      break;
                  case 3:
                    console.log('title发生变化');
                      break;
                  case 4:
                    console.log('url发生变化');
                      break;
                  default:
                    console.log('default');
                      break;
              }

           
          })
		
      },
     //获取订单信息
     getOrderInfo(){
      let orderInfo = getLocalStorage('orderInfo')
      //debugger
      if(orderInfo!=""){
       // debugger
                let order =JSON.parse(orderInfo)
                this.orderItem.orderNo =order.orderNo
                this.orderItem.orderPrice =order.payPrice+""

            }

     },
     //弹出窗体查询 订单 是否付款
     openWinforCheckState(){
       let _self=this
        this.$dialog.confirm({
								  title: '支付提示',
								  message: '是否完成支付?',
								  beforeClose:_self.orderPayStatusCheck
					});
     },
     //查询订单状态 判断跳转
			orderPayStatusCheck(){
        let _self = this;
        let params ={
              orderNo: _self.orderItem.orderNo //'20190611173517548585' //
        }
				_self.$store.dispatch('orderPayStatus_action', params).then(res => {
          //debugger
           _self.$dialog.close();
           if(res.data.status){
             	//支付成功
					 _self.turnToPage('paySuccess') 
           }else{
              _self.turnToPage('payFail') 
           }     
				}).catch(res=>{
					_self.$dialog.close();
					//支付失败
					 _self.turnToPage('payFail') 
				})
      },
     },//end
   mounted(){
     //订单信息
     this.getOrderInfo()
   }

}
</script>
<style>
#app {
  text-align: center;
 
}
.van-cell {
		text-align: left;
	}

	.payment_group {
		margin-bottom: 10px;
	}

	.time_down {
		background-color: #fffeec;
		padding: 10px 15px;
	}

	.pay_submit {
		margin-top: 20px;
	  width:250px;
		
	}

	.pay_way_group img {
		vertical-align: middle;
	}

	.pay_way_title {
		padding: 15px;
		background-color: #fff;
	}
</style>

