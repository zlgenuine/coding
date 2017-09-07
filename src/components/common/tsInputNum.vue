<template lang="html">
  <div class="ts-input-number" :class="{'is-disabled': disabled}">
    <a @click="decrease" class="ts-input-number-selector ts-input-number-selector--sub" :class="{'is-disabled':minDisabled}">
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs></defs><path d="M863.74455 544.00086 163.424056 544.00086c-17.664722 0-32.00086-14.336138-32.00086-32.00086s14.336138-32.00086 32.00086-32.00086l700.320495 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.440237 544.00086 863.74455 544.00086z"></path></svg>
    </a>
    <ts-input :disabled="disabled" ref="input" class="ts-input-number--inner" v-model.number="currentValue" :style="{'width':width}" @input="debounceHandleInput" @blur="handleBlur"></ts-input>
    <a @click="increase" class="ts-input-number-selector ts-input-number-selector--plus" :class="{'is-disabled':maxDisabled}">
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs></defs><path d="M863.328262 481.340895l-317.344013 0.099772L545.984249 162.816826c0-17.664722-14.336138-32.00086-32.00086-32.00086s-31.99914 14.336138-31.99914 32.00086l0 318.400215-322.368714-0.17718c-0.032684 0-0.063647 0-0.096331 0-17.632039 0-31.935493 14.239806-32.00086 31.904529-0.096331 17.664722 14.208843 32.031824 31.871845 32.095471l322.59234 0.17718 0 319.167424c0 17.695686 14.336138 32.00086 31.99914 32.00086s32.00086-14.303454 32.00086-32.00086L545.982529 545.440667l317.087703-0.099772c0.063647 0 0.096331 0 0.127295 0 17.632039 0 31.935493-14.239806 32.00086-31.904529S880.960301 481.404542 863.328262 481.340895z"></path></svg>
    </a>
  </div>
</template>

<script>
import Emitter from '@/common/js/mixins/emitter';
import debounce from 'lodash.debounce';
export default {
  name: 'ElInputNumber',
  mixins: [Emitter],
  props: {
    step: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {
      default: 0
    },
    disabled: Boolean,
    size: String,
    controls: {
      type: Boolean,
      default: true
    },
    debounce: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      currentValue: 0
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        let newVal = Number(value);
        if (isNaN(newVal)) return;
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        this.currentValue = newVal;
        this.$emit('input', newVal);
        this.dispatch('tsFormItem', 'ts.form.change', [this.value]);
      }
    }
  },
  computed: {
    minDisabled() {
      return this._decrease(this.value, this.step) < this.min;
    },
    maxDisabled() {
      return this._increase(this.value, this.step) > this.max;
    },
    precision() {
      const {
        value,
        step,
        getPrecision
      } = this;
      return Math.max(getPrecision(value), getPrecision(step));
    }
  },
  methods: {
    toPrecision(num, precision) {
      if (precision === undefined) precision = this.precision;
      return parseFloat(parseFloat(Number(num).toFixed(precision)));
    },
    getPrecision(value) {
      const valueString = value.toString();
      const dotPosition = valueString.indexOf('.');
      let precision = 0;
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1;
      }
      return precision;
    },
    _increase(val, step) {
      if (typeof val !== 'number') return this.currentValue;

      const precisionFactor = Math.pow(10, this.precision);

      return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
    },
    _decrease(val, step) {
      if (typeof val !== 'number') return this.currentValue;

      const precisionFactor = Math.pow(10, this.precision);

      return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
    },
    increase() {
      if (this.disabled || this.maxDisabled) return;
      const value = this.value || 0;
      const newVal = this._increase(value, this.step);
      if (newVal > this.max) return;
      this.setCurrentValue(newVal);
    },
    decrease() {
      if (this.disabled || this.minDisabled) return;
      const value = this.value || 0;
      const newVal = this._decrease(value, this.step);
      if (newVal < this.min) return;
      this.setCurrentValue(newVal);
    },
    handleBlur() {
      this.$refs.input.setCurrentValue(this.currentValue);
    },
    setCurrentValue(newVal) {
      const oldVal = this.currentValue;
      if (newVal >= this.max) newVal = this.max;
      if (newVal <= this.min) newVal = this.min;
      if (oldVal === newVal) {
        this.$refs.input.setCurrentValue(this.currentValue);
        return;
      }
      this.$emit('change', newVal, oldVal);
      this.$emit('input', newVal);
      this.currentValue = newVal;
    },
    handleInput(value) {
      if (value === '') {
        return;
      }
      const newVal = Number(value);
      if (!isNaN(newVal)) {
        this.setCurrentValue(newVal);
      } else {
        this.$refs.input.setCurrentValue(this.currentValue);
      }
    }
  },
  created() {
    this.debounceHandleInput = debounce(value => {
      this.handleInput(value);
    }, this.debounce);
  }
};
</script>

<style lang="css" scoped>
@component-namespace ts{
  @component input-number{
    display: inline-table;
    @when disabled{
      .ts-input-number-selector{
        background-color: #eef1f6;
        border-color: #d1dbe5;
        color: #bbb;
        cursor: not-allowed;
        svg{
          fill:#d1d1d1;
        }
      }
    }
    @descendent selector{
      appearance: none;
      background-color: #fff;
      border: 1px solid #D1D1D1;
      box-sizing: border-box;
      display: table-cell;
      line-height: 1;
      outline: none;
      padding: 3px 10px;
      vertical-align: middle;
      transition: all .2s cubic-bezier(.645, .045, .355, 1);
      &:hover{
        background-color: #f8f8f8;
      }
    }
    @modifier inner{
      margin-right: 4px;
      margin-left: 4px;
      width: auto;
    }
  }
}
svg{
  fill: grey;
}
</style>
<style media="screen">
.ts-input-number--inner {
  input.ts-input--inner {
    text-align: center;
  }
}
</style>
