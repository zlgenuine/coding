<template>
<section class="ts-menu">
  <ts-menu-table-item width="1%" v-if="!show">
    暂无数据
  </ts-menu-table-item>
  <slot>
  </slot>
</section>
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  },
  created() {
    if (this.prop) {
      this.show = this.prop.length > 0;
    }
  },
  props: ['prop'],
  watch: {
    prop(val) {
      this.show = val.length > 0;
    }
  }
};
</script>
<style scoped>
@component-namespace ts {
  @component menu {
    border: 1px dotted #eaeaea;
  }
}
</style>
