<template>
    <div class="renew">
      <v-header>
        <search></search>
      </v-header>
      <v-nav></v-nav>
      <div class="content">
        <ts-title-block>会员商家</ts-title-block>
        <div class="vipWrap">
          <p class="textTip">开通会员商家享最优服务</p>
          <template v-if="!userInfo.isJump">
            <div class="vipMoney" style="">
              <img src="/static/images/app/vipIcon.png"/>
              <p>￥ <span class="money">{{userInfo.money}}</span> / 年</p>
            </div>
          </template>
          <template v-else>
            <div class="b_vip">
               <div class="b_vip_item">
                 <span class="recommend">推荐</span>
                 <p class="money_wrap">￥ <span class="money">{{userInfo.otherMoney && userInfo.otherMoney.year }}</span></p>
                 <p>12个月付费</p>
                 <p>会员服务</p>
                 <p>续费专享￥888/年</p>
                 <p style="color: #20a0ff">到期(30天内)</p>
                 <span class="pay_btn" @click="showPayWay('year')">立即开通</span>
               </div>
              <div class="b_vip_item">
                <p class="money_wrap">￥ <span class="money">{{userInfo.otherMoney && userInfo.otherMoney.halfYear }}</span></p>
                <p>6个月付费</p>
                <p>会员服务</p>
                <span class="pay_btn"  @click="showPayWay('halfYear')">立即开通</span>
               </div>
              <div class="b_vip_item">
                <p class="money_wrap">￥ <span class="money">{{userInfo.otherMoney && userInfo.otherMoney.season }}</span></p>
                <p>3个月付费</p>
                <p>会员服务</p>
                <span class="pay_btn"  @click="showPayWay('season')">立即开通</span>
               </div>
            </div>
          </template>

        </div>
        <div class="vipWrap vipIconWrap" >
          <p class="textTip">
            <img src="/static/images/app/VIP@2x.png"/>会员尊享以下特权
          </p>
          <template v-for="item in rightList">
            <div class="vipIcon">
              <img :src="'/static/images/app/' + item.icon + '.png' "/>
              <div class="desc">
                <h3>{{item.title}}</h3>
                <p>{{item.text}}</p>
              </div>
            </div>
          </template>
        </div>
        <div class="vipWrap" v-if="!userInfo.isJump">
          <p class="textTip">选择支付方式</p>
          <div class="payType">
            <a target="_blank" ref="link">
              <img  @click="pay(2)" class="weixin" src="/static/images/app/weixin_pay.png"/>
            </a>
            <img @click="pay(1)" class="zhifubao" src="/static/images/app/zhifubao_pay.png"/>
          </div>
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
  import {
    goto
  } from '@/common/js/utils.js';
  import {
    header,
    nav,
    search
  } from '@/components';
  import {place,preOrder,personal,queryPayStatus} from '@/common/api/api';
  import TsDialog from "../../components/common/tsDialog";
  export default {
    components: {
      TsDialog,
      'vHeader': header,
      'vNav': nav,
      search,
    },
    computed: {

    },
    data () {
      return {
        postParams: {
          companyId: '',
          companyName: '',
          companyType: '',
          contact: '',
          money: '',
          orderType: 4,
          phone: ''
        },
        orderParams: '',
        userInfo: '',
        showPay: false,
        rightList: [
          {
            icon: 'search_r',
            title: '更多花型',
            text: '海量搜花结果',
            isBest: false
          },
          {
            icon: 'search_pic',
            title: '精准搜花',
            text: '专享精准无限次搜花',
            isBest: false
          }, {
            icon: 'search_s',
            title: '搜花保密',
            text: '设置被查找花型保密',
            isBest: false
          },{
            icon: 'settle',
            title: '入驻信息',
            text: '了解最新厂家/贸易商信息',
            isBest: false
          },{
            icon: 'flower',
            title: '最新花型',
            text: '及时了解最新上架花型',
            isBest: false
          },{
            icon: 'search_hot',
            title: '热搜花型',
            text: '精准了解一下最新行情市场',
            isBest: false
          },{
            icon: 'search_normal',
            title: '大家在找',
            text: '专享海量实单需求',
            isBest: false
          },{
            icon: 'search_shop',
            title: '店内搜花',
            text: '高效管理',
            isBest: false
          },{
            icon: 'dress',
            title: '3D试衣',
            text: '真实试衣功能',
            isBest: false
          },{
            icon: 'message',
            title: '询单客户',
            text: '不错过潜在客户',
            isBest: false
          },{
            icon: 'service',
            title: '代客找花',
            text: '专业帮找花',
            isBest: false
          },{
            icon: 'search_device',
            title: '设备查找',
            text: '最新设备数据',
            isBest: false
          }
          // ,{
          //   icon: 'mico',
          //   title: '微官网',
          //   text: '企业风采展示',
          //   isBest: true
          // },

        ]
      };
    },
    methods: {
      showPayWay (type) {
        let orderType = {
          year: 4,
          halfYear: 3,
          season: 2
        };
        this.postParams.orderType = orderType[type];
        // this.postParams.money = this.userInfo.otherMoney[type] * 100;
        this.postParams.money = 0.01 * 100;
        this.showPay = true;
        console.log(this.postParams);
      },
      async pay (type) {
        // 下单
        let {data: {data: data}} = await place(this.postParams);
        this.orderParams = data;

        let o = Object.assign({}, {
          orderCode: this.orderParams.orderId,
          payMoney: this.orderParams.orderMoney,
          paymentId: type,
          // returnUrl: `http://192.168.8.156:8081/paySuccess?d=${this.orderParams.orderId}&type=${type}`
          returnUrl: `https://www.ts57.cn/paySuccess?d=${this.orderParams.orderId}&type=${type}`
        });

        if (type === 1) { // 支付宝
          let res = await preOrder(o);
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
              m: this.Encrypt(o.payMoney),
              d: o.orderCode,
              t: type
            }
          });
        }
      },
      getData () {
        personal().then(res => {
          this.userInfo = res.data.data;
          for(let key in this.postParams) {
            (key !== 'orderType') && (this.postParams[key] = this.userInfo[key]);
            if (key === 'money') {
              // this.postParams[key] = this.userInfo[key] * 100;
              this.postParams[key] = 0.01 * 100;
            }
          }
        });

      },
    },
    mounted () {
      this.getData();
    }
  };
