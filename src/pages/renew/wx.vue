<template>
    <div class="wxPay">
      <!--<div class="pay_mask"></div>-->
      <div class="code">
        <div class="pay-desc">
          <h2>请及时付款</h2>
          <p class="orderNum">订单号：{{orderId}}</p>
          <div>
            <p style="display: inline-block">请在<span style="font-size: 16px; color: red;font-weight: bold; margin: 0 2px">{{timerText}}</span>分钟内付款，否则该付款码将失效</p>
            <p class="price-tip">
              <span class="tip-text">实付：</span>
              <span class="tip-num">￥{{payMoney / 100}}</span>
            </p>
          </div>
        </div>
        <div class="qrcode">
          <!--<img class="code-img" src="/static/images/qrcode/app.png"/>-->
          <div class="code_img_warp">
            <img class="code-img" :src="qr" alt="二维码已失效"/>
            <!--<img class="refresh" src="/static/images/app/refresh.png" @click="rePay" v-if="qr_timeout"/>-->
            <div class="code_mask" v-if="qr_timeout" ></div>
            <span class="refresh" v-if="qr_timeout" @click="rePay">点击刷新</span>
          </div>
          <p>微信扫一扫支付</p>
        </div>
        <img class="wx-img" src="/static/images/qrcode/bitmap.png"/>
        <div>
          <span style="margin-top: 10px; font-size: 20px; color: #20a0ff;cursor: pointer" @click="$router.go(-1)">选择其他付款方式 》</span>
        </div>
      </div>
    </div>
</template>

<script>
  import {place,preOrder,queryPayStatus} from '@/common/api/api';
  export default {
    data () {
        return {
          orderId: this.$route.query.d,
          payMoney:this.Decrypt(this.$route.query.m),
          paymentId: this.$route.query.t,
          payNumber: '',
          qr: null,
          payStatus: 0,     // 支付状态:0未支付  1已支付
          timeout: false,   // 订单超时
          qr_timeout: false, // 二维码超时
          int: null,
          qrInt: null,
          timerText: 20
        };
    },
    computed: {
      // 请求参数
      params () {
        return {
          'orderCode': this.orderId,
          'payMoney': Number(this.payMoney),
          'paymentId': this.paymentId
        };
      }
    },
    methods: {
      async pay () {
        let {data} = await preOrder(this.params);
        // 微信支付
        this.qr = data.data.result.payQr;
        this.payNumber = data.data.result.payNumber;
        this.int = window.setInterval(() => {
          if (!this.qr_timeout) this.queryPayStatus();
          // 支付完成，取消轮询
          if (Number(this.payStatus)) {
            window.clearInterval(this.int);
            // 跳往支付成功界面
            this.$router.push({path: '/paySuccess', query: {d: this.orderId}});
            console.log('支付成功');
          }
        }, 2* 1000);
        // 二维码超时,有效时间10分钟
        this.qrInt = window.setInterval(() => {
          this.qr_timeout = true;
        }, 20 * 60 * 1000);
      },
      rePay () {
        this.timerText = 20;
        this.pay();
        this.countTime();
        this.payStatus = 0;
        this.qr_timeout = false;
      },
      async queryPayStatus () {
        if (this.payNumber && !this.payStatus) {
          let {data} = await queryPayStatus({payNumber: this.payNumber});
          if (data.code === 0) {
            this.payStatus = Number(data.data.payStatus);
          }
          console.log('----------', this.payStatus);
        }
      },
      countTime () {
        let timer = window.setInterval(() => {
          if (this.timerText > 1) {
            this.timerText--;
            console.log('1>>>>>>>>>>>>>>>>>>>1');
          } else {
            console.log('>>>>>>>>>>>>>>>');
            console.log('结束定时器');
            console.log('>>>>>>>>>>>>>>>');
            this.timerText = 0;
            window.clearInterval(timer);
            timer = null;
          }
        }, 60 * 1000);
      }
    },
    watch: {
      qr_timeout (val) {
        if (val) {
          this.payStatus = 0;
          this.qr = '';
          window.clearInterval(this.int);
          window.clearInterval(this.qrInt);
          this.int = null;
          this.qrInt = null;
        }
      }
    },
    created () {
      this.pay();
      this.countTime();

      // 订单超时:2小时
      // window.setTimeout(() => {
      //   this.timeout = true;
      //   this.qr_timeout = true;
      //   window.clearInterval(this.int);
      //   window.clearInterval(this.qrInt);
      //   console.log('clear');
      // }, 2 * 60 * 60 * 1000);
    },
    destroyed () {
      console.log('离开');
      // this.timeout = true;
      this.qr_timeout = true;
      window.clearInterval(this.int);
      window.clearInterval(this.qrInt);
      this.int = null;
      this.qrInt = null;
    }
  };
</script>

<style scoped lang="scss">
.wxPay {
  .code {
    width: 80%;
    height: 90%;
    min-height: 600px;
    background-color: #FFF;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    z-index: 3;
    text-align: center;
    .pay-desc{
      background-color: #f4ebeb;
      width: 80%;
      padding: 20px;
      margin: 30px auto;
      text-align: left;
      .orderNum{
        margin: 8px 0;
      }
      .price-tip{
        float: right;
        .tip-text{
          font-size: 20px;
          font-weight: bold;
        }
        .tip-num{
          color: red;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
    .qrcode{
      display: inline-block;
      position: relative;
      top: 80px;
      .code_img_warp{
        display: inline-block;
        padding: 4px;
        border: 1px solid #cccccc;
        width: 180px;
        height: 180px;
        position: relative;
        .code-img{
          width: 100%;
          height: 100%;
        }
        .code_mask{
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: #000000;
          opacity: 0.5;
          cursor: pointer;
        }
        .refresh{
          color: #fff;
          font-weight: bold;
          position: absolute;
          font-size: 18px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
        }
      }
      p{
        font-weight: bold;
        font-size: 18px;
        margin-top: 10px;
      }
    }
    .wx-img{
      margin-left: 80px;
    }
  }

}
</style>
