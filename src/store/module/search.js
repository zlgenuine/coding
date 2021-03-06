import {searchGetResult, searchEncoded, searchPolling} from '@/common/api/api';
import MessageBox from '@/components/common/messagebox/messagebox.js';
//
const state = {
  // 搜索-BASE64文本
  search: {
    id: '',
    list: [],
    progress: 0,
    handleStatus: false,
    setInterval: null,
    access: true,
    info: {},
    isGlobal: true
  }
};

const mutations = {
  GET_SEARCH_LIST(state, info) {
    state.search.list = state.search.list.concat(info);
  },
  // 搜索记录清空
  SET_SEARCH_EMPTY(state) {
    state.search.list = [];
  },
  // 获取搜索ID
  GET_SEARCH_ID(state, id) {
    state.search.id = id;
  },
  // 处理状态
  SET_HANDLE_STATUS(state, status) {
    state.search.handleStatus = status;
  },
  // 进度条控制
  SET_PROGRESS(state, progress) {
    state.search.progress = Number(progress);
  },
  CLEAR_INTERVAL(state) {
    clearInterval(state.search.setInterval);
  },
  // 区别库内&库外
  SET_GLOBAL(state, isGlobal) {
    state.search.isGlobal = isGlobal;
  }
};
const actions = {
  async getSearchEncoded({
    commit,
    state
  }, params) {
    // 1.获取搜索的key
    try {
      state.search.access = true;
      let res = await searchEncoded(params);
      if (!res.data.code) {
        let searchKey = res.data.data.searchKey;
        state.search.setInterval = setInterval(async() => {
          let result = (await searchPolling(searchKey)).data.data;
          if (result !== -1) {
            clearInterval(state.search.setInterval);
            await commit('GET_SEARCH_ID', result);
          }
        }, 3000);
      } else if (res.data.code === 1004020) {
        // 没有权限
        state.search.handleStatus = false;
        state.search.progress = 1;
        clearInterval(state.search.setInterval);
        state.search.access = false;
        MessageBox({title: '您今日7次免费搜花已用完', message: '成为会员，享受无限次快找搜花，请联系热线电话：4008013357', confirmButtonText: '知道了'});
      }
    } catch (e) {
      return e;
    }
  },
  async searchGetResult({
    commit
  }, param) {
    let data = (await searchGetResult(param)).data.data.list;
    commit('GET_SEARCH_LIST', data);
  }
};
const getters = {
  search: (state) => state.search
};
export default {
  state,
  actions,
  getters,
  mutations
};
