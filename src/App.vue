<template>
<div>
  <div class="main-wrapper">
    <models></models>
    <topbar v-if='!isClauseRoute'></topbar>
    <div class="main">
      <transition name="fade">
        <router-view></router-view>
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
export default {
  computed: {
    isClauseRoute() {
      return ['/clause', '/autologin'].indexOf(this.$route.path) >= 0;
    }
  },
  components: {
    topbar,
    models,
    'vFooter': footer
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
