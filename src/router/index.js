import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from  '../components/Home.vue'
import NotFound from '../components/NotFound'
import foodList from  '../components/foods/foodList'
import foodCategory from '../components/foods/foodCategory'
import allOrder from  '../components/orders/allOrder'
import todayOrder from  '../components/orders/todayOrder'
import statisticsOrder from '../components/orders/statisticsOrder'
import address from  '../components/resInfo/address'
import notice from  '../components/resInfo/notice'
import resInfo from  '../components/resInfo/resInfo'
import  admin from '../components/user/admin'
import  users from '../components/user/users'
import Welcome from  '../components/Welcome'
Vue.use(VueRouter)


const routes = [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/home',
      name:'home',
      redirect:'/welcome',
      component:Home,
        children:[
            {path:'/welcome',component:Welcome},
            {path:'/foodList',component:foodList},
            {path:'/foodCategory',component:foodCategory},
            {path:'/allOrder',component:allOrder},
            {path:'/todayOrder',component:todayOrder},
            {path:'/address',component:address},
            {path:'/notice',component:notice},
            {path:'/statisticsOrder',component:statisticsOrder}
        ]
    },
      {
       path:'*',
       component:NotFound
      }

];
const  ResInfo= {path:'/resInfo',component:resInfo};
const   Admin ={path:'/admin',component:admin};
const  Users ={path:'/users',component:users};
const map = {
      '/resInfo':ResInfo,
      '/users':Users,
      '/admin':Admin
  };
const router = new VueRouter({
  routes
});
router.beforeEach((to,from ,next)=>{
    if(to.path=="/login")
    {
        return next();
    }

    let token = window.sessionStorage.getItem("Token");
    if(!token) return next("login");
    next();
});
export  function initRouter() {
    console.log(router);
    const currentRoutes = router.options.routes;
    const leftMenu = JSON.parse(sessionStorage.getItem("leftMenu"));
    console.log(leftMenu);
    leftMenu.forEach(item=>{
        item.children.forEach(item2=>{

            console.log(map);
            console.log(item2.path);
            let temp = map[item2.path];
            console.log(temp);
            if(temp)
            currentRoutes[2].children.push(temp);
        });
    });
    console.log("sdasd"+currentRoutes);
    router.addRoutes(currentRoutes);
    console.log(router);

}
export default router
