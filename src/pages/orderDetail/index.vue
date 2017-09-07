<template>
<div>
  <v-header>
    <search></search>
  </v-header>
  <v-nav></v-nav>
  <div class="orderDetail">
    <div class="orderDetail-content">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script>
import {
  header,
  nav,
  search
} from '@/components';
export default {
  components: {
    'vHeader': header,
    'vNav': nav,
    search
  },
  beforeDestroy() {
    document.querySelector('.main-wrapper').style.backgroundColor = '#F2F2F2';
  },
  beforeCreate() {
    document.querySelector('.main-wrapper').style.backgroundColor = '#fff';
  }
};
</script>
<style scoped>
@component-namespace orderDetail {
  @component content {
    max-width: 1200px;
    margin: 1em auto;
  }
}
</style>
