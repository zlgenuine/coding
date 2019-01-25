<template>
    <div class="paySuccess">
      <v-header>
        <search></search>
      </v-header>
      <v-nav></v-nav>
      <div class="content">
        <div class="success_tip">
          <img src="/static/images/app/paySuccess.png" />
          <span class="tip_text">您已成功支付<span class="price">{{o.money / 100 || 0}}</span>元 ！</span>
        </div>
        <p>支付方式：{{$route.query.type === '1' ? '支付宝' : '微信'}}</p>
        <p>支付编号：{{orderCode || 0}}</p>
        <p>付款时间：{{s_date | filterDate}}</p>

        <!--会员才显示会员到期时间-->
        <p class="exp" v-if="o.expDate">会员到期时间：{{o.expDate | filterDate}}</p>

        <div class="warning_tip">
            <img src="/static/images/app/warning.png"/>
            为了方便后续查询交易，建议留存该笔交易端的支付编号
        </div>
        <div>
          <span class="to_home" @click="toHome">返回首页</span>
        </div>
      </div>
    </div>
</template>

<script>
  import {
    header,
    nav,
    search
  } from '@/components';
  import {become, adOrderInfo, bestOrderInfo} from '@/common/api/api';
  export default {
    components: {
      'vHeader': header,
      'vNav': nav,
      search,
    },
    data () {
      return {
        orderCode: this.$route.query.d,
        s_date: new Date(),
        o: '',
        payType: this.$route.query.pt || '1', // 1表示会员支付，2表示广告支付，3表示优质商家支付
      };
    },
    methods: {
      async getData () {
        let payWay = {
          '1': () => become({orderCode: this.orderCode}),
          '2': () => adOrderInfo({orderCode: this.orderCode}),
          '3': () => bestOrderInfo({orderCode: this.orderCode})
        };
        let {data:{data}} = await payWay[this.payType]();
        this.o = data;
      },
      toHome () {
        this.$router.replace('/homePage');
        setTimeout(()=>{
          window.location.reload();
        },100);

      }
    },
    mounted () {
      this.getData();
    }
  };
</script>

<style scoped lang="scss">
.paySuccess{
  .content{
    max-width: 1100px;
    margin: 20px auto;
    background-color: #fff;
    padding: 30px 0 30px 140px;
    box-sizing: border-box;
    border: 1px solid #20a0ff;
    .success_tip{
      img{
        vertical-align: middle;
        width: 30px;
      }
      .tip_text{
        font-size: 18px;
        font-weight: bold;
        margin-left: 10px;
        .price{
          color: red;
        }
      }
    }
    p{
      margin: 18px 0;
      &.exp{
        color: red;
      }
    }
    .warning_tip{
      font-weight: bold;
      padding: 6px 10px;
      background-color: #f2f2f2;
      border: 1px solid #20a0ff;
      width: 58%;
      img{
        /*vertical-align: middle;*/
        margin-right: 10px;
        position: relative;
        top: -2px;
      }
    }
    .to_home{
      font-size: 18px;
      margin-top: 30px;
      color: #20a0ff;
      cursor: pointer;
      font-weight: bold;
      display: inline-block;
    }
  }
}
</style>
