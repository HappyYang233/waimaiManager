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
import  store from './store/index'
// import VueAxios from 'vue-axios'


//配置公共的请求头
axios.defaults.baseURL = 'http://localhost:8080';
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
//  配置公共的请求头
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// 配置公共的 post 的 Content-Type
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$http=axios;
// Vue.use(VueAxios,axios);
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
