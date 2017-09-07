import {getUserInfo, checklimit} from '@/common/api/api';
const state = {
  // 用户信息
  userInfo: {},
  isMemeber: null
};

const mutations = {
  GET_USERINFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  CLEAR_USERINFO(state, userInfo) {
    state.userInfo = {};
  },
  GET_IS_MEMEBR(state, isMemeber) {
    state.isMemeber = isMemeber;
  }
};
const actions = {
  // 获取企业资质信息
  async getUserInfo({commit}) {
    try {
      let { data } = await getUserInfo();
      commit('GET_USERINFO', data.data);
    } catch (e) {
      console.error('获取用户信息失败');
    }
  },
  // 会员权限检查
  async memberChecklimit({commit}) {
    try {
      let { data } = await checklimit();
      commit('GET_IS_MEMEBR', data.data);
      return data.data;
    } catch (e) {
      console.error('会员权限检查失败');
    }
  }
};
const getters = {
  userInfo: (state) => state.userInfo,
  isMemeber: (state) => state.isMemeber
};
export default {
  state,
  actions,
  getters,
  mutations
};
