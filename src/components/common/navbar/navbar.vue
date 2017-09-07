<template>
<div class="ts-navbar">
  <div class="ts-navbar-wrap" :class="{'is-bordered':bordered}">
    <slot></slot>
  </div>
</div>
</template>

<script>
/**
 * ts-navbar
 * @module components/navbar
 * @desc 顶部 tab，依赖 tab-item
 *
 * @param {*} selected - 返回 item component 传入的 value
 *
 * @example
 * <ts-navbar :selected.sync="selected">
 *   <ts-tab-item value="订单">
 *     <span slot="label">订单</span>
 *   </ts-tab-item>
 * </ts-navbar>
 *
 * <ts-navbar :selected.sync="selected" fixed>
 *   <ts-tab-item :value="['传入数组', '也是可以的']">
 *     <span slot="label">订单</span>
 *   </ts-tab-item>
 * </ts-navbar>
 *
 */
export default {
  props: {
    value: {},
    bordered: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.$emit('change', val);
    }
  }
};
</script>

<style lang="css">
@import '../../../common/css/_var.css';
@component-namespace ts {
    @component navbar {
      background-color: #fff;
      text-align: center;
      border-bottom: 1px solid #eaeaea;
      @descendent wrap{
        overflow: hidden;
        display: flex;
        margin-bottom: -1px;
        .ts-tab-item {
          &:last-child {
            border-right: 0;
          }
          &.is-selected {
            border-bottom: 3px solid var(--navbar-color);
            color: var(--navbar-color);
          }
        }
        @when bordered{
          &.ts-navbar-wrap{
            padding-left: 40px;
            padding-right: 40px;
          }
          .ts-tab-item{
            border: 1px solid transparent;
            &.is-selected{
              border: 1px solid #eaeaea;
              border-bottom-color: #fff;
              border-radius: 2px 2px 0 0;
            }
          }
        }
      }
    }
  }
</style>
