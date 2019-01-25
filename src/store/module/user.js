import {getUserInfo, checklimit, personaLevel, authMsg} from '@/common/api/api';

const state = {
  // 用户信息
  userInfo: {},
  isMemeber: false
};

const mutations = {
  GET_USERINFO (state, userInfo) {
    state.userInfo = userInfo;
  },
  CLEAR_USERINFO (state, userInfo) {
    state.userInfo = {};
    state.isMemeber = false;
  },
  GET_IS_MEMEBR (state, isMemeber) {
    state.isMemeber = isMemeber;
  }
};
const actions = {
  // 获取企业资质信息
  async getUserInfo ({commit}) {
    try {
      let {data} = await getUserInfo();
      let dateStr = (await personaLevel()).data.data;
      let main = '';
      if (data.data.userType === 1) {
         main = (await authMsg()).data.data; // 只有厂家才调这个接口，是否是主营认证
      }
      commit('GET_USERINFO', Object.assign({}, data.data, {isVip: dateStr.isVip, expStr: dateStr.expStr, days: dateStr.days, isMain: main.isMain || false }));
    } catch (e) {
      console.error('获取用户信息失败');
    }
    // let {data} = await getUserInfo();
    // let dateStr = (await personaLevel()).data.data;
    // commit('GET_USERINFO', Object.assign({}, data.data, {isVip: dateStr.isVip, expStr: dateStr.expStr, days: dateStr.days }));
  },
  // 会员权限检查
  async memberChecklimit ({commit}) {
    try {
      let {data} = await checklimit();
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
