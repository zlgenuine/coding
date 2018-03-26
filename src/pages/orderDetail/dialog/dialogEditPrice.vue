<template>
<!--  4.修改价格 -->
<ts-dialog width="80%" v-model="dialog.show">
  <p slot="title">
    <strong>
      修改价格&nbsp;
    </strong>
    <span>订单号：{{data.orderId}}</span>&nbsp;
    <span>下单时间：{{data.placeTime | filterDate('dateTime')}}</span>
  </p>
  <div class="dialog-editPrice">
    <ts-form :model="editPriceForm" :rules="rules" ref="editPriceForm" label-width="120px">
      <ts-row>
        <ts-col :span="12">
            <ts-form-item label="预付订金：" prop="payType">
                <ts-switch v-model="editPriceForm.payType" :onValue="2" :offValue="0"></ts-switch>
            </ts-form-item>
            <ts-form-item label="全款付款期限：" prop="paymentPeriod" v-if="editPriceForm.payType===0">
                <ts-input-num v-model="editPriceForm.paymentPeriod" :min="1" :max="getPaymentPeriod"></ts-input-num>&nbsp;天
            </ts-form-item>
            <ts-form-item label="定金金额：" prop="prepaidMoney" v-if="editPriceForm.payType===2">
                <ts-input v-model.number="editPriceForm.prepaidMoney" width="60%">
                    <span slot="append">元</span>
                </ts-input>
            </ts-form-item>
            <ts-form-item label="定金支付期限：" prop="paymentPeriod" v-if="editPriceForm.payType===2">
                <ts-input-num v-model="editPriceForm.paymentPeriod" :min="1" :max="getPaymentPeriod"></ts-input-num>&nbsp;天
            </ts-form-item>
            <ts-form-item label="运费设置：" prop="deliverType">
              <ts-radio-group v-model="editPriceForm.deliverType" bordered>
                <ts-radio :label="item.dicValue" :key="item.dicValue" v-for="item in DICT.FreightSetting" :title="item.tip">{{item.label}}</ts-radio>
              </ts-radio-group>
            </ts-form-item>
            <ts-form-item label="运费金额：" prop="logisticsMoney" v-if="editPriceForm.deliverType===4">
                <ts-input v-model.number="editPriceForm.logisticsMoney" width="60%">
                    <span slot="append">元</span>
                </ts-input>
            </ts-form-item>
            <ts-form-item label="一口价：" prop="orderMoney">
                <ts-input v-model="editPriceForm.orderMoney" width="60%">
                    <span slot="append">元</span>
                </ts-input>
                <ts-button type="text">提交一口价</ts-button>
            </ts-form-item>
        </ts-col>
        <ts-col :span="12" class="dialog-editPrice-detail">
          <ts-row>
            <ts-col :span="6">商品总额：</ts-col>
            <ts-col :span="18">
            <span v-if="noShowMoney">价格面议</span>
            <span v-else>￥{{totalPay}}</span>
            </ts-col>
            <ts-col :span="6">运费：</ts-col>
            <ts-col :span="18">
              <span v-if="editPriceForm.deliverType===4">￥{{editPriceForm.logisticsMoney}}</span>
              <span v-else>{{editPriceForm.deliverType | filterDict(DICT.FreightSetting)}}</span>
            </ts-col>
          </ts-row>
          <ts-row v-show="editPriceForm.payType===0">
            <ts-col :span="6">应收全款：</ts-col>
            <ts-col :span="18">
              <span v-if="noShowMoney">价格面议</span>
              <span v-else>￥{{totalPay}}</span>
            </ts-col>
          </ts-row>
          <ts-row v-show="editPriceForm.payType===2">
            <ts-col :span="6">应收定金：</ts-col>
            <ts-col :span="18">￥{{editPriceForm.prepaidMoney}}</ts-col>
            <ts-col :span="6">应收尾款：</ts-col>
            <ts-col :span="18">
              <span v-if="noShowMoney">价格面议</span>
              <span v-else>￥{{totalPay - editPriceForm.prepaidMoney}}</span>
            </ts-col>
          </ts-row>
          <ts-button type="primary" class="dialog-editPrice-detail--button">确认</ts-button>
          <p class="dialog-editPrice-detail--tip">如买家逾期未付款，系统将自动关闭订单</p>
        </ts-col>
      </ts-row>
      <ts-menu-table :header="false" class="dialog-editPrice-menu">
        <ts-menu-table-item>商品</ts-menu-table-item>
        <ts-menu-table-item>大货交易单价</ts-menu-table-item>
        <ts-menu-table-item>大货交易数量</ts-menu-table-item>
      </ts-menu-table>
      <div class="dialog-editPrice-menu-table">
        <ts-menu :prop="list">
        <ts-menu-table :header="false" content v-for="(item,index) in editPriceForm.orderItems" :key="index">
          <ts-menu-table-item>
            <div class="dialog-editPrice-detail--wrapper">
              <ts-image width="80" height="80" :src="item.picUrl"></ts-image>
              <div class="dialog-editPrice-detail--flex">
                <p>{{item.productId}}</p>
                <div class="detail">
                  <p><i>大货参考价：{{item.totalPrice}}</i>1233</p>
                  <p><i>数量：{{item.num}}</i>1233</p>
                </div>
              </div>
            </div>
          </ts-menu-table-item>
          <ts-menu-table-item>
           <ts-form-item :prop="'orderItems.' + index + '.price'" labelWidth="0">
              <ts-input v-model="item.price" width="60%">
              </ts-input>
              &nbsp;元 / 码
          </ts-form-item>
          </ts-menu-table-item>
          <ts-menu-table-item>
            <ts-form-item labelWidth="0">
              <ts-input-num v-model="item.num" :min="getSaleMin" :max="getSaleMax">
              </ts-input-num>&nbsp;码
            </ts-form-item>
          </ts-menu-table-item>
        </ts-menu-table>
      </ts-menu>
      </div>
    </ts-form>
  </div>
  <span slot="footer"></span>
