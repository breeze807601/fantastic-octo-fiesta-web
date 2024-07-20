// import { createApp } from 'vue'
import { createStore } from 'vuex'

const store = createStore({
  state: {
    token: '',
    userInfo:{}
  },
  getters: {
    getToken(state){

      return localStorage.getItem('token');
    },
    getUser(state){
      return state.userInfo;
    },
  },
  mutations: {
    // 修改或保存token
    setToken(state,token) {
      state.token = token;
      localStorage.removeItem("token");
      localStorage.setItem('token', token);
    },
    setUser(state,user){
      state.userInfo = user;
      localStorage.removeItem("userInfo");
      localStorage.setItem("userInfo",user)
    },
    delInfo(state) {
      state.token = "";
      state.userInfo = {};
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo")
    },
  },
  actions: {
  },
  modules: {
  },
})

export default store;