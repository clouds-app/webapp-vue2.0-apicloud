<template>
  <div id="app">
     
    <NavBar title="注 册" :hideArrow="true"/>
    
    <LoginForm/>
  </div>
</template>

<script>
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import LoginForm from '_c/login-form'
export default {
  name: 'Login',
  mixins:[base_mixin],
  components:{
    LoginForm,NavBar
  },
  methods: {
    onClickLeft() {
      //Toast('返回');
    },
    onClickRight() {
     // Toast('按钮');
    }
  },
  mounted(){
    
  }
}
</script>
<style>
#app {
  text-align: center;
}
</style>