</ts-dialog>
</template>
<script>
import DICT from '@/common/dict/index';
export default {
  data() {
      // 验证支付期限
      var validatePaymentPeriod = (rule, value, callback) => {
        if (value > this.OrderDefaultParam.paymentPeriod) {
          callback(new Error(`支付期限不能超过${this.OrderDefaultParam.paymentPeriod}天, 最小时效为1天`));
          return;
        }
        callback();
      };
      // 验证运费金额
      var validateLogisticsMoney = async(rule, value, callback) => {
        if (!value && this.editPriceForm.deliverType === 4) {
          callback(new Error('运费金额必须输入!'));
          return;
        }
        if (value && !/^[0-9]+(.[0-9]{2})?$/.test(value)) {
          callback(new Error('请输入正确的运费金额!'));
          return;
        }
        callback();
      };
    return {
      DICT: {
        FreightSetting: DICT.FreightSetting
      },
      num: '',
        // 订单--表单编辑
      editPriceForm: {
        deliverType: '',
        orderItems: [{
          num: '',
          price: ''
        }],
        logisticsMoney: '',
        orderMoney: '',
        payType: '',
        paymentPeriod: '',
        prepaidMoney: ''
      },
      rules: {
        logisticsMoney: {
          trigger: 'blur',
          validator: validateLogisticsMoney
        },
        orderMoney: {
          trigger: 'blur',
          pattern: /^[0-9]+(.[0-9]{2})?$/,
          message: '请输入正确的一口价'
        },
        paymentPeriod: [{
          validator: validatePaymentPeriod
        }]
      }
    };
  },
  computed: {
    // 获得最大销售数量
    getSaleMax() {
      if (this.data.orderType === 1) {
        return parseInt(this.OrderDefaultParam.bulkSaleMax);
      }
      if (this.data.orderType === 3) {
        return parseInt(this.OrderDefaultParam.templateSaleMax);
      }
    },
    // 获得最小销售数量
    getSaleMin() {
      if (this.data.orderType === 1) {
        return parseInt(this.OrderDefaultParam.bulkSaleMin);
      }
      if (this.data.orderType === 3) {
        return parseInt(this.OrderDefaultParam.templateSaleMin);
      }
    },
    // 把期限转为数字
    getPaymentPeriod() {
      return parseInt(this.OrderDefaultParam.paymentPeriod);
    },
    // 获取总价
    totalPay() {
      let total = 0;
      for (let i = 0; i < this.editPriceForm.orderItems.length; i++) {
        total = total + Number(this.editPriceForm.logisticsMoney) + this.editPriceForm.orderItems[i].price * this.editPriceForm.orderItems[i].num;
      }
      return total;
    },
    // 如果其中一个不存在单价 则显示 “价格面议”
    noShowMoney() {
      return this.editPriceForm.orderItems.some(item => !item.price);
    }
  },
  watch: {
    data(val) {
      console.log(val);
    }
  },
  props: {
    OrderDefaultParam: {
      type: Object
    },
    data: {
      type: Object
    },
    dialog: {
      type: Object,
      default: function() {
        return {
          show: false
        };
      }
    }
  }
};
</script>
<style scoped>
   @component-namespace dialog {
    @component editPrice{
      box-sizing: border-box;
      .ts-col-12{
        &:nth-of-type(1) {
          border-right:1px solid #eaeaea; 
        }
      }
      @descendent menu {
        margin-top: 10px;
      }
      @descendent menu-table {
        max-height: 200px;
        overflow: auto;
      }
      @descendent detail {
        padding-left: 90px;
        .ts-col {
          margin-bottom: 10px;
        }
        @modifier button {
          margin:  10px auto 10px;
        }
        @modifier wrapper{
          display: flex;
          align-items: flex-start;
        }
        @modifier flex {
          padding-left: 10px;
          position: relative;
          display: flex;
          align-items: center;
          flex-direction: column;
          .detail {
            padding-top: 10px;
            font-size: 12px;
            i {
              color : #666;
            }
          }
        }
        @modifier tip {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
</style>
