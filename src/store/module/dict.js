import { getDicTree, getWatermark } from '@/common/api/api';

const state = {
  // 数据字典
  dicTree: null,
  watermask: ''
};

const mutations = {
  // 获取数据字典
  GET_DICTREE(state, tree) {
    if (!tree) return;
    let result = tree.reduce(function(prev, item) {
      prev[item.typeKey] ? prev[item.typeKey].push(item) : prev[item.typeKey] = [item];
      return prev;
    }, {});
    // 对大货类型做筛选
    result.PRODUCT_SHAPE = result.PRODUCT_SHAPE.filter(item => ['胚布', '成品'].indexOf(item.name) > -1);
    result.PRODUCT_UNIT = result.PRODUCT_UNIT.filter(item => ['吨'].indexOf(item.name) <= -1);
    state.dicTree = result;
  },
  GET_WATERMARK(state, watermask) {
    state.watermask = watermask;
  }
};
const actions = {
  // 根据typeKey获取字典列表
  async getDicTree({
    commit
  }, params) {
    let data = await getDicTree(params);
    commit('GET_DICTREE', data.data.data);
  },
  // 获取水印
  async getWatermark({ commit }) {
    try {
      let { data } = await getWatermark();
      commit('GET_WATERMARK', data.data.replace('?x-oss-process=image', ''));
    } catch (e) {
      console.error('获取水印失败');
    }
  }
};
const getters = {
  dicTree: (state) => state.dicTree,
  watermask: (state) => state.watermask
};
export default {
  state,
  getters,
  actions,
  mutations
};
