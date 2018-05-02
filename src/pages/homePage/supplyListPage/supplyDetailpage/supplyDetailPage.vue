<template>
<div class="supply-detail-page">
  <v-header>
    <search></search>
  </v-header>
  <v-nav></v-nav>
  <div class="supply-detail-box">
    <div class="supply-detail-wrap clearfix">
      <div class="supply-detail-nav">
        <router-link to="homePage">首页</router-link> >
        <router-link :to="{path:'/supplyOrBuy', query:{type: 2, pageData: pageData}}">厂家供应</router-link> >
        <span>供应详情</span>
      </div>
      <div class="supply-detail-left fl">
        <supply-content :obj="resData"></supply-content>
      </div>
      <div class="supply-detail-right fr">
        <supply-list :item="resData"></supply-list>
      </div>
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
import supplyContent from './supply-content';
import supplyList from './supply-list';
import {
  getCompanySupply
} from '@/common/api/api';
import {
  mapGetters
} from 'vuex';
export default {
  data() {
    return {
      param: {
        id: ''
      },
      resData: {},
      pageData: ''
    };
  },
  components: {
    'vHeader': header,
    'vNav': nav,
    search,
    supplyContent,
    supplyList
  },
  computed: {
    ...mapGetters(['userInfo', 'isMemeber'])
  },
  created() {
    // 厂家会员账号也可以查看其他厂家发布的供应；
    if (this.userInfo.userType === 1 && !this.isMemeber) {
      this.$router.push('/');
    } else {
      this.getCompanySupplyMethod();
    }
    if (this.$route.query.pageData) {
    this.pageData = this.$route.query.pageData;
    }
  },
  methods: {
    getCompanySupplyMethod() {
      this.param.id = this.$route.query.supplyId;
      getCompanySupply(this.param.id).then((res) => {
        if (res.data.code === 0) {
          this.resData = res.data.data;
        }
      }).catch();
    }
  }
};
</script>

<style lang="scss" scoped>
.supply-detail-box {
    width: 100%;
    min-height: 700px;
    background: #fff;
    .supply-detail-wrap {
        margin: 0 auto;
        width: 1200px;
    }
}

.supply-detail-wrap {
    padding-bottom: 60px;
}

.supply-detail-nav {
    padding: 30px 0;
    a,
    span {
        font-size: 16px;
        color: #999;
    }
    a:hover {
        color: #4C93FD;
    }
}
</style>
