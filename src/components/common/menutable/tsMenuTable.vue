<template>
<div class="ts-menuTable" :style="{'marginBottom':header?'16px':'0'}">
  <!-- 头部 -->
  <div class="ts-menuTable-header" v-if="header">
    <slot name="header-left">
    </slot>
    <div class="ts-menuTable-header--right">
      <slot name="header-right"></slot>
    </div>
  </div>
  <div class="ts-menuTable-content" :class="{'is-header':!header&&!content}">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  props: {
    header: {
      type: Boolean,
      default: true
    },
    prop: [Array, Object],
    content: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="css" scoped>
@import '../../../common/css/_var.css';
@component-namespace ts{
  @component menuTable{
    border-bottom: var(--menuTableHeaderBorder);
    /*margin-bottom: 16px;*/
    @descendent header{
      padding:10px;
      min-height: 40px;
      box-sizing: border-box;
      background: var(--menuTableHeaderBg);
      align-items: center;
      display: flex;
      @modifier right{
        flex:1;
        text-align: right;
      }
    }
    @descendent content{
      /*min-height: 100px;*/
      display: table;
      width: 100%;
      table-layout: fixed;
      &:last-child{
        border-bottom:none;
      }
      @when header{
        .ts-menutable-box{
          background:rgba(176, 207, 255, 0.57);
          border-right-color: #E8E8E8;
        }
      }
    }
  }
}
</style>
