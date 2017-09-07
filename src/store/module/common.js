const state = {
  // token
  navs: '',
  // 加载条
  loading: false
};
const mutations = {
  SET_NAV(state, navs) {
    state.navs = navs;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  }
};
const getters = {
  navs: (state) => state.navs,
  loading: (state) => state.loading
};
export default {
  state,
  getters,
  mutations
};
