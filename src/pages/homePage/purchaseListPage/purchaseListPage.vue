<template>
<div class="purchase-list-page">
  <v-header>
    <search></search>
  </v-header>
  <v-nav></v-nav>
  <ts-title-block>最新贸易商求购</ts-title-block>
  <purchase-list></purchase-list>
</div>
</template>

<script>
import {
  header,
  nav,
  search
} from '@/components';
import PurchaseList from './children/purchaseList.vue';
export default {
  components: {
    'vHeader': header,
    'vNav': nav,
    search,
    PurchaseList
  }
};
</script>
