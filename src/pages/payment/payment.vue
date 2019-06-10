<template>
  <div id="app">
    <div class="payment">
        <NavBar title="支 付"/>
        <userStatus/>
        <van-cell-group>
          <van-cell title="订单编号" :value="orderItem.orderNo" />
          <!-- <van-cell title="实付金额"><span class="red">{{orderItem.orderPrice}}</span></van-cell> -->
        </van-cell-group>

      <div class="pay_way_group">
        <div class="pay_way_title">选择支付方式</div>
         <van-radio-group v-model="payWay">
          <van-cell-group>
            <van-cell @click="payWay='2'">
              <van-radio name="2" @click="payWay='2'">
                <img src="../../../static/images/ali_pay.png" alt="支付宝" width="82" height="29">
              </van-radio>
            </van-cell>
            <van-cell @click="payWay='1'">
              <van-radio name="1" @click="payWay='1'">
                <img src="../../../static/images/wx_pay.png" alt="微信支付" width="113" height="23">
              </van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <van-button class="pay_submit" @click="paySubmit" :loading="isSubmit"  round  long type="primary" size="large">去支付</van-button>
		
	</div>
  </div>
</template>

<script>
import userStatus from '_c/userStatus'
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import Footer from '@/components/footer'
import {getCookie,getLocalStorage} from '@/libs/util'
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
        debugger
        this.$store.dispatch('orderPayment_action',params).then(res=>{
            if(_self.payWay == '2'){//支付宝
              _self.payByAlipay(res,_self)
            }
        }).catch(err=>{
            debugger
             _self.$toast('支付失败：'+err);
        })
     },
     //支付宝--支付
     payByAlipay(resData,_self){
       let aliPayPlus = window.api.require('aliPayPlus')
         console.log("aliPayPlus"+ JSON.stringify(aliPayPlus) )
          aliPayPlus.payOrder({
              orderInfo: resData.data
          }, function(ret, err) {
              window.api.alert({
                  title: '支付结果',
                  msg: ret.code,
                  buttons: ['确定']
              });
          });
     },
     //微信--支付
     payByWeChat(res,_self){
       	if (res.data.trade_type == 'JSAPI') {
							_self.jsAPIConfig = res.data.data;
							if (typeof WeixinJSBridge == "undefined") {
								if (document.addEventListener) {
									document.addEventListener('WeixinJSBridgeReady', _self.wxJSAPIPay, false);
								} else if (document.attachEvent) {
									document.attachEvent('WeixinJSBridgeReady', _self.wxJSAPIPay);
									document.attachEvent('onWeixinJSBridgeReady', _self.wxJSAPIPay);
								}
							} else {
								_self.wxJSAPIPay();
							}
						} else {
							if(res.data.data == null){
								_self.showErrorNotify('调用微信支付失败，请稍后再试');
								return;
							}
							window.location.href = res.data.data;
							_self.$dialog.confirm({
								  title: '支付提示',
								  message: '是否完成支付?',
								  beforeClose:_self.orderPayStatusCheck
							});
						}   	
      },
     //获取订单信息
     getOrderInfo(){
      let orderInfo = getLocalStorage('orderInfo')
      //debugger
      if(orderInfo!=""){
                let order =JSON.parse(orderInfo)
                this.orderItem.orderNo =order.orderNo
                this.orderItem.orderPrice =order.payPrice

            }

     },
     //微信支付
			wxJSAPIPay() {
				let config = this.jsAPIConfig;
				let _self = this;
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', config,
					function(res) {
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							_self.orderPayStatusCheck();
						} else {
							//支付失败
							 _self.turnToPage('payFail') 
						}
					});
			},
			orderPayStatusCheck(){
				let _self = this;
				_self.$store.dispatch('getOrderPayStatus', {orderNo: _self.orderItem.orderNo}).then(res => {
					_self.$dialog.close();
					//支付成功
					 _self.turnToPage('paySuccess') 
				}).catch(res=>{
					_self.$dialog.close();
					//支付失败
					 _self.turnToPage('payFail') 
				})
      },
      checkWxEnv(){
				let ua = navigator.userAgent.toLowerCase();
				this.wxEnv = ua.match(/MicroMessenger\/[0-9]/i);
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
	
		width: 100%;
	}

	.pay_way_group img {
		vertical-align: middle;
	}

	.pay_way_title {
		padding: 15px;
		background-color: #fff;
	}
</style>

