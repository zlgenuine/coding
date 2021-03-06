// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/router';
import store from './store/store';
import axios from './common/api/';
import {sync} from 'vuex-router-sync';
import * as filters from './filter/';
import * as directive from './directive/';
import * as utils from '@/common/js/utils';
import {GAODE_MAP_KEY} from '@/common/dict/const';
import VueLazyload from 'vue-lazyload';
// HZC公共组件
import jhComponents from '@/components/common/index.js';
// 高德地图
import AMap from 'vue-amap';
import { Table, TableColumn } from 'element-ui';
Vue.use(AMap);
Vue.use(jhComponents);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/images/default/morenhuaxing.png',
  attempt: 1
});

Vue.config.productionTip = false;
Vue.config.silent = true;
// 注册过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
Object.keys(directive).forEach(k => Vue.directive(k, directive[k]));
Object.keys(utils).forEach(k => {
  Vue.prototype[k] = utils[k];
});
Object.keys(filters).forEach(k => {
  Vue.prototype[k] = filters[k];
});
// 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德的key
  key: GAODE_MAP_KEY,
  // 插件集合
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor'
  ]
});
store.dispatch('getDicTree');
store.dispatch('getWatermark');
sync(store, router);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  render: h => h(App)
});
