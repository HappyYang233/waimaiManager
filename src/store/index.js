import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        leftMenu:JSON.parse(sessionStorage.getItem("leftMenu"))||[],
        username:sessionStorage.getItem("username")||''
    },
    mutations:{
        setLeftMenu(state,data){
            state.leftMenu=data;
            sessionStorage.setItem("leftMenu",JSON.stringify(data));
        },
        setUsername(state,data){
            state.username=data;
            sessionStorage.setItem("username",data);
        }
    },
    actions:{

    },
})
export default store;
