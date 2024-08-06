import { createStore } from 'vuex'

const store = createStore({
  state: {
    id: '',
  },
  getters: {
    getId(state){
      return state.id;
    },
  },
  mutations: {
    // 修改或保存token
    setId(state,id){
      state.id = id;
    },
    delInfo(state) {
      state.id = "";
    },
  },
  actions: {
  },
  modules: {
  },
})

export default store;