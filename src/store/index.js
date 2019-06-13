import Vue from 'vue'
import Vuex from 'vuex'
import app from './module/app'
import user from './module/user'
import serverData from './module/serverData'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules:{
    app,
    user,
    serverData
  }
})
