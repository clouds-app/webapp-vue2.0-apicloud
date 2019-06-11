<template>

<div id="app">
      <NavBar title="支付结果" returnUrl="index"/>
        <div>
			<van-icon name="clear" size="6rem" color="#f44"/>
			<p>支付失败<p>
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
		
		}
	}
</script>

<style>
</style>
