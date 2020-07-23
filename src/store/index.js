import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        leftMenu:JSON.parse(sessionStorage.getItem("leftMenu"))||[],
        username:sessionStorage.getItem("username")||'',
        resId:sessionStorage.getItem("resId")||'',
        notice: [
            {content:"【温馨提醒】各位顾客，天投物业A区小超市决定每周五为中信延长营业时间至19：00，让大家有更充裕的时间去选购商品，欢迎大家踊跃提供意见。",addTime:"2020-7-21",status:"0"},
            {content:"欢迎光临",addTime:"2020-7-20",status:"1"}

        ],

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
        },
        setNotice(state,data) {
            state.notice = data
        }
    },
    actions:{

    },
})
export default store;
