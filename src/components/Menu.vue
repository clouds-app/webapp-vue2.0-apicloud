<template> 
  <NavBar id="main_header" :hideArrow="false" :title="companyName">
 
  </NavBar>
</template>
<script>
const isApp = process.env.NODE_ENV === 'development' ? false : true 
import {getCookie,getLocalStorage} from '@/libs/util'
import NavBar from '_c/header'
export default {
    name:'Menu',
    components:{NavBar},
    data(){
        return{
            companyName:' 我 ',
           
        }
    },
    methods:{
       //首页 公司名称赋值
       getCompanyName(){
           //debugger
              let userInfo = getLocalStorage('userInfo')
               if(userInfo!=""){
                let user =JSON.parse(userInfo)
                //this.hasAccess =(user.status===0)
                this.companyName = user.companyName
            }
       },
        openSubFrames(){
         let header = $api.byId('main_header');
             //$api.fixStatusBar(header);
         let headerH = $api.offset(header).h;
      
          // 打开sub Frame
         window.api.openFrame({
            name: 'main_frame',
            url: './main_frame.html',
            rect: {
                x: 0,
                y: headerH,
                w: 'auto',
                h: 'auto'
            },
            bounces: true
        })
     },
  


    },
    mounted(){
         
        this.getCompanyName()
        if(isApp){
          this.openSubFrames()
        }
    }
}
</script>