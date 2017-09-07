<template>
<ts-section>
  <div slot="menu">
    <router-link to="supplyAdd" exact>
      <ts-button type="primary">发布供应</ts-button>
    </router-link>
  </div>
  <supply-component></supply-component>
</ts-section>
</template>
<script>
import SupplyComponent from './supply/supplyIndex.vue';
export default {
  components: {
    SupplyComponent
  }
};
</script>