</script>

<style scoped lang="scss">
.renew{
  .ts-title-block{
   padding-bottom: 16px;
  }
  .content{
    max-width: 1100px;
    margin: 10px auto;
    .vipWrap{
      padding: 14px;
      background-color: #fff;
      margin-bottom: 10px;
      .textTip{
        margin-bottom: 10px;
        color: #999999;
      }
      .b_vip{
        text-align: center;

        .b_vip_item{
          vertical-align: top;
          width: 22%;
          margin-right: 80px;
          display: inline-block;
          height: 220px;
          border: 1px solid #b4ff6c;
          position: relative;
          padding-top: 30px;
          box-sizing: border-box;
          &:last-child{
            margin-right: 0;
          }
          .recommend{
            position: absolute;
            width: 60px;
            height:26px;
            line-height: 26px;
            background: #20a0ff;
            color: #fff;
            top: 0;
            left: 0;
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
            text-align: center;
          }
          .money_wrap{
            color: red;
            .money{
              font-size: 28px;
            }
          }
          .pay_btn{
            padding: 4px 24px;
            color: #fff;
            background: #20a0ff;
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 20px;
            cursor: pointer;
          }
        }
      }
      .vipMoney{
        background-color: #D8BD89;
        height: 220px;
        background-image: url(/static/images/app/background.png);
        background-position: bottom;
        background-repeat: no-repeat;
        text-align: center;
        color: #fff;
        img{
          width: 140px;
          margin-top: 10px;
        }
        p{
          font-size: 22px;
          margin-top: -10px;
          .money{
            font-size: 42px;
            font-weight: bold;
            vertical-align: middle;
          }
        }

      }
      &.vipIconWrap{
        padding: 20px;
        .textTip{
          margin-bottom: 0;
          color: #b19969;
          font-size: 16px;
          img{
            margin-right: 6px;
            width: 20px;
            vertical-align: middle;
          }
        }
        .vipIcon{
          display: inline-block;
          width: 50%;
          margin-top: 20px;
          img{
            width: 60px;

          }
          .desc{
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
            color: #999999;
            h3{
              margin-bottom: 4px;
              color: #666666;
            }
          }
        }
      }
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
