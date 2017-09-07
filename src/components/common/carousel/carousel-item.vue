<template>
<div class="ts-carousel-item" :style="styles" :class="[$parent.arrowType==='square'?'is-square':'']">
  <slot></slot>
</div>
</template>
<script>
export default {
  componentName: 'carousel-item',
  name: 'CarouselItem',
  data() {
    return {
      width: 0,
      height: 'auto',
      left: 0
    };
  },
  props: ['key'],
  computed: {
    styles() {
      return {
        width: `${this.width}px`,
        height: `${this.height}`,
        left: `${this.left}px`
      };
    }
  },
  mounted() {
    this.$parent.slotChange();
  },
  beforeDestroy() {
    this.$parent.slotChange();
  }
};
</script>
<style scoped>
@component-namespace ts {
  @component carousel {
    @descendent item {
      float: left;
      height: 100%;
      opacity: 1;
      transition: opacity .8s ease-in;
      min-height: 1px;
      display: block;
      box-sizing: border-box;
      @when square{
        padding: 0 15px;
      }
    }
  }
}
</style>
