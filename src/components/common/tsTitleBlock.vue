<template>
<div class="ts-title-block">
  <span class="ts-title-block-title" :style="bodyStyle">
    <slot></slot>
  </span>
  <!-- <div class="ts-title-block-menu">
    <slot name="menu"></slot>
  </div> -->
</div>
</template>

<script>
export default {
  props: {
    bodyStyle: {
      type: Object,
      default: function() {
        return {
          fontSize: '32px'
        };
      }
    }
  }
};
</script>

<style lang="css" scoped>
:root{
  --title-block-border-color:#4c93fd;
}
@component-namespace ts{
  @component title-block{
    text-align: center;
    position: relative;
    /* border-bottom: 2px solid var(--title-block-border-color); */
    padding-bottom: 40px;
    @descendent menu{
    right: 0;
    bottom: 50%;
    transform: translateY(50%);
    position: absolute;

    }
    @descendent title{
      line-height: 45px;
      position: relative;
      &:before{
        content:' ';
        position: absolute 50% * * 0;
        background: var(--title-block-border-color);
        size: 230px 1px;
        transform: translate(-130%,-50%);
      }
      &:after{
        content:' ';
        position: absolute 50% 0 * *;
        background: var(--title-block-border-color);
        size: 230px 1px;
        transform: translate(130%,-50%);
      }
    }
  }
}
</style>
