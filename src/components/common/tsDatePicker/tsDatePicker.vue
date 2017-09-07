<template lang="html">
  <div class="ts-datepicker" @mouseover="handleMouseOver" v-clickoutside="handleEndChoice">
    <ts-input ref="input" :placeholder="placeholder" readonly v-model="formatValue" @click.native="handleStartChoice">
    </ts-input>
      <!-- ======== -->
      <!-- 日期选择 -->
      <!-- ======== -->
      <transition name="list" mode="out-in">
        <div class="ts-datepicker-panels" v-show="dayPanelIsShow || monthPanelIsShow">
          <!-- 1.具体日子选择 -->
          <div class="ts-datepicker-panel" v-show="dayPanelIsShow">
            <div class="ts-datepicker-month">
              <a @click="handlePrevMonth">&lt;</a>
              <span class="ts-datepicker-btn" @click="handleChoiceMonth">
                {{year}}年{{month+1}}月
              </span>
              <a @click="handleNextMonth">&gt;</a>
            </div>
            <table class="ts-datepicker-panel--table2">
              <thead>
                <tr>
                  <th v-for="day in langConf.week">{{day}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(month,mIndex) in monthDays" :key="month">
                  <td v-for="(day,dayIndex) in month" :key="day" @click="handleChoiceDay(day,$event)" :class="classDay(day)">
                  <span>{{ day }}</span>
                </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 2.月份选择 -->
          <div class="ts-datepicker-panel" v-show="monthPanelIsShow">
            <div class="ts-datepicker-month">
              <a @click="handlePrevYear">&lt;</a>
              <span>
                {{year}}年
              </span>
              <a @click="handleNextYear">&gt;</a>
            </div>
            <table class="ts-datepicker-panel--table">
              <col width="33%" />
    				  <col width="33%" />
    				  <col width="33%" />
              <tbody>
                <tr v-for="(season,sIndex) in monthArr" :key="season">
                  <td v-for="(month,mIndex) in season" :key="month" @click="choiceMonth(month.id)" :class="classMonth(month.id)">
                    <span>{{month.name}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>


  </div>
</template>

<script>
import Clickoutside from '@/common/js/clickoutside';
// 日期格式化输出
//	日期格式化输出
function dateFormat(y, m, d, fm) {
  if (!fm) {
    fm = 'yyyy-mm-dd';
  }
  m = ('0' + (parseInt(m) + 1)).slice(-2);
  d = ('0' + d).slice(-2);
  return fm.replace('yyyy', y)
    .replace('YYYY', y)
    .replace('mm', m)
    .replace('MM', m)
    .replace('DD', d)
    .replace('dd', d);
}
// 比较两个日期大小，如果date1大于date2 =>true ，否则false
function dateCompare(date1, date2) {
  if (date1.year === date2.year) {
    if (date1.day && date2.day) {
      if (date1.month === date2.month) {
        return date1.day > date2.day ? 1 : (date1.day === date2.day ? 0 : -1);
      } else {
        return date1.month > date2.month ? 1 : -1;
      }
    } else {
      return date1.month > date2.month ? 1 : (date1.month === date2.month ? 0 : -1);
    }
  } else {
    return date1.year > date2.year ? 1 : -1;
  }
}
export default {
  data() {
    let {
      value,
      conf
    } = this;
    let dateObj = value ? new Date(value) : new Date();
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    let day = dateObj.getDate();
    let langConf = {
      week: ['日', '一', '二', '三', '四', '五', '六'],
      month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    if (conf) {
      langConf = Object.assign(langConf, conf);
    }
    return {
      langConf,
      year,
      month,
      day,
      dayPanelIsShow: false,
      monthPanelIsShow: false,
      isMouseOver: false
    };
  },
  directives: {
    Clickoutside
  },
  computed: {
    //	日期二维数组（3*4），渲染用
    monthArr() {
      let {
        month
      } = this.langConf;
      let res = [];
      for (let i = 0; i <= 3; i++) {
        let temp = [];
        for (let j = 1; j <= 3; j++) {
          let id = i * 3 + j - 1;
          temp.push({
            id,
            name: month[id]
          });
        }
        res.push(temp);
      }
      return res;
    },
    formatValue() {
      let {
        curr,
        value
      } = this;
      if (value) {
        return dateFormat(curr.year, curr.month, curr.day);
      }
    },
    // 返回当前日期
    curr() {
      let {
        value,
        noToday
      } = this;
      let dateObj;
      if (value) {
        dateObj = new Date(value);
      } else if (!noToday) {
        dateObj = new Date();
      } else {
        return {
          year,
          month,
          day
        };
      }
      let year = dateObj.getFullYear();
      let month = dateObj.getMonth();
      let day = dateObj.getDate();
      return {
        year,
        month,
        day
      };
    },
    today() {
      let dateObj = new Date();
      let year = dateObj.getFullYear();
      let month = dateObj.getMonth();
      let day = dateObj.getDate();
      return {
        year,
        month,
        day
      };
    },
    monthDays() {
      let {
        year,
        month
      } = this;
      let dayNum;
      month++;
      // 判断一个月有几天
      if (month === 2) {
        let leapyear = year % 4 === 0 && !(year % 100 === 0 && year % 400 !== 0);
        dayNum = leapyear ? 29 : 28;
      } else {
        let isSingular = [1, 3, 5, 7, 8, 10, 12].includes(month);
        dayNum = isSingular ? 31 : 30;
      }
      // // 生成对应星期的日期数组
      let firstDay = new Date(year, month - 1, 1).getDay();
      let dayArr = new Array(6).fill(0).map(function() {
        return new Array(7).fill('');
      });
      let row = 0;
      let col = firstDay;
      for (let d = 1; d <= dayNum; d++) {
        dayArr[row][col] = d;
        if (col < 6) {
          col++;
        } else {
          col = 0;
          row++;
        }
      }
      return dayArr;
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    // 格式化
    format: {
      type: String,
      default: 'yyyy-mm-dd'
    },
    // 向前看，只能选今天及以后
    forward: {
      type: Boolean,
      default: false
    },
    // 不能选今天
    today: {
      type: Boolean,
      default: false
    },
    // 向后看，不能选今天及以后
    backward: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    conf: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  methods: {
    // 判断日期是否合法 dateObj格式{year,month,day}
    dateIsValid(dateObj) {
      let {
        today,
        forward,
        backward,
        noToday
      } = this;
      if (forward && dateCompare(today, dateObj) > 0) {
        return false;
      }
      if (backward && dateCompare(today, dateObj) < 0) {
        return false;
      }
      if (noToday && dateObj.day && dateCompare(today, dateObj) === 0) {
        return false;
      }
      return true;
    },
    handleMouseOver() {
      this.isMouseOver = true;
    },
    // 立即关闭日期面板
    immEndChoice() {
      this.isMouseOver = false;
      this.dayPanelIsShow = false;
    },
    // 月份选择
    handleChoiceMonth() {
      this.dayPanelIsShow = false;
      this.monthPanelIsShow = true;
    },
    // 选择上一年
    handlePrevYear() {
      let {
        year,
        forward,
        today
      } = this;
      if (forward && today.year >= year) {
        return false;
      }
      this.year--;
    },
    // 选择下一年
    handleNextYear() {
      let {
        year,
        backward,
        today
      } = this;
      if (backward && today.year <= year) {
        return false;
      }
      this.year++;
    },
    handleStartChoice() {
      this.dayPanelIsShow = true;
      this.monthPanelIsShow = false;
    },
    choiceMonth(m) {
      let {
        year
      } = this;
      if (this.dateIsValid({
          year,
          month: m
        })) {
        this.month = m;
        this.dayPanelIsShow = true;
        this.monthPanelIsShow = false;
      }
    },
    handlePrevMonth() {
      let {
        year,
        month
      } = this;
      if (this.dateIsValid({
          year,
          month: month - 1
        })) {
        if (month > 1) {
          this.month--;
        } else {
          this.year--;
          this.month = 11;
        }
      }
    },
    handleNextMonth() {
      let {
        year,
        month
      } = this;
      if (this.dateIsValid({
          year,
          month: month + 1
        })) {
        if (month < 11) {
          this.month++;
        } else {
          this.year++;
          this.month = 0;
        }
      }
    },
    // 选择日期 =>并公开@input
    handleChoiceDay(d) {
      let {
        year,
        month,
        format
      } = this;
      if (d && this.dateIsValid({
          year,
          month,
          day: d
        })) {
        this.day = d;
        this.$emit('input', dateFormat(year, month, d, format));
        this.immEndChoice();
      }
    },
    // 鼠标离开日期选择区域时超过一定时间，关闭日期面板
    handleEndChoice(e) {
      this.isMouseOver = false;
      this.dayPanelIsShow = false;
    },
    // 样式
    classMonth(m) {
      let {
        month,
        year,
        curr
      } = this;
      return {
        'is-on': m === month && curr.year === year,
        'is-existed': true,
        'is-invalid': !this.dateIsValid({
          year,
          month: m
        })
      };
    },
    classDay(d) {
      let {
        month,
        year,
        curr
      } = this;
      return {
        'is-on': curr.day === d && curr.month === month && curr.year === year,
        'is-existed': d !== '',
        'is-invalid': !this.dateIsValid({
          year,
          month,
          day: d
        })
      };
    }
  }
};
</script>

<style lang="css" scoped>
:root{
  --width:35px;
  --grey:#eaeaea;
  --grey2:#f5f6f7;
  --c1:#4c93fd;
}
@component-namespace ts{
  @component datepicker{
    position: relative;
    margin: 0;
    padding: 0;
    color:#666;
    .ts-input{
      /*width: calc(var(--width) * 7);*/
     	width: 100%;  /* 宽度需要自定义 */
    }
    @descendent panels{
      position:  absolute;
      left: 0;
      z-index: 99;
      background: #fff;
      width: calc(var(--width) * 7);
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.18);
      box-sizing: border-box;
    }
    @descendent month{
			height: var(--width);
			line-height: var(--width);
			overflow: hidden;
			text-align: center;
      a {
				float: left;
				display: block;
				width: var(--width);
				cursor: pointer;
				color: #999;
				font-size: 12px;
				&:hover {
					background-color:var(--grey2);
				}
			}
			span {
				float: left;
				display: block;
				width: calc(var(--width) * 5);
				&.ts-datepicker-btn {
					&:hover {
						background-color: var(--grey2);
						cursor: pointer;
					}
				}
			}
    }
    @descendent panel{
      @modifier table2{
        width:calc(var(--width) * 7);
        border-collapse: collapse;
        text-align: center;
        thead{
          background: var(--grey2);
          height: var(--width);
          line-height: var(--width);
          border-top: 1px solid var(--grey);
          border-bottom: 1px solid var(--grey);
          tr{
            border: none;
            th{
              font-weight: normal;
              border: none;
              width: var(--width);
            }
          }
        }
        tbody{
          tr{
            border-top: 1px solid #eee;
            td{
              height: calc(var(--width) * 0.9);
              @when on{
                span{
                  color:#eee;
                  background: var(--c1);
                }
              }
              @when invalid{
                cursor:not-allowed;
                span{
                  color:var(--grey);
                }
                &:hover{
                  background: transparent;
                }
              }
              @when existed{
                cursor: pointer;
                span{
                  display: block;
                  height: var(--width);
                  line-height: var(--width);
                }
              &:hover {
                background-color: var(--grey2);
                color: var(--c1);
                  }
              }
            }
          }
        }
      }
      @modifier table{
        width:calc(var(--width) * 7);
        border-collapse: collapse;
        text-align: center;
        thead{
          background: var(--grey2);
          height: var(--width);
          line-height: var(--width);
          border-top: 1px solid var(--grey);
          border-bottom: 1px solid var(--grey);
          tr{
            border: none;
            th{
              font-weight: normal;
              border: none;
              width: var(--width);
            }
          }
        }
        tbody{
          tr{
            border-top: 1px solid #eee;
            td{
              height: calc(var(--width) * 0.9);
              @when on{
                span{
                  color:#eee;
                  background: var(--c1);
                }
              }
              @when invalid{
                cursor:not-allowed;
                span{
                  color:var(--grey);
                }
                &:hover{
                  background: transparent;
                }
              }
              @when existed{
                cursor: pointer;
                span{
                  display: block;
                  height: var(--width);
                  line-height: var(--width);
                }
							&:hover {
								background-color: var(--grey2);
								color: var(--c1);
							    }
              }
            }
          }
        }
      }
    }
  }
}
.list-enter-active,
.list-leave-active {
    transition: all 0.2s;
}

.list-enter,
.list-leave-active {
    opacity: 0;
    transform: translateY(50px);
}
</style>
