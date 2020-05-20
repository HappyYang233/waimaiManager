import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        leftMenu:JSON.parse(sessionStorage.getItem("leftMenu"))||[],
        username:sessionStorage.getItem("username")||'',
        resId:sessionStorage.getItem("resId")||'',
    },
    mutations:{
        setLeftMenu(state,data){
            state.leftMenu=data;
            sessionStorage.setItem("leftMenu",JSON.stringify(data));
        },
        setUsername(state,data){
            state.username=data;
            sessionStorage.setItem("username",data);
        },
        setResId(state,data){
            state.resId=data;
            sessionStorage.setItem("resId",data);
        }
    },
    actions:{

    },
})
export default store;
