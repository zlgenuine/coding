<template>
<form class="ts-form" :class="[labelPosition?'ts-form--label-'+labelPosition:'',{ 'ts-form--inline': inline }]">
  <slot></slot>
</form>
</template>

<script>
export default {
  name: 'tsForm',

  componentName: 'tsForm',

  props: {
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    inline: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    rules() {
      this.validate();
    }
  },
  data() {
    return {
      fields: []
    };
  },
  created() {
    this.$on('ts.form.addField', (field) => {
      if (field) {
        this.fields.push(field);
      }
    });
    this.$on('ts.form.removeField', (field) => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    });
  },
  methods: {
    resetFields() {
      this.fields.forEach(field => {
        field.resetField();
      });
    },
    validate(callback) {
      let valid = true;
      let count = 0;
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      this.fields.forEach((field, index) => {
        field.validate('', errors => {
          if (errors) {
            valid = false;
          }
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid);
          }
        });
      });
    },
    validateField(prop, cb) {
      var field = this.fields.filter(field => field.prop === prop)[0];
      if (!field) {
        throw new Error('must call validateField with valid prop string!');
      }

      field.validate('', cb);
    }
  }
};
</script>
<style scoped>
@component-namespace ts {
  @component form {
    @modifier inline {
      & .ts-form-item {
        display: inline-block;
        margin-right: 10px;
        vertical-align: top;
      }
      & .ts-form-item--label {
        float: none;
        display: inline-block;
      }
      & .ts-form-item--content {
        display: inline-block;
        vertical-align: top;
      }
      &.ts-form--label-top .ts-form-item--content {
        display: block;
      }
    }
  }
}
</style>
