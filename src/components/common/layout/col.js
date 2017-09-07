import './col.scss';
export default {
  name: 'tsCol',
  props: {
    span: {
      type: Number,
      default: 24
    },
    tag: {
      type: String,
      default: 'div'
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [
      Number, Object
    ],
    sm: [
      Number, Object
    ],
    md: [
      Number, Object
    ],
    lg: [Number, Object]
  },
  computed: {
    gutter() {
      let parent = this.$parent;
      while (parent && parent.$options.componentName !== 'tsRow') {
        parent = parent.$parent;
      }
      return parent
        ? parent.gutter
        : 0;
    }
  },
  render(h) {
    let classList = [];
    let style = {};
    if (this.gutter) {
      style.paddingLeft = this.gutter / 2 + 'px';
      style.paddingRight = style.paddingLeft;
    }['span', 'offset'].forEach(prop => {
      if (this[prop]) {
        classList.push(prop !== 'span'
          ? `ts-col-${prop}-${this[prop]}`
          : `ts-col-${this[prop]}`);
      }
    });
    return h(this.tag, {
      class: [
        'ts-col', classList
      ],
      style
    }, this.$slots.default);
  }
};
