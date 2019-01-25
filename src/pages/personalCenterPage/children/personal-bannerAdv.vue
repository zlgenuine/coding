<template>
  <div class="bannerAdv">
    <img style="width: 100%" src="/static/images/bannerAdv.png"/>
    <div class="bannerContent">
      <div class="bannerItem" v-for="(item, index) in adv.sysAdList" :class="{'active': index === activeIndex}" @click="clickAdv(index)">
        <span class="flag_index"  :style="{backgroundColor: item.days && item.days > 0 ? '#999999': '#fcbe11'}">{{index + 1}}</span>
        <span class="t"></span>
        <div class="adv_content">
          <template v-if="item.days < 0 || !item.days">
            <div class="no_tip">
              <span class="tip_text">虚位以待</span>
              <span class="money">￥<span class="money_num">{{adv.money.year}}</span></span>
            </div>
          </template>
          <template v-else>
            <h3>{{item.companyName}}</h3>
            <p class="date">投放时间：<span>{{item.effDate | filterDate('dateDay')}}</span> 至 <span>{{item.expDate | filterDate('dateDay')}}</span></p>
          </template>
        </div>
        <span class="btn1 release_btn" v-if="!item.days || item.days < 0" @click="action(item.id)">我要投放</span>
        <!--<span class="btn1 order_btn" v-if="userInfo.companyId !== item.companyId && item.days >= 0 && item.days <= 30 && item.status !== 2" @click="action(item.id)">我要预约</span>-->
        <!--<span class="btn1" v-if="userInfo.companyId === item.companyId" @click="action(item.id)">马上续费</span>-->
        <!--<span class="btn1 booked" v-if="userInfo.companyId !== item.reserveCompanyId && item.status === 2">已被预约</span>-->
        <!--<span class="btn1 booked" v-if="userInfo.companyId === item.reserveCompanyId && item.status === 2">已预约</span>-->
      </div>
    </div>
    <!--<div style="width: 200px; text-align: center; color:#fff; background: #20a0ff; padding: 10px 0; margin: 10px auto; border-radius: 30px; font-size: 16px;cursor: pointer">-->
      <!--我要投放-->
    <!--</div>-->
    <div class="banner_notice">
      <h3>温馨提示</h3>
      <div class="notice_text">
        <p>1、投放申请成功24小时内客服联系为您免费制作宣传物料；</p>
      </div>
    </div>
    <ts-dialog title="选择支付方式" v-model="showPay"  type="alert" width="40%">
      <div class="payType">
        <img  @click="pay(2)" class="weixin" src="/static/images/app/weixin_pay.png"/>
        <img @click="pay(1)" class="zhifubao" src="/static/images/app/zhifubao_pay.png"/>
      </div>
      <div slot="footer"></div>
    </ts-dialog>
  </div>
</template>

<script>
  import {sysAd, adOrder, adPreOrder} from '@/common/api/api';
  import {
    mapGetters
  } from 'vuex';
  export default {
    name: "personal-banner-adv",
    data () {
      return {
        adv: '',
        activeIndex: 0,
        showPay: false,
        adId: ''
      };
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    mounted () {
      this.getData();
    },
    methods: {
      async getData () {
        let {data: {data}} = await sysAd({posId: 1});
        this.adv = data;
      },
      clickAdv (index) {
        this.activeIndex  = index;
      },
      action (id) {
        this.showPay = true;
        this.adId = id;
      },
      async pay (type) {
        this.showPay = false;
        let params = Object.assign({},
          {
            companyId: this.userInfo.companyId,
            adId: this.adId,
            money: this.adv.money.year * 100,  // banner广告只考虑一年
            // money: 0.01 * 100,
            orderType: 4
          });


        let {data: {data}} = await adOrder(params);
        if (!data) return;
        let {orderId, orderMoney} = data;

        if (type === 1) { // 支付宝
          let o = Object.assign({}, {
            orderCode: orderId,
            payMoney: orderMoney,
            paymentId: type,
            // returnUrl: `http://192.168.8.156:8081/paySuccess?d=${this.orderParams.orderId}&type=${type}`
            returnUrl: `https://www.ts57.cn/paySuccess?d=${orderId}&type=${type}&pt=2`
          });
          let res = await adPreOrder(o);
          // return ;
          let div = document.createElement('div');
          let script = document.createElement('script');
          div.innerHTML = res.data.data;
          script.innerHTML = div.getElementsByTagName('script')[0].innerHTML;
          // 插入form表单，执行脚本
          document.body.appendChild(div);
          document.body.appendChild(script);

        } else if (type === 2) { // 微信
          this.$router.push({
            path: '/wxPay',
            query: {
              m: this.Encrypt(orderMoney),
              d: orderId,
              t: type,
              pt: 2
            }
          });
        }

      }
    }
  };
</script>

<style scoped lang="scss">
.bannerAdv{
  .bannerContent{
    padding: 20px 30px;
    .bannerItem{
      cursor: pointer;
      width: 48%;
      display: inline-block;
      border: 1px solid #efe3e3;
      height: 84px;
      box-sizing: border-box;
      vertical-align: top;
      margin-bottom: 20px;
      padding: 16px 20px;
      position: relative;
      &.active {
        box-shadow: 1px 2px 8px #4ca0e0;
      }
      &:nth-child(odd){
        margin-right: 2%;
      }
      &:nth-child(even){
        margin-left: 2%;
      }
      .date{
        margin-top: 6px;
        span{
          color: #20a0ff;
        }
      }
      .adv_content{
        position: relative;
        z-index: 2;
        height: 100%;
        width: 100%;
      }
      .no_tip{
        position: absolute;
        left: 50px;
        top: 50%;
        font-size: 18px;
        transform: translateY(-50%);
        .money{
          margin-left: 76px;
          color: red;
          .money_num{
            font-size: 22px;
          }
        }
      }
      .btn1{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 14px;
        padding: 4px 14px;
        border: 2px solid #4a94fd;
        border-radius: 30px;
        font-size: 14px;
        color: #4a94fd;
        z-index: 3;
        &.release_btn{
          background-color: #4a94fd;
          border: 2px solid #4a94fd;
          color: #fff;
        }
        &.order_btn {
          background-color: #8fb2e4;
          border: 2px solid #8fb2e4;
          color: #fff;
        }
        &.booked{
          background-color: #999999;
          border: 2px solid #999999;
          color: #fff;
        }
      }
      .flag_index{
        position: absolute;
        width: 28px;
        height: 28px;
        padding: 2px 4px;
        box-sizing: border-box;
        background-color: #8f7676;
        color: #fff;
        top: -1px;
        left: -1px;
        font-size: 12px;

      }
      .t{
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 28px solid #fff;
        border-left: 28px solid transparent;
        z-index: 2;
        top: 1px;
        left: 0;
        &.active_t{
          border-bottom: 28px solid #c9dfff;
        }
      }
    }
  }
  .banner_notice{
    margin-left: 20px;
    margin-top: 40px;
    font-size: 16px;
    p{
      line-height: 30px;
    }
  }
  .payType{
    text-align: center;
    img{
      width: 160px;
      cursor: pointer;
      &.weixin{
        margin-right: 10%;
        cursor: pointer;
      }
      &.zhifubao{
        margin-left:10%;
        cursor: pointer;
      }
    }
  }
}
</style>
