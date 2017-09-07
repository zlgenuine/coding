<template>
<div class="supply-list-page">
  <v-header>
    <search></search>
  </v-header>
  <v-nav></v-nav>
  <ts-title-block>最新厂家供应</ts-title-block>
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
  }
};
</script>
