<template lang="html">
  <div class="shopVisiting all">
    <header class="clearfix">
      <div class="shopVisiting-header-left fl clearfix">
        <span class="fl" v-if="showSetting" @click="goShopSetting">网<br />店</span>
        <div class="shopVisiting-header-left--logo fl">
          <img v-lazy="companyInfo.companyHeadIcon" width="70" height="70" />
          <em>{{companyInfo.companyName}}</em>
        </div>
      </div>
      <div class="shopVisiting-search">
        <search inputPlaceHolder='可输入编号查找' :globalLook='false' :showTab="false" @check="handleLookProduct" @search-text="handleSearchText" @change="handleGetResult" class="shopVisiting-search-inner">
          <span slot="select" class="shopVisiting-search-inner--span">店内</span>
        </search>
      </div>
    </header>
    <!-- 背景图 -->
    <intro-pic></intro-pic>
    <!-- nav -->
    <div class="shopVisiting-navBox" ref="shopVisiting">
      <v-nav :navItem="navItem" others></v-nav>
    </div>
    <!-- 子页面 -->
    <div class="shopVisiting-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {
  header,
  nav,
  search
} from '@/components';
import {
  getVisitSystemProductCategoryList
} from '@/common/api/api';
import {
  mapGetters,
  mapActions
} from 'vuex';
import introPic from './children/introPic';
import navItem from './nav';
export default {
  data() {
    return {
      DICT: {
        SearchType: [{
          dicValue: 1,
          label: '店内'
        }]
      },
      inputPlaceHolder: '可输入编号查找',
      navItem: navItem,
      showSetting: false,
      companyId: ''
    };
  },
  watch: {
    userInfo(val) {
      if (val.companyId && this.$route.params.id && Number(val.companyId) === Number(this.$route.params.id)) {
        this.showSetting = true;
      }
    },
    $route(to) {
      this.$nextTick(() => {
        this.$refs.shopVisiting.scrollIntoView(true);
      });
    }
  },
  methods: {
    ...mapActions(['getCompanyInfo']),
    // // 选择分类的时候
    async handleLookProduct(item) {
      await this.$store.commit('SET_SEARCH_EMPTY');
      await this.$store.dispatch('getSearchEncoded', {
        companyId: this.$route.params.id,
        category: item.category,
        encoded: item.encoded,
        searchType: Number(`${this.companyInfo.companyType}00`)
      });
    },
     async handleGetResult(val) {
      this.$router.push({
        path: `searchimage`,
        query: {
          imgId: val,
          companyId: this.$route.params.id
        }
      });
    },
    handleSearchText(val) {
      this.$router.push({
        path: `searchtext`,
        query: {
          search: val,
          searchType: 1,
          companyId: this.$route.params.id
        }
      });
    },
    // async handleGetResult(val) {
    //   this.$router.push({
    //     path: `searchimage`,
    //     query: {
    //       imgId: val
    //     }
    //   });
    // },
    // handleSearchText(val) {
    //   this.$router.push({
    //     path: `searchtext`,
    //     query: {
    //       search: val,
    //       searchType: 1
    //     }
    //   });
    // },
    goShopSetting() {
      this.$router.push({
        path: '/shopManagePage/enquiry'
      });
    }
  },
  computed: {
    ...mapGetters(['companyInfo', 'search', 'userInfo'])
  },
  async created() {
     await this.$store.dispatch('getCompanyInfo', {
      companyId: this.$route.params.id
    });
    if (this.userInfo.companyId && this.$route.params.id && Number(this.userInfo.companyId) === Number(this.$route.params.id)) {
      this.showSetting = true;
    }
    if (this.userInfo.userType === 2 || this.companyInfo.companyType === 2) {
      this.$nextTick(() => {
          this.navItem = this.navItem.filter(item => item.path !== 'supplies');
      });
    }
    let systemCategory = (await getVisitSystemProductCategoryList({
      companyId: this.$route.params.id
    })).data.data;
    let dujiahuaxing = systemCategory.some(item => item.className === '独家花型');
    if (!dujiahuaxing) {
      this.$nextTick(() => {
        this.navItem = this.navItem.filter(item => item.path !== 'exclusive');
      });
    }
    this.companyId = this.userInfo.companyId;
  },
  mounted() {
    document.querySelector('.main-wrapper').style.backgroundColor = '#fff';
    document.querySelector('#topbar').style.display = 'none';
  },
  beforeDestroy() {
    document.querySelector('#topbar').style.display = '';
  },
  components: {
    'vHeader': header,
    'vNav': nav,
    introPic,
    search
  }
};
</script>

<style lang="css" scoped>
  @component-namespace shopVisiting {
    @component wrapper {
      margin-top: 10px;
      background: #fff;
      max-width: 1200px;
      margin: 1em auto;
    }
    @component select {
      width: 88px;
      min-width: 80px;
      max-width: 80px;
      margin-right: 5px;
    }
    @component search {
      float:right;
      width: 600px;
      position: relative;
      @descendent inner{
        padding-top: 45px;
        @modifier span{
          background: #f5f6f7;
          height: 100%;
          line-height: 1;
          padding: 9px 16px;
          display: inline-block;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
.shopVisiting.all {
    .ts-select-toggle {
        border: none;
        background: rgba(155, 155, 155, .1);
    }
}

.shopVisiting {
    header {
        margin: 0 auto;
        width: 1200px;
        min-height: 120px;
    }
    &-navBox {
        padding-bottom: 8px;
        background: url("/static/images/shop/huabian.png") repeat-x bottom;
    }
    &-header-left {
        margin-right: 120px;
        width: 460px;
        span {
            margin: 30px 20px 0;
            padding: 15px 8px;
            width: 20px;
            background: #4C93FD;
            border-radius: 8px;
            color: #FFF;
            font-size: 17px;
            line-height: 18px;
            text-align: center;
            cursor: pointer;
        }
        &--logo {
            margin: 30px 0 0 30px;
            img {
                border-radius: 50%;
            }
            em {
                padding-left: 12px;
                color: #333;
                font-size: 18px;
                font-weight: 600;
            }
        }
    }
}
</style>
