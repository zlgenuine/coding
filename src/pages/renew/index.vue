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
          <div class="vipMoney" style="">
            <img src="/static/images/app/vipIcon.png"/>
            <p>￥ <span class="money">{{userInfo.money}}</span> / 年</p>
          </div>
        </div>
        <div class="vipWrap vipIconWrap" >
          <p class="textTip">
            <img src="/static/images/app/VIP@2x.png"/>会员尊享以下10大特权
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
        <div class="vipWrap">
          <p class="textTip">选择支付方式</p>
          <div class="payType">
            <a target="_blank" ref="link">
              <img  @click="pay(2)" class="weixin" src="/static/images/app/weixin_pay.png"/>
            </a>
            <img @click="pay(1)" class="zhifubao" src="/static/images/app/zhifubao_pay.png"/>
          </div>
        </div>
      </div>
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
  export default {
    components: {
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
        rightList: [
          {
            icon: 'search_pic',
            title: '精准搜花',
            text: '专享精准无限次搜花',
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
        personal({id: this.$route.query.companyId}).then(res => {
          this.userInfo = res.data.data;
          for(let key in this.postParams) {
            (key !== 'orderType') && (this.postParams[key] = this.userInfo[key]);
            if (key === 'money') {
              this.postParams[key] = this.userInfo[key] * 100;
              // this.postParams[key] = 0.01 * 100;
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
      .payType{
        text-align: center;
        img{
          width: 160px;
          cursor: pointer;
          &.weixin{
            margin-right: 10%;
          }
          &.zhifubao{
            margin-left:10%;
          }
        }
      }
    }
  }
}
</style>
