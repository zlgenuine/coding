<template lang="html">
<div class="ts-steps" :class="[center ? 'is-center' : '']">
  <slot></slot>
</div>
</template>

<script>
export default {
  data() {
    return {
      steps: [],
      stepOffset: 0
    };
  },
  watch: {
    active(val) {
      this.$emit('change', val);
    },
    steps(steps) {
      steps.forEach((child, index) => {
        child.index = index;
      });
      if (this.center) {
        const len = steps.length;
        this.$nextTick(() => {
          this.stepOffset = steps[len - 1].$el.getBoundingClientRect().width / (len - 1);
        });
      }
    }
  },
  props: {
    center: Boolean,
    space: [Number, String],
    active: Number,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  }
};
</script>

<style lang="css" scoped>
@component-namespace ts {
  @component steps {
    font-size: 0;
    @when horizontal {
      white-space: nowrap;
      @when center {
        text-align: center;
      }
    }
  }
}
</style>
<style>
  .ts-steps{
    > :last-child .ts-step--line {
      display: none;
    }
  }
</style>
