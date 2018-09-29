import axios from 'axios';
import store from '@/store/store';
import Toast from '@/components/common/toast/toast';
import router from '@/router/router.js';
import {cookie} from '@/common/js/utils.js';
// x-client
axios.defaults.headers['x-client'] = 1;
// https://api.ts57.cn
// http://192.168.8.212:9090
axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? 'https://api.ts57.cn/app'
  : 'https://api.ts57.cn/app';

// 'http://192.168.8.107:15702/app'; 于康
// 'http://192.168.8.93:15702/app'; 荣泽

// x-token
axios.defaults.headers['x-token'] = cookie.get('x-token') || '';
store.commit('LOGIN', axios.defaults.headers['x-token'] || '');
// ==============
axios.interceptors.request.use(config => {
  let token = cookie.get('x-token');
  axios.defaults.headers['x-token'] = token || '';
  return config;
}, err => {
  return Promise.reject(err);
});
// ==============
// http response 拦截器
axios.interceptors.response.use(response => {
  if (response.data.code === 210018) {
    store.commit('LOGIN_OUT');
    Toast({type: 'error', message: response.data.message});
    router.push('/loginPage');
    return response;
  }
  if (response.status === 200) {
    if (response.data.message) {
      Toast({
        type: !response.data.code
          ? 'success'
          : 'error',
        message: response.data.message
      });
    }
    return response;
  } else {
    Toast({type: 'error', message: response.statusText});
    return Promise.reject(response.statusText);
  }
});
