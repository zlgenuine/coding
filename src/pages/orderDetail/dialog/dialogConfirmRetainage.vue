<template>
<!-- 3.确认尾款  -->
<ts-dialog v-model="dialog.show" width="80%" @confirm="handleConfirm" @>
  <div class="dialog-confirmRetainage--title"  slot="title">
    <strong>
      确认尾款&nbsp;
    </strong>
    <span>订单号：{{data.orderId}}</span>&nbsp;
    <span>下单时间：{{data.placeTime | filterDate('dateTime')}}</span>
  </div>
  <ts-form :model="retainageForm" :rules="rules" ref="retainageForm" label-width="120px">
    <ts-row class="dialog-confirmRetainage-retainageForm">
      <ts-col :span="12">已收订金金额：
        <span v-if="data.prepaidMoney>0&&!!data.prepaidMoney">    
          ¥{{data.prepaidMoney/100}}
        </span>
        <span v-else>价格面议</span>
      </ts-col>
      <ts-col :span="12">
        运费设置：
        {{data.deliverType | filterDict(DICT.FreightSetting)}}
        <span v-show="data.deliverType===4">
          (¥{{data.logisticsMoney}})
        </span>
      </ts-col>
      <ts-col :span="12">待收尾款金额：
        <span v-if="data.balanceMoney>0&&!!data.balanceMoney">    
          ¥{{data.balanceMoney/100}}
        </span>
        <span v-else>价格面议</span>
      </ts-col>
      <ts-col :span="12">尾款支付期限：
        <ts-input-num v-model="retainageForm.paymentPeriod" :min="0" :max="1"></ts-input-num>
      </ts-col>
    </ts-row>
     <ts-menu-table :header="false" class="dialog-editPrice-menu">
          <ts-menu-table-item>商品</ts-menu-table-item>
          <ts-menu-table-item>大货交易单价</ts-menu-table-item>
          <ts-menu-table-item>大货交易数量</ts-menu-table-item>
      </ts-menu-table>
       <ts-menu :prop="list">
        <ts-menu-table :header="false" content v-for="(item,index) in data.orderItems" :key="index">
          <ts-menu-table-item>
            <div class="dialog-editPrice-detail--wrapper">
              <ts-image width="80" height="80" :src="item.picUrl"></ts-image>
              <div class="dialog-editPrice-detail--flex">
                <p>{{item.productId}}</p>
                <div class="detail">
                  <p><i>大货参考价：
                  <span v-if="item.price>0&&!!item.price">    
                    ¥{{item.totalPrice/100}}/{{item.unit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                  </span>
                  <span v-else>价格面议</span>
                  </i></p>
                  <p><i>数量：{{item.num}}</i></p>
                </div>
              </div>
            </div>
          </ts-menu-table-item>
          <ts-menu-table-item>
           <ts-form-item :prop="'orderItems.' + index + '.price'" labelWidth="0">
            <span v-if="item.price>0&&!!item.price">    
              ¥{{item.price/100}}/{{item.unit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
            </span>
            <span v-else>价格面议</span>
          </ts-form-item>
          </ts-menu-table-item>
          <ts-menu-table-item>
            <ts-form-item labelWidth="0">
              <ts-input-num v-model="item.num" :min="getSaleMin" :max="getSaleMax">
              </ts-input-num>&nbsp;{{item.unit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
            </ts-form-item>
          </ts-menu-table-item>
        </ts-menu-table>
      </ts-menu>
  </ts-form>
  <div class="dialog-confirmRetainage-detail">
    <ts-row :gutter="10">
      <ts-col :span="19">商品总价：</ts-col>
      <ts-col :span="5">
        {{totalPay}}
        </span>
      </ts-col>
      <ts-col :span="19">运费：</ts-col>
      <ts-col :span="5">
        {{data.deliverType | filterDict(DICT.FreightSetting)}}
        <span v-show="data.deliverType===4">
          (¥{{data.logisticsMoney}})
        </span>
      </ts-col>
      <ts-col :span="19">已收订金金额：</ts-col>
      <ts-col :span="5">
        <span v-if="data.prepaidMoney>0&&!!data.prepaidMoney">    
         ¥{{data.prepaidMoney/100}}/{{item.unit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
        </span>
        <span v-else>价格面议</span>
      </ts-col>
      <ts-col :span="19">应收尾款金额：</ts-col>
      <ts-col :span="5">￥{{retainage}}</ts-col>
    </ts-row>
  </div>
  <p class="dialog-confirmRetainage--tip">如买家逾期未付尾款，订金将归卖家所有</p>
</ts-dialog>
</template>
<script>
import DICT from '@/common/dict/index';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      inputNumber: '',
      DICT: {
        FreightSetting: DICT.FreightSetting
      },
      retainageForm: {
        paymentPeriod: '',
        orderItems: []
      }
    };
  },
  computed: {
    ...mapGetters(['dicTree']),
    // 获取总价
    totalPay() {
      let total = 0;
      for (let i = 0; i < this.retainageForm.orderItems.length; i++) {
        total = total + Number(this.retainageForm.logisticsMoney) + this.retainageForm.orderItems[i].price * this.retainageForm.orderItems[i].num;
      }
      return total;
    },
    retainage() {
      return this.totalPay - this.data.logisticsMoney - this.data.prepaidMoney;
    }
  },
  props: {
    data: {
      type: Object
    },
    dialog: {
      type: Object,
      default: function(argument) {
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
    @component confirmRetainage {
      @descendent detail {
        text-align: right;
      }
      @modifier tip {
        text-align: right;
        font-size: 12px;
        color: #666;
        margin-top: 10px;
      }
      @descendent retainageForm {
        margin-bottom: 10px;
        .ts-col {
          line-height: 250%;
        }
      }
    }
  }
</style>
