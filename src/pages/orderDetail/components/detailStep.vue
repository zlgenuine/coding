<template lang="html">
  <div class="detailStep-wrapper">
    <div class="detailStep-step" v-show="show">
      <span class="detailStep-step-item" :class="{'is-active': !!~item.value.indexOf(transferId)}" v-for="(item,index) in data">{{index+1}}.{{item.label}}</span>
    </div>
    <div class="detailStep-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [String, Number]
    },
    show: {
      type: Boolean,
      default: true
    },
    step: {
      type: Array
    },
    stepLabel: String,
    stepValue: String
  },
  data() {
    return {
      label: '',
      value: ''
    };
  },
  computed: {
    transferId() {
      return this.id.toString();
    },
    data() {
      var retDataList = [];
      let {
        step,
        stepLabel,
        stepValue
      } = this;
      for (var index in Object.keys(step)) {
        var item = step[index];
        retDataList.push({
          label: item[stepLabel],
          value: item[stepValue]
        });
      }
      return retDataList;
    }
  },
  created() {
    if (this.stepLabel || this.stepValue) {
      this.label = this.stepLabel;
      this.value = this.stepValue;
    }
  }
};
</script>

<style lang="css" scoped>
@component-namespace detailStep{
  @component step{
    background: #F8F8F8;
    text-align: center;
    padding: 4px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 16px;
    @descendent item{
      margin-left: 30px;
      margin-right: 15px;
      padding: 0 15px;
      display: inline-block;
      transition: .3s;
      @when active{
        background: #4C93FD;
        color: #fff;
        border-radius: 2px;
        position: relative;
        &:before{
          position:absolute;
          content:'';
          width: 0;
          height: 0;
          bottom: -20px;
          left:50%;
          transform:translateX(-50%);
          border-bottom: 8px solid #4C93FD;
          border-top: 8px solid transparent;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
        }
      }
      & + .detailStep-step-item{
        position: relative;
        &:after{
          content: " ";
          display: inline-block;
          height: 6px;
          width: 6px;
          border-width: 2px 2px 0 0;
          border-color: grey;
          border-style: solid;
          position: absolute;
          top: 50%;
          margin-top: -4px;
          left: -30px;
          transform:matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        }
      }
    }
  }
  @component content{
    background: rgba(76,147,253,0.05);
    border: 1px solid #4C93FD;
    padding: 10px;
    border-radius: 3px;
  }
}
</style>
