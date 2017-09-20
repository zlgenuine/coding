<template>
<ts-dialog v-model="dialog.show" width="80%" title="确认发货">
  <div class="dialog-confirmSend">
    <ts-row>
      <ts-col :span="12">
        <ts-row class="dialog-confirmSend--flex">
          <ts-col :span="5">
            <div class="dialog-confirmSend--cover">
              <span class="kinds">共{{getItemsLength}}种</span>
              <ts-image width="80" height="80" :src="data.orderItems[0].picUrl" :canView="false"
           disabledHover></ts-image>
            </div>
          </ts-col>
          <ts-col :span="19">
            <p>大货交易总额：￥{{data.orderMoney}}</p>
            <p>运费设置：
             {{data.deliverType | filterDict(DICT.FreightSetting)}}
              <span v-show="data.deliverType===4">
                (¥{{data.logisticsMoney}})
              </span>
            </p>
          </ts-col>
        </ts-row>
        <ts-row>
          <ts-col :span="6">买家收货信息：</ts-col>
          <ts-col :span="18">{{data.address.province}}{{data.address.city}}{{data.address.county}}{{data.address.address}}350200。{{data.address.name}}，{{data.address.phone}}</ts-col>
          <!-- TODO: 没有发货人信息 取getCompanyInfo -->
          <!-- <ts-col :span="6">我的发货信息：</ts-col> -->
          <!-- <ts-col :span="18">福建省长乐市文武砂，数字福建产业园，8号研发楼，一楼。 350200。庄志勇，13928766967</ts-col> -->
        </ts-row>
      </ts-col>
      <ts-col :span="12">
        <ts-table :data="data.orderItems">
          <ts-column slot data-key="productId"  align="center" name="花型编号"></ts-column>
          <ts-column slot data-key="price"  align="center" name="交易单价"></ts-column>
          <ts-column slot data-key="num" align="center" name="交易数量"></ts-column>
        </ts-table>
      </ts-col>
    </ts-row>
    <div v-if="false">
      <ts-input></ts-input>
      <p v-show="data.deliverType===5">温馨提醒：为了避免纠纷，请谨慎确认已安排上门送货至客户指定收货地址！</p>
      <p v-show="data.deliverType===2">温馨提醒：为了避免纠纷，请谨慎确认已买家已上门自提！</p>
    </div>
  </div>
</ts-dialog>
</template>
<script>
import DICT from '@/common/dict/index';
export default {
  data() {
    return {
      DICT: {
        FreightSetting: DICT.FreightSetting
      }
    };
  },
  computed: {
    getItemsLength() {
      if (this.data.orderItems) {
        return this.data.orderItems.length;
      }
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

    }
  }
</style>
