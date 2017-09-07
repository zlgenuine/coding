<template lang="html">
  <label class="ts-switch" :class="{'is-disabled':disabled,'is-checked':checked,'ts-switch--wide':hasText}">
    <!-- 禁用 -->
    <div class="ts-switch--mask" v-show="disabled">
    </div>
    <input type="checkbox" :name="name" :disabled="disabled" :true-value="onValue"
    :false-value="offValue" @change="handleChange" ref="input" class="ts-switch--input">
    <!-- 文字 -->
    <span class="ts-switch--core" ref="core" :style="{'width':`${coreWidth}px`}">
      <!-- 圆珠 -->
      <span class="ts-switch--button" :style="{transform}"></span>
    </span>
    <transition name="label-fade">
      <div class="ts-switch--label left" v-show="checked" :style="{'width':`${coreWidth}px`}">
        <span v-if="onText">{{ onText }}</span>
      </div>
    </transition>
    <transition name="label-fade">
      <div
        class="ts-switch--label right"
        v-show="!checked"
        :style="{ 'width': coreWidth + 'px' }">
        <span v-if="offText">{{ offText }}</span>
      </div>
    </transition>
  </label>
</template>

<script>
export default {
  props: {
    /**
     * value v-model的值
     * disabled 禁止状态
     * width 自定义宽度
     * ontext 开的时候显示的文字
     * onValue 开的时候的值
     * onColor 开的时候的颜色
     * offColor 关的时候的颜色
     * offtext 关的时候显示的文字
     * offValue 关的时候的值
     */
    value: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number
    },
    onText: {
      type: String,
      default: '允许'
    },
    onValue: {
      type: [Boolean, String, Number],
      default: true
    },
    offValue: {
      type: [Boolean, String, Number],
      default: false
    },
    offText: {
      type: String,
      default: '拒绝'
    },
    onColor: {
      type: String,
      default: ''
    },
    offColor: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      coreWidth: this.width
    };
  },
  created() {
    // 默认是关
    if (!~[this.onValue, this.offValue].indexOf(this.value)) {
      this.$emit('input', this.offValue);
    }
  },
  methods: {
    setBackGroundColor() {
      let newColor = this.checked ? this.onColor : this.offColor;
      this.$refs.core.style.borderColor = newColor;
      this.$refs.core.style.backgroundColor = newColor;
    },
    handleChange(event) {
      this.$emit('change', !this.checked ? this.onValue : this.offValue);
      this.$emit('input', !this.checked ? this.onValue : this.offValue);
      this.$nextTick(() => {
        this.$refs.input.checked = this.checked;
      });
    }
  },
  watch: {
    checked() {
      if (this.onColor || this.offColor) {
        this.setBackGroundColor();
      }
    }
  },
  mounted() {
    if (!this.width) {
      this.coreWidth = this.hasText ? 85 : 50;
    }
    if (this.onColor || this.offColor) {
      this.setBackGroundColor();
    }
    this.$refs.input.checked = this.checked;
  },
  computed: {
    checked() {
      return this.value === this.onValue;
    },
    hasText() {
      return this.onText || this.offText;
    },
    transform() {
      return this.checked ? `translate(${this.coreWidth - 24 - 11}px,1px)` : 'translate(1px,1px)';
    }
  }
};
</script>

<style lang="css" scoped>
:root{
  --switch-width:85px;
  --switch-height:32px;
  --switch-off-color:#999999;
  --switch-on-color:#4C93FD;
  --switch-button-width:24px;
  --switch-disabled-color:#eaeaea;
}
@component-namespace ts{
  @component switch{
    display: inline-block;
    position: relative;
    vertical-align: middle;
    height: var(--switch-height);
    line-height: var(--switch-height);
    & .label-fade-enter,
    & .label-fade-leave-active {
      opacity: 0;
    }
    @modifier input{
      display: none;
    }
    @modifier wide{
      .left{
        span{
          left: 10px;
        }
      }
      .right{
        span{
          right: 10px;
        }
      }
    }
    @when checked{
      .ts-switch--core{
        background: var(--switch-on-color);
      }
    }
    @when disabled {
      .ts-switch--core {
        border-color: var(--switch-disabled-color) !important;
        background: var(--switch-disabled-color) !important;
        & span {
          background-color: var(--switch-off-color) !important;
        }
        & ~ .ts-switch--label * {
          color: var(--switch-disabled-text-color) !important;
        }
      }
    }
    @modifier core{
      margin: 0;
      display: inline-block;
      position: relative;
      cursor: pointer;
      background: var(--switch-off-color);
      size: var(--switch-width) var(--switch-height);
      box-sizing: border-box;
      border-radius: 2px;
      outline: none;
      transition: border-color .3s, background-color .3s;
       .ts-switch--button{
        position: absolute 0 * * 0;
        border-radius: 2px;
        transition: transform .3s;
        size: calc(var(--switch-width)/2.5) calc(var(--switch-height)-2px);
        background: #fff;
      }
    }
    @modifier label{
      transition: .2s;
      position: absolute 0 * * 0;
      size: var(--switch-width) var(--switch-height);
      display: inline-block;
      cursor: pointer;
      & *{
        line-height: 1;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        color: #fff;
      }
    }
    @when disabled{
      .ts-switch--core,
      .ts-switch--label{
        cursor: not-allowed;
      }
    }
  }
}
</style>
