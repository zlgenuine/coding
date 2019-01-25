<template>
  <div class="applyBest">
    <img style="width: 100%" src="/static/images/apply_best.png"/>
    <div class="applyBestContent">
      <div v-for="item in dataList" class="apply_item" :class="{'active': item.orderType === params.orderType}" @click="chooseItem(item.orderType)">
        <span class="recommend" v-if="item.label === 'money_year'">推荐</span>
        <p class="money">￥<span>{{companyInfo[item.label]}}</span></p>
        <p class="desc">{{item.val}}个月付费</p>
        <p  class="desc">推荐厂家</p>
        <span class="btn" @click="payOpend(item)">{{!companyInfo.isBest && !companyInfo.expDate ? '立即开通' : '立即续费'}}</span>
      </div>
    </div>
    <div class="applyBestContent">
      <div class="expDate">
        <!--未开通-->
        <template v-if="!companyInfo.isBest && !companyInfo.expDate ">
         认证后有效期至 <span class="exp_date">{{expDate}}</span>
        </template>

        <!--到期-->
        <template v-if="!companyInfo.isBest && companyInfo.expDate ">
         已到期, 续约后有效期至<span class="exp_date">{{expDate}}</span>
        </template>

        <!--未到期-->
        <template v-if="companyInfo.isBest && companyInfo.expDate">
         <span class="exp_date">{{companyInfo.expDate | filterDate('dateDay')}}</span> 到期，续费后有效期将自动顺延
        </template>
      </div>
    </div>

    <div class="banner_notice">
      <h3>温馨提示</h3>
      <div class="notice_text">
        <p>1、首次申请开通成功24小时内客服联系为您免费制作宣传物料；</p>
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
  import {companyBest, bestOrder, bestPreOrder} from '@/common/api/api';
  export default {
    name: "personal-apply-best",
    data () {
      return {
        companyInfo: '',
        dataList: [
          {label: 'money_year', val: '12', orderType: 4},{label: 'money_half_year', val: '6', orderType: 3},
          {label: 'money_season', val: '3',orderType: 2},{label: 'money_month', val: '1', orderType: 1}
        ],
        params: {
          companyId: '',
          companyName: '',
          companyType: '',
          contact: '',
          money: '',
          orderType: 4, //1一个月, 2三个月(季度)，3半年,4年
          phone: ''
        },
        showPay: false
      };
    },
    computed: {
      expDate () {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate() >= 10 ? date.getDate() :  '0' + date.getDate();
        let typeList = {
          1: 1, // 一个月
          2: 3, // 季度
          3: 6, // 半年
          4: 12 // 年
        };
        let tem = m + typeList[this.params.orderType];
        if (tem > 12) {
          y = y + 1;
          m = tem - 12 > 10 ? tem - 12 : `0${tem - 12}`;
        } else {
          m = tem > 10 ? tem : `0${tem}`;
        }
        return `${y}-${m}-${d}`;
      }
    },
    methods: {
      async getData () {
        let {data: {data}} = await companyBest();
        this.companyInfo = data;
        this.params.money = this.companyInfo.money_year * 100;
        // this.params.money = 0.01 * 100;
        for(let key in this.params) {
          (key !== 'orderType' && key !== 'money') && (this.params[key] = this.companyInfo[key]);
        }
      },
      chooseItem (type) {
        this.params.orderType = type;
      },
      payOpend (item) {
        console.log(item);
        this.params.orderType = item.orderType;
        let typeList = {
          1: 'money_month', // 一个月
          2: 'money_season', // 季度
          3: 'money_half_year', // 半年
          4: 'money_year' // 年
        };
        this.params.money = this.companyInfo[typeList[item.orderType]] * 100;
        // this.params.money = 0.01 * 100;
        this.showPay = true;
      },
      async pay (type) {
        this.showPay = false;
        // 下单
        let {data: {data}} = await bestOrder(this.params);
        let {orderId, orderMoney} = data;

        if (type === 1) { // 支付宝
          let o = Object.assign({}, {
            orderCode: orderId,
            payMoney: orderMoney,
            paymentId: type,
            // returnUrl: `http://192.168.8.156:8081/paySuccess?d=${this.orderParams.orderId}&type=${type}`
            returnUrl: `https://www.ts57.cn/paySuccess?d=${orderId}&type=${type}&pt=3`
          });
          let res = await bestPreOrder(o);
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
              pt: 3
            }
          });
        }
      }
    },
    mounted () {
      this.getData();
    }
  };
</script>

<style scoped lang="scss">
.applyBest{
  .applyBestContent{
    padding: 20px;
    box-sizing: border-box;
    .apply_item{
      display: inline-block;
      width: 24%;
      text-align: center;
      border: 1px solid #eeeeee;
      margin-right: 1%;
      padding: 40px 0;
      cursor: pointer;
      position: relative;
      &:last-child{
        margin: 0;
      }
      &.active{
        box-shadow: 2px 2px 10px #f29b76;
      }
      .recommend{
        position: absolute;
        width: 60px;
        height:26px;
        line-height: 26px;
        background: #f29b76;
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
      .btn{
        display: inline-block;
        margin-top: 30px;
        padding: 6px 30px;
        background: #f29b76;
        color: #fff;
        border-radius: 30px;
      }
    }
  }
  .expDate{
    width: 100%;
    text-align: center;
    padding: 14px 0;
    font-size: 16px;
    border: 1px solid #eeeeee;
    margin-top: -20px;
    .exp_date{
      color: red;
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
