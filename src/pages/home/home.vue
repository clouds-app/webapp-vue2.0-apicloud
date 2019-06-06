<template>
  <div id="app">
      <NavBar title="首  页"/>

        <div class="dataTable">
            <v-table
             :width="tableWidth"
             :columns="columns"
             :table-data="tableData"
             :show-vertical-border="false">
            </v-table>
        </div>

      <!-- <Footer></Footer> -->
   
  </div>
</template>

<script>
import base_mixin from '@/pages/mixins/common'
import NavBar from '_c/header'
import LoginForm from '_c/login-form'
import {getViewportSize} from '@/libs/switchMethods'
import Footer from '@/components/footer'
export default {
  name: 'home',
  mixins:[base_mixin],
  components:{
    Footer,NavBar,LoginForm
  },
   data() {
            return {
                 tableWidth:window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                 tableData: [
                     {"name":"赵伟","tel":"156*****1987","hobby":"钢琴、书法、唱歌","address":"上海市黄浦区金陵东路569号17楼"},
                     {"name":"李伟","tel":"182*****1538","hobby":"钢琴、书法、唱歌","address":"上海市奉贤区南桥镇立新路12号2楼"},
                     {"name":"孙伟","tel":"161*****0097","hobby":"钢琴、书法、唱歌","address":"上海市崇明县城桥镇八一路739号"},
                     {"name":"周伟","tel":"197*****1123","hobby":"钢琴、书法、唱歌","address":"上海市青浦区青浦镇章浜路24号"},
                     {"name":"吴伟","tel":"183*****6678","hobby":"钢琴、书法、唱歌","address":"上海市松江区乐都西路867-871号"}
                 ],
                columns: [
                    {field: 'name', title:'姓名', width: 100, titleAlign: 'center',columnAlign:'center',isFrozen: true},
                    {field: 'tel', title: '手机号码', width: 260, titleAlign: 'center',columnAlign:'center'},
                    {field: 'hobby', title: '爱好', width: 330, titleAlign: 'center',columnAlign:'center'},
                    {field: 'address', title: '地址', titleAlign: 'center',columnAlign:'left'}
                ]
            }
        },
   methods:{

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

