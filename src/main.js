import Vue from 'vue'
// import './plugins/axios'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/global.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/fonts/iconfont.css'
import axios from 'axios'
import  store from './store/index';
import print from 'print-js';
import { Message ,MessageBox} from 'element-ui';
Vue.use(ElementUI);
Vue.prototype.$message = Message;
Vue.prototype.$messageBox=MessageBox;

Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
//配置公共的请求头
// axios.defaults.baseURL = 'http://121.36.50.195:8082/admin';
axios.defaults.baseURL = 'http://121.36.50.195:8084/admin';
// 配置 超时时间
axios.defaults.timeout = 2500;
axios.interceptors.request.use(
    config => {
      if (sessionStorage.getItem('Token')) {
        config.headers.token = sessionStorage.getItem('Token');
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    });
axios.interceptors.response.use(res=>{
    if(res.data.code==10)
    {
        Vue.prototype.$messageBox.confirm('会话过期，请重新登录', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            window.sessionStorage.clear();
            sessionStorage.clear();
            router.replace({
                path: '/login' // 到登录页重新获取token

            });
            window.location.reload();
        }).catch(() => {
            // this.$message({
            //     type: 'info',
            //     message: '已取消删除'
            // });
        });
    }
    return res;
    }
    )
//  配置公共的请求头
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// 配置公共的 post 的 Content-Type
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$http=axios;
// Vue.use(VueAxios,axios);
Vue.config.productionTip = false
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
