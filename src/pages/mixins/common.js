//视图公用方法
import {getCookie} from '@/libs/util'
export default {
    data(){
      return {
        showToastLoading: {},
      }
    },
    props: {
    
    },
    computed: {
    },
    methods: {
      fixHeaderStatusBar(){
        if(process.env.NODE_ENV === 'production'){
          let header = $api.byId('appheader');
          $api.fixStatusBar(header);
        }
       
      },
      fixFooterStatusBar(){
        if(process.env.NODE_ENV === 'production'){
          let header = $api.byId('appheader');
          let footer = $api.byId('appfooter');
          let headerH = $api.offset(header).h
          let footerH = $api.offset(footer).h
          let otherH = winodw.api.winHeight - headerH - footerH
          return otherH
        }
      },
      
    },
    mounted(){
      this.fixHeaderStatusBar();
    }
  };
  