<template lang="html">
  <div class="bulkDeatil">
    <!-- 步骤进度 -->
    <detail-step class="bulkDeatil-step" :id="OrderDetails.orderStatus" :step="stepData" step-label="name" step-value="id" :show="!showByStatus([9000, 9900, 9910, 9920])">
      <div class="class">
         <p class="bulkDeatil-step--title">
           <i class="icon-warning" v-show="showByStatus([9000, 9900, 9910, 9920])">!</i> 当前订单状态：<span>{{judge.title}} {{OrderDetails.orderStatus}}</span>
        </p>
        <ul class="bulkDeatil-step--item">
          <li v-for="item in judge.notice">{{item}}</li>
          <li v-show="showByStatus([2000])">买家要求备货期为{{OrderDetails.stockPeriod}}天，如对此有疑问可及时与买家沟通</li>
          <li v-show="showByStatus([201010, 201020, 3000])">订单剩余支付
            <span v-show="showByStatus([201010])">全款</span>
            <span v-show="showByStatus([201020])">订金</span>
            时间{{OrderDetails.surplusPayTime}}，买家逾期未支付，系统自动关闭订单，请尽快联系买家。
          </li>
          <li v-show="showByStatus([201040])">您设置的订单付款方式为分期支付，当前等待买家支付尾款，买家剩余支付时限：{{OrderDetails.surplusPayTime}}</li>
          <li v-show="showByStatus([2020])">
          买家要求备货期限为{{OrderDetails.stockPeriod}}天，您剩余备货时间为：{{OrderDetails.surplusStockPeriodTime}}，请尽快备货并确认发货，逾期未发货，买家有权要求终止交易</li>
        </ul>
      <br/>
        <div v-show="!showByStatus([9900, 9910, 9920, 9000, 9900, 2100])">
          <p>订单总额：￥{{OrderDetails.orderMoney}}</p>
          <div>
            <p v-show="showByStatus([201020])">待收订金：
            <span v-if="OrderDetails.orderMoney>0&&!!OrderDetails.orderMoney">    
              ¥{{OrderDetails.orderMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
            </span>
            <span v-else>价格面议</span>
            </p>
            <p v-show="showByStatus([201010])">待收全款：
              <span v-if="OrderDetails.orderMoney>0&&!!OrderDetails.orderMoney">    
                ¥{{OrderDetails.orderMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
              </span>
              <span v-else>价格面议</span>
            </p>
            <p v-show="showByStatus([201030])">待确认尾款：
              <span v-if="OrderDetails.orderMoney>0&&!!OrderDetails.orderMoney">    
                ¥{{OrderDetails.orderMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
              </span>
              <span v-else>价格面议</span>
            </p>
            <p v-show="showByStatus([201030])">已收订金：
              <span v-if="OrderDetails.orderMoney>0&&!!OrderDetails.orderMoney">    
                ¥{{OrderDetails.orderMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
              </span>
              <span v-else>价格面议</span>
            </p>
            <p v-show="showByStatus([201040])">待收尾款：
              <span v-if="OrderDetails.orderMoney>0&&!!OrderDetails.orderMoney">    
                ¥{{OrderDetails.orderMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
              </span>
              <span v-else>价格面议</span>
            </p>
            <p v-show="showByStatus([2020, 3010])">实收金额：
              <span v-if="OrderDetails.orderMoney>0&&!!OrderDetails.orderMoney">    
                ¥{{OrderDetails.orderMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
              </span>
              <span v-else>价格面议</span>
            </p>
          </div>
          <p v-show="showByStatus([2050, 2040, 3020])">剩余收货时间：{{OrderDetails.surplusReceiptTime}}</p>
        </div>
        <div class="bulkDeatil-step--button">
          <ts-button :type="item.type?item.type:'warning'" v-for="item in judge.button" @click="handleBulk(item.methods)">
            {{item.name}}
          </ts-button>
          <ts-button @click="handleConfirmRetainage">handleConfirmRetainage</ts-button>
        </div>
      </div>
    </detail-step>
    <!-- 切换 -->
    <ts-navbar v-model="orderNav" bordered @change="handleNavbar">
      <ts-tab-item id="1">订单信息</ts-tab-item>
      <ts-tab-item id="2">订单追踪</ts-tab-item>
    </ts-navbar>
    <ts-tab-container v-model="orderNav" bordered>
      <ts-tab-container-item id="1">
        <div class="bulkDeatil-tab">
            <p class="bulkDeatil-tab-item--title">
              买家信息
            </p>
            <ts-row>
              <ts-col :span="2">用户名字：</ts-col>
              <ts-col :span="22">{{OrderDetails.buyers.userName}}</ts-col>
              <ts-col :span="2">所在地区：</ts-col>
              <ts-col :span="6">{{OrderDetails.address.province}}{{OrderDetails.address.city}}</ts-col>
              <ts-col :span="2">联系电话：</ts-col>
              <ts-col :span="6">{{OrderDetails.buyers.phone}}</ts-col>
            </ts-row>
            <p class="bulkDeatil-tab-item--title">
              订单信息
            </p>
            <ts-row>
              <ts-col :span="2">订单编号：</ts-col>
              <ts-col :span="22">{{OrderDetails.orderId}}</ts-col>
              <ts-col :span="2">下单时间：</ts-col>
              <ts-col :span="6">{{OrderDetails.placeTime | customTime}}</ts-col>
              <ts-col :span="3">买家要求备货期：</ts-col>
              <ts-col :span="6"><ts-popover trigger="hover" :options="{placement: 'top'}">
                <div class="popper">
                  备货期限为买家线上完成订单全额款项支付<br>
                  后卖家需线下备货并线上确认发货的时间期<br>
                  限，买家可酌情修改备货期限！
                </div>
                <span slot="reference">
                  {{OrderDetails.stockPeriod}}天
                </span>
              </ts-popover>
            </ts-col>
            <ts-col :span="3" v-show="OrderDetails.orderType!==2">运费设置：</ts-col>
            <ts-col :span="4" v-show="OrderDetails.orderType!==2">
              {{OrderDetails.deliverType | filterDict(DICT.FreightSetting)}}
              <span v-show="OrderDetails.deliverType===4">
                (¥{{OrderDetails.logisticsMoney}})
              </span>
            </ts-col>
            <ts-col :span="3" v-show="OrderDetails.orderType===2">剩余备货期：</ts-col>
            <ts-col :span="6" v-show="OrderDetails.orderType===2">
              {{OrderDetails.surplusStockPeriodTime}}天
            </ts-col>
            </ts-row>
            <!-- 表格 -->
            <ts-menu-table :header="false">
              <ts-menu-table-item width="330">商品</ts-menu-table-item>
              <ts-menu-table-item width="164">大货参考价</ts-menu-table-item>
              <ts-menu-table-item width="166">大货数量</ts-menu-table-item>
              <ts-menu-table-item>状态</ts-menu-table-item>
              <ts-menu-table-item>商品总价</ts-menu-table-item>
            </ts-menu-table>
            <ts-menu :prop="list">
              <ts-menu-table :header="false" content>
                <ts-menu-table-item width="660" style="padding:0">
                  <ts-row v-for="item in OrderDetails.orderItems">
                    <ts-col :span="12" style="text-align:left">
                      <ts-image width="80" height="80" :src="item.picUrl"></ts-image>
                      {{item.productId}}
                    </ts-col>
                    <ts-col :span="6">
                      <span v-if="item.totalPrice>0 && !!item.totalPrice">
                      ¥{{item.totalPrice/100}}/{{item.unit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                      </span>
                      <span v-else>价格面议</span>
                    </ts-col>
                    <ts-col :span="6">
                    <span v-if="item.num>0&&!!item.num">
                      ¥{{item.num/100}}/{{item.unit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                    </span>
                    <span v-else>价格面议</span>
                    </ts-col>
                  </ts-row>
                </ts-menu-table-item>
                <ts-menu-table-item>{{judge.name}}</ts-menu-table-item>
                <ts-menu-table-item>
                  <span v-if="OrderDetails.orderMoney>0&&!!OrderDetails.orderMoney">    
                  ¥{{OrderDetails.orderMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                </span>
                <span v-else>价格面议</span>
                </ts-menu-table-item>
              </ts-menu-table>
            </ts-menu>
            <!-- 尾部 -->
            <div class="bulkDeatil-tab--footer">
              <p v-show="!showByStatus([1010,1020,1030,9910,9920] || OrderDetails.orderType)">
              商品总价：
                <span v-if="OrderDetails.orderMoney>0&&!!OrderDetails.orderMoney">    
                  ¥{{OrderDetails.orderMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                </span>
                <span v-else>价格面议</span>
              </p>
              <p v-show="!showByStatus([3000,3010,3020,3030])">
              运费：
                <span v-if="OrderDetails.logisticsMoney>0&&!!OrderDetails.logisticsMoney">    
                  ¥{{OrderDetails.logisticsMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                </span>
                <span v-else>价格面议</span>
              </p>
              <p>订单总额：
                <i class="red">
                 <span v-if="OrderDetails.orderMoney>0&&!!OrderDetails.orderMoney">    
                  ¥{{OrderDetails.orderMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                </span>
                <span v-else>价格面议</span>
                </i>
              </p>
              <p>待收订金：
                <span v-if="OrderDetails.prepaidMoney>0&&!!OrderDetails.prepaidMoney">    
                  ¥{{OrderDetails.prepaidMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                </span>
                <span v-else>价格面议</span>
              </p>
              <p>待确认尾款：
                <span v-if="OrderDetails.balanceMoney>0&&!!OrderDetails.balanceMoney">    
                  ¥{{OrderDetails.balanceMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                </span>
                <span v-else>价格面议</span>
              </p>
              <p>实收总额：
                <span v-if="OrderDetails.balanceMoney>0&&!!OrderDetails.balanceMoney">    
                  ¥{{OrderDetails.balanceMoney/100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                </span>
                <span v-else>价格面议</span>
              </p>
            </div>
        </div>
      </ts-tab-container-item>
      <ts-tab-container-item id="2">
        <div class="bulkDeatil-tab">
          <p class="bulkDeatil-tab-item--title">
            买家信息
          </p>
          <ts-row>
            <ts-col :span="2">运费设置：</ts-col>
            <ts-col :span="22">{{OrderDetails.deliverType | filterDict(DICT.FreightSetting)}}</ts-col>
            <ts-col :span="2">收货信息：</ts-col>
            <ts-col :span="22">{{OrderDetails.address.province}}{{OrderDetails.address.city}}{{OrderDetails.address.county}}{{OrderDetails.address.fullAddress}}。 {{OrderDetails.address.postcode}}。{{OrderDetails.address.name}}，{{OrderDetails.address.phone}}</ts-col>
          </ts-row>
          <p class="bulkDeatil-tab-item--title">
            订单跟踪
          </p>
          <div class="bulkDeatil-follow">
            <ts-row>
              <ts-col :span="2">订单编号：</ts-col>
              <ts-col :span="22">{{OrderDetails.orderId}}</ts-col>
              <!-- TODO：循环 -->
              <ts-col :span="22" :offset="2" class="bulkDeatil-follow--time">
                <p v-for="i in tranOrderTimes">{{judgeJSON[OrderDetails.orderType][i.status].name}} {{i.time | filterDate('dateTime')}}</p>
              </ts-col>
              <ts-col :span="2">配送公司：</ts-col>
              <ts-col :span="22">{{OrderDetails.logisticsName}}&nbsp;</ts-col>
              <ts-col :span="2">运单编号：</ts-col>
              <ts-col :span="22">{{OrderDetails.logisticsNum}}&nbsp;</ts-col>
              <ts-col :span="2">物流跟踪：</ts-col>
              <ts-col :span="22">
                <p v-for="i in ExpQuery">{{i.AcceptStation}} {{i.AcceptTime}}</p>
              </ts-col>
            </ts-row>
          </div>
        </div>
      </ts-tab-container-item>
    </ts-tab-container>
    <!-- ======= -->
    <!-- 对话框 -->
    <!-- ======= -->
    <dialog-close-order :data="OrderDetails" :dialog="dialogCloseOrder" @cancelOrder="cancelOrder"></dialog-close-order>
    <dialog-confirm-order :data="OrderDetails" :dialog="dialogConfirmOrder"></dialog-confirm-order>
    <dialog-confirm-retainage :data="OrderDetails" :dialog="dialogConfirmRetainage"></dialog-confirm-retainage>
    <dialog-confirm-send :data="OrderDetails" :dialog="dialogConfirmSend"></dialog-confirm-send>
    <dialog-edit-price :OrderDefaultParam="OrderDefaultParam" :data="OrderDetails" :dialog="dialogEditPrice"></dialog-edit-price>
  </div>
</template>
<script>
import {getOrderDetails, getOrderDefaultParam, orderNextOper, cancelOrder, instantQuery} from '@/common/api/api';
import DialogCloseOrder from '../dialog/dialogCloseOrder.vue';
import DialogConfirmOrder from '../dialog/dialogConfirmOrder.vue';
import DialogConfirmRetainage from '../dialog/dialogConfirmRetainage.vue';
import DialogConfirmSend from '../dialog/dialogConfirmSend.vue';
import DialogEditPrice from '../dialog/dialogEditPrice.vue';
import DICT from '@/common/dict/index';
import stepData from '../step.js';
import judge from '../judge.js';
import DetailStep from '../components/detailStep.vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      DICT: {
        FreightSetting: DICT.FreightSetting,
        CloseOrderReasons: DICT.CloseOrderReasons,
        StockUnits: DICT.StockUnits
      },
      OrderDetails: {
        buyers: {},
        address: {},
        orderTimes: {},
        orderItems: {},
        saler: {}
      },
      ExpQuery: [],
      OrderDefaultParam: {},
      orderNav: '1',
      // 字典
      judge: {},
      judgeJSON: judge,
      stepData: stepData,
      dialogCloseOrder: {
        show: false
      },
      dialogConfirmOrder: {
        show: false
      },
      dialogConfirmRetainage: {
        show: false
      },
      dialogConfirmSend: {
        show: false
      },
      dialogEditPrice: {
        show: false
      }
    };
  },
  components: {
    DetailStep,
    DialogCloseOrder,
    DialogConfirmOrder,
    DialogConfirmRetainage,
    DialogConfirmSend,
    DialogEditPrice
  },
  created() {
    this.loadIndex();
  },
  watch: {
   async orderNav(val) {
      // 物流即时查询
      if (val === '2' && !this.ExpQuery.length && this.OrderDetails.logisticsCode && this.OrderDetails.logisticsNum) {
        try {
         let { data } = await instantQuery({
          expCode: this.OrderDetails.logisticsCode,
          expNo: this.OrderDetails.logisticsNum
          });
         this.ExpQuery = data.data;
        } catch (e) {
          console.error('物流即时查询失败');
        }
      }
    }
  },
  computed: {
    ...mapGetters(['dicTree']),
    tranOrderTimes() {
      let orderTimes = [];
      for (let i in this.OrderDetails.orderTimes) {
        orderTimes.push({
          status: i,
          time: this.OrderDetails.orderTimes[i]
        });
      }
      return orderTimes;
    }
  },
  methods: {
    async loadIndex() {
        // // 订单相关默认参数
       try {
        let { data } = await getOrderDefaultParam();
        this.OrderDefaultParam = data.data;
      } catch (e) {
        console.error('订单相关默认参数获取失败');
      }
       try {
        let { data } = await getOrderDetails({orderId: this.$route.params.id});
        this.OrderDetails = data.data;
        this.judge = judge[this.OrderDetails.orderType][this.OrderDetails.orderStatus];
        this.stepData = stepData[this.OrderDetails.orderType];
      } catch (e) {
        console.error('订单详情获取失败');
      }
    },
    // 根据不同状态显示不同的东西
    showByStatus($arr) {
      return !!~$arr.indexOf(this.OrderDetails.orderStatus);
    },
    // 按钮不同状态做不同处理
    handleBulk(methods) {
      let fn = this[methods];
      if (typeof fn === 'function') {
        fn.apply(this);
      }
    },
    // 下一步操作
    async handleNextOper() {
      try {
        await orderNextOper({
        orderId: this.OrderDetails.orderId,
        orderStatus: this.OrderDetails.orderStatus
      });
        await this.loadIndex();
      } catch (e) {
        console.error('下一步操作失败');
      }
    },
    // 修改价格
    handleEditPrice() {
      this.dialogEditPrice.show = true;
    },
    // 修改尾款
    handleConfirmRetainage() {
      this.dialogConfirmRetainage.show = true;
    },
    // 发货
    handleSend() {
      this.Dialog.confirmSend = true;
    },
    // 确认订单
    handleConfirmOrder() {
      // 1.判断每个是否有价格
        // 花型没有单价 且不是点击的一口价 无法提交订单
      if (this.OrderDetails.orderType === 2 && this.OrderDetails.status === 2000) {
        let hasNoPrice = this.OrderDetails.orderItems.some(item => !item.price);
        if (hasNoPrice) {
          this.$messagebox({
            title: '无法确认订单',
            message: '请先修改订单相关商品价格、或设置一口价再确认订单',
            confirmButtonText: '知道了'
          });
        } else {
          this.$messagebox({
            title: '确认订单',
            message: `该订单买家应一次性支付全款金额为${this.OrderDetails.orderMoney}元，买家要求备货期为${this.OrderDetails.surplusStockPeriodTime}天，是否确定？`,
            confirmButtonText: '确定'
          }).then(() => {
            this.handleNextOper();
          });
        }
      }
    },
    // 关闭订单
    handleCancelOrder() {
      this.dialogCloseOrder.show = true;
    },
    async cancelOrder(reason) {
      try {
        await cancelOrder({
        orderId: this.OrderDetails.orderId,
        reason: reason
      });
        await this.loadIndex();
        this.dialogCloseOrder.show = false;
      } catch (e) {
        console.error('取消/关闭订单失败');
      }
    }
  }
};
</script>

<style lang="css" scoped>
@component-namespace bulkDeatil{
  @component step{
    margin-bottom: 30px;
    @modifier title{
      font-size: 18px;
      padding-bottom: 10px;
      font-weight: 700;
    }
    @modifier item{
      li{
        position: relative;
        padding-left: 15px;
        line-height: 200%;
        &:before{
          position:absolute 50% * * 0;
          content:'';
          circle: 5px grey;
          transform: translateY(-50%);
        }
      }
    }
    @modifier button{
      margin-top: 10px;
      button{
        margin-right: 8px;
      }
    }
  }
  @component dialog{
    @descendent confirmSend{
      @modifier flex{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      @modifier cover{
        position: relative;
        & > .kinds{
          position: absolute -4px * * -4px;
          background: #4C93FD;
          color:#fff;
          padding: 1px 3px;
          display: inline-block;
          z-index: 1;
        }
      }
    }
  }
  @component follow{
    @modifier time{
      font-size: 13px;
      color: #999;
    }
  }
  @component tab{
    line-height: 200%;
    @modifier footer{
      text-align: right;
    }
    @descendent item{
      @modifier title{
        font-weight: 700;
        padding: 6px 0;
        & + .ts-row{
          padding-bottom: 10px;
        }
        &:not(:first-child){
        border-top:1px solid #eaeaea;
        }
      }
    }
  }
}
.icon-warning {
  border-radius: 50%;
  border: 2px solid;
  size:  20px;
  text-align: center;
  font-weight: bold;
  color: #3385ff;
  display: inline-block;
}
</style>
