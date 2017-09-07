<template>
<div>
<ts-title :title="'账户信息'"></ts-title>
<div class="personal-account">
  <div class="personal-account-item headImg personal-form">
    <label style="float:left">头像</label>
    <aliUpload fileType="1" :multiple="false" :id="id" @doUpload="uploadImg"></aliUpload>
    <div class="headImgSee">
      <label for="headImg" class="lb">重新上传</label>
      <img v-lazy="companyPro" />
    </div>
  </div>
  <div class="personal-account-item personal-form">
    <label>姓名</label>
    <input type="text" placeholder="请填写您的姓名" v-model="userForm.userName" @blur="checkName()" />
    <p v-show="!check.p1">请输入2-8位长度的名称</p>
  </div>
  <div class="personal-account-item personal-form">
    <label>微信</label>
    <input type="text" maxlength="20" placeholder="请填写您的微信号码" v-model="userForm.wechat" @blur="checkWe()" />
    <p v-show="!check.p4">您输入的微信号码格式错误</p>
  </div>
  <div class="personal-account-item personal-form">
    <label>QQ</label>
    <input type="text" placeholder="请填写您的QQ号码" v-model="userForm.qq" @blur="checkQQ()" />
    <p v-show="!check.p2">您输入的QQ格式错误</p>
  </div>
  <div class="personal-account-item personal-form">
    <label>邮箱</label>
    <input type="text" placeholder="请填写您的邮箱地址" v-model="userForm.email" @blur="checkEmail()" />
    <p v-show="!check.p3">您输入的Email格式错误</p>
  </div>
  <button class="personal-btn" @click="updateUserMethod">保存</button>
</div>
</div>
</template>

<script>
import tsTitle from '../components/personal-title.vue';
import {
  updateUser
} from '@/common/api/api';
import {
  aliUpload
} from '@/components';
import {
  mapGetters
} from 'vuex';
import {
  ALI_DOMAIN
} from '@/common/dict/const';
import * as reg from '@/common/js/regExp';
export default {
  data() {
    return {
      userForm: {
        qq: '',
        email: '',
        userHeadIcon: '',
        userName: '',
        wechat: ''
      },
      companyPro: {
        src: '',
        error: '/static/images/default.jpg',
        loading: ''
      },
      check: {
        p1: true,
        p2: true,
        p3: true,
        p4: true
      },
      id: 'headImg'
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  components: {
    aliUpload,
    tsTitle
  },
  created() {
    // 赋值
    this.userForm = this.userInfo;
    // 头像更新
    this.companyPro.src = this.userForm.userHeadIcon;
  },
  watch: {
    companyPro: {
      handler(val) {
        this.userForm.userHeadIcon = val.src;
      },
      deep: true
    }
  },
  methods: {
    // 上传图片
    uploadImg(e) {
      this.companyPro.src = ALI_DOMAIN + e[0].storeAs;
    },
    updateUserMethod() {
      let _ = this;
      _.checkName();
      _.checkQQ();
      _.checkEmail();
      _.checkWe();
      if (!(_.check.p1 && _.check.p2 && _.check.p3 && _.check.p4)) {
        return;
      }
      updateUser(this.userForm).then((res) => {}).catch();
    },
    checkName() {
      if (this.userForm.userName.length < 2 || this.userForm.userName.length > 8) {
        this.check.p1 = false;
      } else {
        this.check.p1 = true;
      }
    },
    checkQQ() {
      if (!reg.testQQ(this.userForm.qq)) {
        this.check.p2 = false;
      } else {
        this.check.p2 = true;
      }
    },
    checkEmail() {
      if (!reg.testEmail(this.userForm.email)) {
        this.check.p3 = false;
      } else {
        this.check.p3 = true;
      }
    },
    checkWe() {
      if (!reg.testWe(this.userForm.wechat)) {
        this.check.p4 = false;
      } else {
        this.check.p4 = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped="scoped">
.personal-account {
    margin-top: 40px;
    padding-left: 120px;
}

.personal-account-item {
    position: relative;
    margin-bottom: 25px;
    p {
        position: absolute;
        left: 105px;
        bottom: -18px;
        font-size: 14px;
        color: #FF0000;
    }
}

.headImg {
    height: 110px;
    label {
        line-height: 110px;
        vertical-align: top;
    }
}

.headImgSee {
    position: relative;
    display: inline-block;
    width: 106px;
    height: 106px;
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
    img {
        width: 100%;
        height: 100%;
    }
    &:hover .lb {
        bottom: 0;
    }
    .lb {
        position: absolute;
        bottom: -33px;
        width: 106px;
        height: 33px;
        line-height: 35px;
        background: #333333;
        opacity: 0.8;
        text-align: center;
        color: #FFFFFF;
        font-size: 16px;
        transition: 0.2s;
    }
}
</style>
