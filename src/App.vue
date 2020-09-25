<template>
<div>
  <div class="main-wrapper">
    <models></models>
    <topbar v-if='!isClauseRoute'></topbar>
    <div class="main">
      <transition name="fade">
        <router-view></router-view>
        {{showInfo}}
      </transition>
    </div>
  </div>
  <div class="footer-wrapper" v-if='!isClauseRoute'>
    <v-footer></v-footer>
  </div>
</div>
</template>

<script>
import {
  topbar,
  footer,
  models
} from '@/components';
import {
  getUserImToken
} from '@/common/api/api';
import {
  goto
} from '@/common/js/utils.js';
export default {
  computed: {
    isClauseRoute() {
      return ['/clause', '/autologin', '/wxPay'].indexOf(this.$route.path) >= 0;
    },
    token () {
      return this.$store.state.token.token
    },
    userInfo () {
      return this.$store.state.user.userInfo
    },
    confirmControl () {
      return this.$store.getters.confirmControl
    },
    showInfo () {
      let upDateTemp = 1542007640000;
      let nowDateTemp = Date.parse(new Date());
      console.log((nowDateTemp - upDateTemp) / 60000);
      // 一周时间相差 604800000
     return nowDateTemp - upDateTemp < 604800000
    }
  },
  components: {
    topbar,
    models,
    'vFooter': footer
  },
  mounted () {
    if (this.token) {
      getUserImToken({id: this.userInfo.id});
    }
    if (this.showInfo) {
      // this.$notify.info({
      //   title: '消息',
      //   message: '这是一条消息的提示消息'
      // });
    }
    const script = document.createElement('script');
    script.src = 'https://s23.cnzz.com/z_stat.php?id=1277376286&web_id=1277376286';
    script.language = 'JavaScript';
    document.body.appendChild(script);
  },
  watch: {
    confirmControl (val) {
      if (val) {
        this.$messagebox.confirm('成为会员，享受更优质服务','您无此权限', {
          confirmButtonText: '开通会员',
          cancelButtonText: '稍后再说',
        }).then(action => {
          this.$store.commit('CONFIRM_CONTROL', false);
          goto(`/renew?companyId=${this.userInfo.companyId}`);
        }).catch(e => {
          this.$store.commit('CONFIRM_CONTROL', false);
        });
      } else {
        this.$store.commit('CONFIRM_CONTROL', false);
      }
    },
    showInfo (val) {
      if(val) {
        this.$notify.info({
          title: '消息',
          message: '这是一条消息的提示消息'
        });
      }
    },
    '$route' (val) {
      if (window._czc) {
        switch(val.path){
          case '/search/image':window._czc.push(['_trackEvent', '首页', '图片搜花入口']);
            break;
          case '/search/text':window._czc.push(['_trackEvent', '首页', '文本搜索入口']);
            break;
          case '/search/equipment':window._czc.push(['_trackEvent', '首页', '设备搜索入口']);
            break;
          case '/find/everyLooking':window._czc.push(['_trackEvent', '首页', '大家都在找']);
            break;
          case '/hotListPage':window._czc.push(['_trackEvent', '首页', '新增热搜入口']);
            break;
          case '/entryListPage':window._czc.push(['_trackEvent', '首页', '最新入驻']);
            break;
          case '/supplyOrBuy':window._czc.push(['_trackEvent', '首页', '供应求购']);
            break;
          case '/threeDDressPage':window._czc.push(['_trackEvent', '首页', '3D试衣']);
            break;
        }
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
  .tab
    display flex
    height 40px
    line-height 40px
    text-align center
    .tab-item
      flex 1
      &.active
        color #fff
        background #3385ff
</style>
<style lang="css">
@import './common/css/main.css';
@import 'static/css/pc_reset.css';
</style>
