<template lang="html">
  <div class="ts-step" :style="[style,  isLast ? '' : { marginRight: - $parent.stepOffset + 'px' }]">
    <div
         class="ts-step--head is-text"
         :class="['is-' + currentStatus]">
         <div
           class="ts-step--line"
           :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }">
           <i class="ts-step--line-inner" :style="lineStyle"></i>
         </div>
         <span class="ts-step--icon">
           <slot
              v-if="currentStatus !== 'success' && currentStatus !== 'error'"
              name="icon">
              <div>{{ index + 1 }}</div>
            </slot>
          </slot>
          <!--  :class="['icon-' + (currentStatus === 'success' ? 'wancheng' : 'wancheng')]" -->
           <i v-else
           class="icon-wancheng"
             >
           </i>
         </span>
    </div>
   <div
    class="ts-step--main"
    :style="{ marginLeft: mainOffset }">
    <div
      class="ts-step--title"
      ref="title"
      :class="['is-' + currentStatus]">
      <slot name="title">{{ title }}</slot>
    </div>
    <div
      class="ts-step--description"
      :class="['is-' + currentStatus]">
      <slot name="description">{{ description }}</slot>
    </div>
</div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    status: String
  },
  data() {
    return {
      index: -1,
      lineStyle: {},
      mainOffset: 0,
      internalStatus: ''
    };
  },
  beforeCreate() {
    this.$parent.steps.push(this);
  },
  beforeDestroy() {
    const steps = this.$parent.steps;
    const index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },
  computed: {
    currentStatus() {
      return this.status || this.internalStatus;
    },
    isLast() {
      const parent = this.$parent;
      return parent.steps[parent.steps.length - 1] === this;
    },
    style() {
      const parent = this.$parent;
      const len = parent.steps.length;
      if (this.isLast) {
        return {};
      }
      const space = (typeof parent.space === 'number' ? parent.space + 'px' : parent.space ? parent.space : 100 / len + '%');
      return {
        width: space
      };
    }
  },
  methods: {
    updateStatus(val) {
      const prevChild = this.$parent.$children[this.index - 1];
      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus;
      } else if (val === this.index) {
        this.internalStatus = this.$parent.processStatus;
      } else {
        this.internalStatus = 'wait';
      }
      if (prevChild) prevChild.calcProgress(this.internalStatus);
    },
    calcProgress(status) {
      let step = 100;
      const style = {};
      style.transitionDelay = 150 * this.index + 'ms';
      if (status === this.$parent.processStatus) {
        step = 50;
      } else if (status === 'wait') {
        step = 0;
        style.transitionDelay = (-150 * this.index) + 'ms';
      }
      style.borderWidth = step ? '1px' : 0;
      style.width = step + '%';
      this.lineStyle = style;
    }
  },
  mounted() {
    const parent = this.$parent;
    if (parent.direction === 'horizontal') {
      if (parent.alignCenter) {
        this.mainOffset = -this.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
      }
    }
    const unwatch = this.$watch('index', val => {
      this.$watch('$parent.active', this.updateStatus, {
        immediate: true
      });
      unwatch();
    });
  }
};
</script>

<style lang="css" scoped>
:root{
  --color-extra-light-silver:#bfcbd9;
  --color-extra-light-black:#48576a;
  --color-success: #13ce66;
  --color-danger: #ff4949;
  --color-white:#fff;
  --color-primary: #4C93FD;
  --color-light-silver:#97a8be;
}
@component-namespace ts {
  @component step {
    position: relative;
    vertical-align: top;
    display: inline-block;
    &:last-child .ts-step--main {
      padding-right: 0;
    }

    @when horizontal {
      display: inline-block;
    }

    @modifier line {
      display: inline-block;
      position: absolute 15px 0 * 32px;
      border-color: inherit;
      background-color: var(--color-extra-light-silver);
      height: 2px;
      @when icon {
        @when horizontal {
          right: 4px;
        }
      }
    }
    @modifier line-inner {
      display: block;
      border-width: 1px;
      border-style: solid;
      border-color: inherit;
      transition: all 150ms;
      width: 0;
      height: 0;
    }

    @modifier icon {
      display: block;
      line-height: 28px;

      > * {
        line-height: inherit;
        vertical-align: middle;
      }
    }

    @modifier head {
      circle: 28px transparent;
      text-align: center;
      line-height: 28px;
      font-size: 28px;
      vertical-align: top;
      transition: all 150ms;
      font-size: 14px;
      border-width: 2px;
      border-style: solid;
      @when text {
        font-size: 14px;
        border-width: 2px;
        border-style: solid;

        @when process {
          color: var(--color-white);
          background-color: var(--color-extra-light-silver);
          border-color: var(--color-extra-light-silver);
        }

        @when wait {
          color: var(--color-extra-light-silver);
          background-color: var(--color-white);
          border-color: var(--color-extra-light-silver);
        }

        @when success {
          color: var(--color-white);
          background-color: var(--color-success);
          border-color: var(--color-success);
        }

        @when error {
          color: var(--color-white);
          background-color: var(--color-danger);
          border-color: var(--color-danger);
        }

        @when finish {
          color: var(--color-white);
          background-color: var(--color-primary);
          border-color: var(--color-primary);
        }
      }

      @when process {
        color: var(--color-extra-light-silver);
        border-color: var(--color-extra-light-silver);
      }

      @when wait {
        color: var(--color-extra-light-silver);
        border-color: var(--color-extra-light-silver);
      }

      @when success {
        color: var(--color-success);
        border-color: var(--color-success);
      }

      @when error {
        color: var(--color-danger);
        border-color: var(--color-danger);
      }

      @when finish {
        color: var(--color-primary);
        border-color: var(--color-primary);
      }
    }

    @modifier main {
      white-space: normal;
      padding-right: 10px;
      text-align: left;
    }

    @modifier title {
      font-size: 14px;
      line-height: 32px;
      display: inline-block;

      @when process {
        font-weight: 700;
        color: var(--color-extra-light-black);
      }

      @when wait {
        font-weight: normal;
        color: var(--color-light-silver);
      }

      @when success {
        font-weight: 700;
        color: var(--color-success);
      }

      @when error {
        font-weight: 700;
        color: var(--color-danger);
      }

      @when finish {
        font-weight: 700;
        color: var(--color-primary);
      }
    }

    @modifier description {
      font-size: 12px;
      font-weight: normal;
      line-height: 14px;

      @when process {
        color: var(--color-base-silver);
      }

      @when wait {
        color: var(--color-extra-light-silver);
      }

      @when success {
        color: var(--color-success);
      }

      @when error {
        color: var(--color-danger);
      }

      @when finish {
        color: var(--color-primary);
      }
    }
  }
}
.icon-wancheng{
  &:before{
    color:#fff;
  }
}
</style>
