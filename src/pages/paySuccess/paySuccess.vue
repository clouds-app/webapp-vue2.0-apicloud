<template>
<div id="app">
      <NavBar title="支付结果" returnUrl="index"/>
       <div >
			<van-icon style="margin-top:15px;" name="checked" size="6rem" color="#07c160"/>
			<p>支付成功<p>
		     <br/>  <br/>
			<p>订单号:{{orderItem.orderNo}}</p>
			<!-- <p><van-button size="small" @click="orderList">查看订单</van-button></p> -->
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
		data() {
			return {
				  orderNo:'',
				  orderItem:{
                      orderNo:'0',
                      orderPrice:'0'
                    },
			}
		},
		mixins:[base_mixin],
		components:{
			Footer,NavBar,userStatus
		},
		computed: {},
		mounted(){
			  //订单信息
			 this.getOrderInfo()
			 this.forbidReturn() //安卓-禁用返回
		},
		methods: {
			//获取订单信息
			getOrderInfo(){
				let orderInfo = getLocalStorage('orderInfo')
				if(orderInfo!=""){
							let order =JSON.parse(orderInfo)
							this.orderItem.orderNo =order.orderNo
							this.orderItem.orderPrice =order.payPrice

						}

				},
			onClickLeft(){
				//window.location.href = this.$config.baseUrl.pro;
			},
			orderList(){
				// this.$router.push({
				// 	name:'orderList',
				// 	query:{
				// 		active:1
				// 	}
				// });
			}
		}
	}
</script>

<style>
</style>
