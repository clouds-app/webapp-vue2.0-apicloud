<template>
  <div id="app">
     
    <NavBar title="注 册" :hideArrow="false"/>
    
    <LoginForm/>
  </div>
</template>

<script>
import NavBar from '_c/header'
import LoginForm from '_c/login-form'
export default {
  name: 'Login',
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

