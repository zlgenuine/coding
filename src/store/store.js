'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';
// module
// ======
import shop from './module/shop';
import dict from './module/dict';
import user from './module/user';
import common from './module/common';
import token from './module/token';
import search from './module/search';
// ======
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    shop,
    token,
    dict,
    common,
    search,
    user
  },
  state: {
    userName: '',
    showLoading: false,
    modelShow: false,
    modelOption: {},
    currentPerson: '',
    confirmControl: false
  },
  mutations: {
    [types.LOADING]: (state, data) => {
      state.showLoading = data;
    },
    [types.MODEL_SHOW]: (state, data) => {
      state.modelShow = data;
    },
    [types.MODEL_OPTION]: (state, data) => {
      state.modelOption = data;
    },
    [types.CURRENT_PERSONAL]: (state, data) => {
      state.currentPerson = data;
    },
    CONFIRM_CONTROL: (state, data) => {
      state.confirmControl = data;
    }
  },
  getters: {
    getModelShow: state => {
      return state.modelShow;
    },
    getModelOption: state => {
      return state.modelOption;
    },
    confirmControl: state => state.confirmControl
  }
});
