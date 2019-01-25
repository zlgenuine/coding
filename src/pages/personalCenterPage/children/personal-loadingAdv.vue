<template>
  <div class="loadingAdv">
    <img style="width: 100%" src="/static/images/loadingAdv.png"/>
    <div class="loadingContent">
      <div v-for="item in dataList" class="loading_item" :class="{'active': item.orderType === params.orderType}" @click="chooseItem(item)">
        <span class="recommend" v-if="item.label === 'year'">推荐</span>
        <p class="money">￥<span>{{adv.money && adv.money[item.label]}}</span></p>
        <p class="desc">{{item.val}}个月</p>
        <p  class="desc">投放包费用</p>
      </div>
    </div>
    <!--没有广告位并且当前登录用户没有购买其中之一广告时显示-->
    <div class="time_tip"  v-if="!left_num && !advInfo.length">最新广告释放时间 : <span style="color: red">{{newest_exp | filterDate('dateDay')}}</span></div>

    <div v-if="advInfo.length" class="btn" @click="showPayToast">
      立即续费
    </div>
    <div v-else class="btn" :class="{'disabledBtn': left_num <= 0}" @click="showPayToast">
      立即投放(仅剩{{left_num}}席位)
    </div>
    <div class="banner_notice">
      <h3>温馨提示</h3>
      <div class="notice_text">
        <p  v-if="advInfo.length" >1、<span style="color: red">{{advInfo[0].expDate |  filterDate('dateDay')}}</span> 到期，续费后有效期将自动顺延; </p>
        <p>{{advInfo.length ? 2 : 1}}、投放申请成功24小时内客服联系为您免费制作宣传物料；</p>
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
    name: "personal-loading-adv",
    data () {
      return {
        adv: '',
        dataList: [
          {label: 'year', val: '12', orderType: 4},{label: 'halfYear', val: '6', orderType: 3},
          {label: 'season', val: '3',orderType: 2},{label: 'month', val: '1', orderType: 1}
        ],
        showPay: false,
        params: {
          orderType: 4,
          money: ''
        },
        adId: ''
      };
    },
    computed: {
      ...mapGetters(['userInfo']),
      left_num () {
        let length = this.adv && this.adv.sysAdList.filter(item => (item.days && item.days < 0 || !item.days)).length;
        return length;
      },
      //登录用户所发布广告的信息
      advInfo () {
        return  this.adv && this.adv.sysAdList.filter(item => item.companyId === this.userInfo.companyId) || [];
      },
      //最快过期的广告过期时间
      newest_exp () {
        // 没有投放广告位置时才显示
        if (this.left_num === 0) {
          let o = this.adv && this.adv.sysAdList.length && this.adv.sysAdList.reduce((pre, next) => {
            return pre.expDate > next.expDate ? next : pre ;// 返回时间最小的
          });
          return o.expDate || '';
        } else {
          return null;
        }
      }
    },
    mounted () {
      this.getData();
    },
    methods: {
      async getData () {
        let {data: {data}} = await sysAd({posId: 2});
        this.adv = data;
        this.params.money = this.adv.money.year; // 初始化金额参数
      },
      chooseItem (item) {
        this.params.orderType = item.orderType;
        this.params.money = this.adv.money[item.label];
      },
      showPayToast () {
        if (this.left_num <= 0) return;
        this.showPay = true;
        this.adId =  this.adId || this.adv.sysAdList.filter(item => (item.days && item.days < 0 ) || item.days === null)[0].id; // 获取未被购买广告的id，用于下单
      },
      async pay (type) {
        this.showPay = false;
        let params = Object.assign({},
          {
            companyId: this.userInfo.companyId,
            adId: this.adId,
            money: this.params.money * 100,
            // money: 0.01 * 100,
            orderType: this.params.orderType
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
.loadingAdv{
  .loadingContent{
    padding: 20px;
    box-sizing: border-box;
    .loading_item{
      display: inline-block;
      width: 24%;
      text-align: center;
      border: 1px solid #fcbe11;
      margin-right: 1%;
      padding: 40px 0;
      cursor: pointer;
      position: relative;
      &:last-child{
        margin: 0;
      }
      &.active{
        box-shadow: 2px 2px 10px #00d00d;
      }
      .recommend{
        position: absolute;
        width: 60px;
        height:26px;
        line-height: 26px;
        background: #fcbe11;
        color: #fff;
        top: 0;
        left: 0;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        text-align: center;
      }
      .money{
        font-size: 18px;
        color: red;
        margin-bottom: 10px;
        span{
          font-size: 30px;
        }
      }
      .desc{
        font-size: 16px;
        color: #666666;
      }
    }
  }
  .time_tip{
    text-align: center;
    font-size: 16px;
    margin: 6px 0;
  }
  .btn{
    width: 280px;
    padding: 10px 0;
    text-align: center;
    margin: 10px auto;
    border-radius: 30px;
    background: #fcbe11;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    &.disabledBtn{
      background-color: #999999;
      cursor: auto;
    }
  }
  .banner_notice{
    margin-left: 20px;
    margin-top: 80px;
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
