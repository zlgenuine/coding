<template>
    <div class="magnifier">
        <div class="magnifier-small" :style="{width: width + 'px', height: height + 'px'}"
             @mousemove="showMagnifier" @mouseleave="hideMagnifier">
            <img :src="imgSrc"/>
            <span class="magnifier-floatBox"
                  :style="{left: floatStyleData.l + 'px', top: floatStyleData.t + 'px', width: s_width+'px', height: s_width+'px'}">
                <img style="opacity: 0" :src="imgSrc" width="100%" height="100%">
            </span>
        </div>
        <div class="magnifier-big"
             :style="{left: Number(width) + 1 + 'px', width: r_width + 'px'}">
            <img class="magnifier-showBigImg" :src="imgSrc"
                 :style="{left: imgStyleData.l + 'px', top: imgStyleData.t + 'px', width: b_width, height:b_width}"/>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      // 左侧小矩形width
      s_width: {type: Number, default: 80},
      imgSrc: {
        type: String,
        default: '../../../static/images/default/morenhuaxing.png'
      },
      // 左侧图片width/height
      width: {
        type: String,
        default: 422
      },
      height: {
        type: String,
        default: 422
      },
      // 右侧放大width/height
      r_width: {
        type: Number,
        default: 422
      },
      r_height: {
        type: Number,
        default: 422
      }
    },
    data () {
      return {
        floatStyleData: {
          l: '',
          t: ''
        },
        imgStyleData: {
          l: '',
          t: ''
        }
      };
    },
    computed: {
      // 放大倍数
      multiple: function () {
        return Number(this.r_width) / Number(this.s_width);
      },
      // 放大后图片width/height
      b_width: function () {
        return Number(this.width * this.multiple) + 'px';
      }
    },
    created () {
    },
    mounted () {
      this.$refs['img'].focus();
    },
    methods: {
      offset: function (ele) {
        let obj = {
          offsetLeft: 0,
          offsetTop: 0
        };
        let r = function (ele) {
          obj.offsetLeft += ele.offsetLeft;
          obj.offsetTop += ele.offsetTop;
          if (ele.offsetParent !== document.body) {
            r(ele.offsetParent);
          }
        };
        r(ele);
        return obj;
      },
      showMagnifier (ev) {
        // 图片为默认花型时  不展示放大镜
        if (this.imgSrc.indexOf('morenhuaxing') > -1) {
          return;
        }
        let oWrap = document.querySelector('.magnifier');
        let oSmall = document.querySelector('.magnifier-small');
        let oBig = document.querySelector('.magnifier-big');
        let oFloat = document.querySelector('.magnifier-floatBox');
        let oImg = document.querySelector('.magnifier-showBigImg');
        /* if (oImg.width < this.width) {
          return;
        } */
        // oFlaot
        let offset = this.offset(oSmall);
        this.floatStyleData.l = ev.clientX - offset.offsetLeft - oFloat.offsetWidth / 2;
        this.floatStyleData.t = ev.pageY - offset.offsetTop - oFloat.offsetHeight / 2;
        if (this.floatStyleData.l < 0) {
          this.floatStyleData.l = 0;
        } else if (this.floatStyleData.l > (oSmall.offsetWidth - oFloat.offsetWidth)) {
          this.floatStyleData.l = oSmall.offsetWidth - oFloat.offsetWidth;
        }
        ;
        if (this.floatStyleData.t < 0) {
          this.floatStyleData.t = 0;
        } else if (this.floatStyleData.t > (oSmall.offsetHeight - oFloat.offsetHeight)) {
          this.floatStyleData.t = oSmall.offsetHeight - oFloat.offsetHeight;
        }
        ;
        // img
        this.imgStyleData.l = -this.multiple * (oFloat.offsetLeft);
        this.imgStyleData.t = -this.multiple * (oFloat.offsetTop);
        oFloat.style.display = 'block';
        oBig.style.display = 'block';
      },
      hideMagnifier () {
        let oBig = document.querySelector('.magnifier-big');
        let oFloat = document.querySelector('.magnifier-floatBox');
        oFloat.style.display = 'none';
        oBig.style.display = 'none';
      }
    }
  };
</script>

<style lang="scss" scoped>
    .magnifier {
        position: relative;
        &-small {
            position: relative;
            box-sizing: content-box;
            /*width: 220px;
            height: 220px;
            line-height: 220px;*/
            outline: 1px solid #d1d1d1;
            overflow: hidden;
            cursor: move;
            img {
                width: 100%;
                height: 100%;
            }
            span {
                position: absolute;
                display: none;
                width: 80px;
                height: 80px;
                background: rgba(0, 0, 0, .4);
            }
            .mark {
                width: 100%;
                height: 100%;
                position: absolute;
                opacity: 0;
                top: 0;
                left: 0;
                z-index: 2;
            }
        }
        &-big {
            position: absolute;
            /*left: 221px;*/
            top: 0px;
            width: 422px;
            height: 422px;
            display: none;
            background: #fff;
            border: 1px solid #000;
            overflow: hidden;
            z-index: 9999;
            img {
                position: absolute;
                top: 0;
                left: 0;
                min-width: 100%;
                min-height: 100%;
            }
        }
    }
</style>
