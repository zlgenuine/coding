<template>
  <div class="auth">
    <div class="logo_img">
      <img style="width: 100%" src="/static/images/auth.png"/>
      <span class="main_tip">{{data.isMain ? '已认证' : '未认证'}}</span>
    </div>
    <div class="authContent">
        <div class="authItem">
          <span class="label">收费标准</span>
          <div class="value">
            <span style="color: red; font-size: 18px">￥<span class="money">{{data.money}}</span>/ 年</span>
            <span class="money_tip" v-if="!data.isMain && !data.expDate">后续可享受280/年续费</span>
            <span class="money_tip" v-else style="text-decoration: line-through;">原价￥600/年</span>
          </div>

        </div>
      <div class="authItem">
          <span class="label">商机推荐</span>
          <div class="value">
            <span>认证您的主营业务，平台将为您推荐精准商机，不再错过任何生意</span>
          </div>

      </div>
      <div class="authItem">
          <span class="label">选择主营</span>
          <div class="value">
            <span v-for="(item,index) in typeList" class="typeItem" @click="chooseType(item, index)" :class="{'active': item.isSelected}">{{item.text}}</span>
          </div>

      </div>
      <div class="expDate">
        <!--未认证-->
        <template v-if="!data.isMain && !data.expDate ">
          认证后有效期至 <span class="exp_date">{{expDate}}</span>
        </template>

        <!--到期-->
        <template v-if="!data.isMain && data.expDate ">
          已到期, 续费后有效期至<span class="exp_date">{{expDate}}</span>
        </template>

        <!--未到期-->
        <template v-if="data.isMain && data.expDate">
          <span class="exp_date">{{data.expDate | filterDate('dateDay')}}</span>到期，续费后有效期将自动顺延
        </template>
      </div>

      <div class="btn" @click="authPay"> {{!data.isMain && !data.expDate ? '立即认证' : '立即续费'}}</div>
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
  import { authMsg, mainOrder, mainPreOrder } from '@/common/api/api';
  import Toast from '@/components/common/toast/toast';
  const typeList = [
    {
      value: '100010',
      text: '面料'
    }, {
      value: '100011',
      text: '大边'
    }, {
      value: '100012',
      text: '小边'
    }, {
      value: '100013',
      text: '睫毛'
    }
  ];
  export default {
    name: "personal-auth",
    data () {
      return {
        data: '',
        typeList: typeList,
        showPay: false,
        params: {
          companyId: '',
          companyName: '',
          companyType: '',
          contact: '',
          money: '',
          orderType: 4, //1一个月, 2三个月(季度)，3半年,4年
          phone: '',
          mainType: ''
        },
      };
    },
    computed: {
      typeStr () {
        let selectList = this.typeList.filter(item => item.isSelected).map(item => item.value);
        return selectList.join(',');
      },
      expDate () {
        let date = new Date();
        let y = date.getFullYear() + 1; //验证有效期为1年，所以在当前时间加1
        let m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 :  '0' + (date.getMonth() + 1);
        let d = date.getDate() >= 10 ? date.getDate() :  '0' + date.getDate();
        return y + '-' + m + '-' + d;
      }
    },
    methods: {
      chooseType(item, index) {
        this.$set(this.typeList[index], 'isSelected', !item.isSelected);
      },
      async getData () {
        let {data: {data}} = await authMsg();
        this.data = data;
        // 当有选择类型时，初始化
        let str = data.mainType && data.mainType.join(',');
        this.typeList = this.typeList.map(item => {
          let o = '';
          if(str && str.indexOf(item.value) >= 0){
            o = Object.assign({}, item, {isSelected: true});
          } else {
            o = Object.assign({}, item, {isSelected: false});
          }
          return o;
        });
        // 初始化参数
        for(let key in this.params) {
          (key !== 'orderType') && (this.params[key] = this.data[key]);
          (key === 'money') && (this.params[key] = this.data[key] * 100);
          // (key === 'money') && (this.params[key] = 0.01 * 100);
        }


      },
      authPay () {
        if (!this.typeStr){
          Toast({type: 'warning', message: '请选择主营类型'});
          return;
        }
        this.showPay = true;
        console.log(this.typeStr);
      },
      async pay (type) {
        console.log(type);
        this.showPay = false;
        // 下单
        this.params.mainType = this.typeStr;
        let {data: {data}} = await mainOrder(this.params);
        let {orderId, orderMoney} = data;

        if (type === 1) { // 支付宝
          let o = Object.assign({}, {
            orderCode: orderId,
            payMoney: orderMoney,
            paymentId: type,
            // returnUrl: `http://192.168.8.156:8081/paySuccess?d=${this.orderParams.orderId}&type=${type}`
            returnUrl: `https://www.ts57.cn/paySuccess?d=${orderId}&type=${type}&pt=4`
          });
          let res = await mainPreOrder(o);
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
              pt: 4
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
  .auth{
    .logo_img {
      position: relative;
      img{
        width: 100%;
      }
      .main_tip{
        position: absolute;
        padding: 2px 14px;
        border-radius: 30px;
        background: #fff;
        color: #999;
        top: 124px;
        left: 302px;
        font-size: 14px;
      }
    }
    .authContent{
      padding: 50px 20px 20px 20px;
      text-align: center;
      .authItem{
        margin-bottom: 30px;
        font-size: 16px;
        .label{
          display: inline-block;
          width: 90px;
          text-align: left;
          color: #999999;
        }
        .value{
          display: inline-block;
          width: 54%;
          text-align: left;
        }
        .money_tip{
          color: #999999;
        }
        .money{
          font-size: 44px;
        }
        .typeItem{
          display: inline-block;
          padding: 6px 30px;
          border: 1px solid #999999;
          margin-right: 20px;
          border-radius: 30px;
          cursor: pointer;
          &.active{
            background-color: #4A94FD;
            color: #fff;
          }
        }
      }
      .expDate{
        width: 100%;
        text-align: center;
        padding: 14px 0;
        font-size: 16px;
        border: 1px solid #eeeeee;
        margin-top: 60px;
        .exp_date{
          color: red;
        }
      }
      .btn{
        width: 240px;
        text-align: center;
        margin: 40px auto;
        color: #fff;
        background-color: #4A94FD;
        padding: 10px 0;
        border-radius: 30px;
        font-size: 18px;
        cursor: pointer;
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
