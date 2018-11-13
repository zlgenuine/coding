<template>
<div class="topbar" id="topbar">
  <div class="content">
    <div class="left">
      <span class="welcome">坐视布管欢迎您!</span>
      <span v-if="isLogin">
        <router-link  to="/loginPage" class="link">登录</router-link>
        <router-link to="/registerPage" class="link">免费注册</router-link>
      </span>
      <span v-else>
      <span class="username" style="margin-right: 4px;">
        <img v-if="userInfo.isVip && userInfo.days > 0" src="/static/images/VIP1@2x.png" style="width: 16px;" />
        <img v-else src="/static/images/VIP@2x.png" style="width: 16px;" />
        {{userInfo.userName}}
      </span>
      <span class="logout" @click="handleLogout" >[退出]</span>
        <span v-if="!userInfo.isVip">
           <template v-if="userInfo.days <= 0 && userInfo.expStr">
             {{userInfo.expStr}}<a style="color: #20a0ff" @click="renew">【开通】</a>
          </template>
          <template v-else>
             成为会员，享受更优质服务<a style="color: #20a0ff" @click="renew">【开通】</a>
          </template>
        </span>
        <span v-else style="margin-left: 10px">
           {{eDay[0]}}<span style="color: #20a0ff"> {{eDay[1]}} </span> {{eDay[2]}} <a style="color: #20a0ff" @click="renew">【续费】</a>
        </span>
      </span>
    </div>
    <div class="right">
      <router-link class="link" style="margin-right: 10px;" to="/personal/index">个人中心</router-link>
      <a @click="goAboutUs" class="link" style="margin-right: 10px;">关于我们</a>
      <!--<a @click="handleGotoPerson" v-if="!isLogin" class="link">我的网店</a>-->
      <div class="app-qrcode">
        <!-- 坐视不管 -->
        <i class="iconfont icon-shouji"></i>
        <span>坐视布管</span>
        <div class="qrcode-content">
          <div class="qrcode clearfix">
            <div class="img-wrapper">
              <ts-image src="/static/images/qrcode/app.png" width="100" height="100" :canView="false" disabledHover></ts-image>
            </div>
            <div class="desc">
              <p class="title">坐视布管APP</p>
              <p class="red">扫码即可下载</p>
              <div class="app-type clearfix">
                <div class="andriod">
                  <i class="iconfont icon-anzhuo"></i>
                </div>
                <div class="ios">
                  <i class="iconfont icon-iOS" style="font-size:17px"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="app-qrcode">
        <i class="iconfont icon-weixin"></i>
        <span>公众号</span>
        <div class="qrcode-content">
          <div class="qrcode clearfix">
            <div class="img-wrapper">
              <ts-image src="/static/images/qrcode/qrcode_gzh.jpg" width="100" height="100" :canView="false" disabledHover></ts-image>
            </div>
            <div class="desc">
              <p class="title">关注微信公众号</p>
              <p class="red">扫码即可关注</p>
              <div class="text"></div>
            </div>
          </div>
        </div>
      </div>
      <a href="http://www.57lace.com/" class="link" target="_blank">
        <img src="/static/images/leisikong.png" width="60" class="leisikong">
      </a>
    </div>
  </div>
</div>
</template>

<script>
import {
  goto
} from '@/common/js/utils.js';
import {
  mapGetters
} from 'vuex';
import {
  loginOut,
  personaLevel
} from '@/common/api/api';
export default {
  computed: {
    ...mapGetters(['userInfo', 'token']),
    isLogin() {
      return !this.token;
    },
    eDay () {
      let arr = [];
      let dateStr = this.userInfo && this.userInfo.expStr.split('<');
      arr.push(dateStr[0]);
      arr.push(dateStr[1].split('/>')[0]);
      arr.push(dateStr[1].split('/>')[1]);
      return arr;
    }
  },
  methods: {
    renew () {
      // this.$messagebox.alert('如需续费，请拨打 <span style="color: #4c93fd">400-801-3357</span> 联系客服');
      goto(`/renew?companyId=${this.userInfo.companyId}`);
    },
    handleGotoPerson() {
      if (this.userInfo.companyId) {
        goto(`/shop/${this.userInfo.companyId}`);
      }
    },
    // 关于我们
    goAboutUs() {
      goto(`/aboutUs`);
    },
    // 退出
    async handleLogout() {
      await loginOut();
      await this.$store.commit('LOGIN_OUT');
      await this.$store.commit('CLEAR_USERINFO');
      // await this.$store.commit('GET_IS_MEMEBR', false);
      await this.$router.push('/loginPage');
    }
  },
};
</script>
<style lang="scss" scoped>
.icon-shouji::before {
    color: #4c93fd;
}
</style>
<style lang="stylus" scoped>
  .topbar
    height 33px
    line-height 33px
    box-sizing border-box
    border-bottom 1px solid #eaeaea
    font-size 12px
    color #999
    background #f2f2f2
    .content
      width 1200px
      margin 0 auto
      .left
        height 33px
        float left
        .welcome
          display inline-block
          margin-right 12px
        .link
          display inline-block
          height 13px
          line-height 13px
          padding 0 8px
          &:last-child
            border-left 1px solid #ddd
        .logout
          cursor pointer
          margin-right 4px
          &:hover
            color #3385ff
      .right
        float right
        height 33px
        .leisikong
          vertical-align middle
          margin-left 20px
        .app-qrcode
          display inline-block
          position relative
          margin-left 20px
          cursor pointer
          &:hover .qrcode-content
            display block
          .qrcode-content
            display none
            position absolute
            z-index 10
            line-height 1
            padding 0 12px
            right 0
            border 1px solid #eaeaea
            border-top none
            background #fff
            .qrcode
              width 100px
              height 100px
              margin 12px 0
              width 220px
              .img-wrapper
                float left
                width 100px
              .desc
                float left
                margin-left 12px
                height 100px
                .title
                  font-size 15px
                  line-height 30px
                .red
                  font-size 13px
                  color #f53535
                  line-height 30px
                .app-type
                  height 40px
                  .andriod,.ios
                    float left
                    line-height 40px
                  .icon-anzhuo::before
                  	color #38b338
                  	font-size 22px
                  	vertical-align middle
                  .icon-iOS::before
                  	position relative
                  	top 4px
                  	color #666
										font-size 24px
                  	vertical-align middle
                  .andriod
                  	margin-right 10px
</style>
