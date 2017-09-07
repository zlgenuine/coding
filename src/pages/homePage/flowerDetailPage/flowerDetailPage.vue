<template>
<div class="flower-detail">
  <v-header :logoShow="logoShow">
     <search inputPlaceHolder='可输入编号查找' :globalLook='isGlobal' :showTab="isGlobal" @check="handleLookProduct" @search-text="handleSearchText" @change="handleGetResult" class="shopVisiting-search-inner">
      <span slot="select" class="flower-detail-search--span" v-if="!isGlobal">店内</span>
    </search>
  </v-header>
  <v-nav v-show="navShow"></v-nav>
  <div class="flower-detail-wrapper">
    <div v-show="!isSearch">
      <product-intro></product-intro>
      <update-product></update-product>
    </div>
    <!-- 搜索 -->
    <div v-if="isSearch">
      <ts-button @click="isSearch=false">返回上一级</ts-button>
      <ts-grid :data="Search.list">
        <ts-grid-item v-for="(product,e) in Search.list" :key="product" @click="handleViewProduct(product.id)">
          <ts-image width="170" height="170" :canView="false" disabledHover :src="product.defaultPicUrl">
          </ts-image>
          <p class="flower-detail-product--number">{{product.productNo}}</p>
          <template slot="footer">
         <span v-if="product.price>0&&!!product.price">¥{{product.price/100}}/{{product.priceUnit | filterDict(DICT.PriceUnits) }}</span>
         <span v-else>价格面议</span>
          </template>
        </ts-grid-item>
      </ts-grid>
      <ts-pagination type="page" class="flower-detail-pagination" :total="Search.totalNum" :current="Search.pageNO" :pageSize="Search.pageSize" @change="handleChangeProductNum" v-show="isSearchText"></ts-pagination>
      <ts-button v-show="!isSearchText" @click="handleLoadMore" type="plain" class="flower-detail-pagination">加载更多花型</ts-button>
    </div>
  </div>
  <div>
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
  mapGetters
} from 'vuex';
import {
  searchMtd
} from '@/common/api/api';
import DICT from '@/common/dict/';
import ProductIntro from './children/productIntro.vue';
import UpdateProduct from './children/updateProducts.vue';
export default {
  data() {
    return {
      DICT: {
        PriceUnits: DICT.PriceUnits
      },
      Search: {},
      navShow: true,
      logoShow: true,
      isSearch: false,
      searchVal: '',
      isSearchText: '',
      Param: {
        text: {
          keywords: '',
          searchType: 1,
          companyId: '',
          pageNo: 1,
          pageSize: 10
        },
        img: {
          id: '',
          pageNo: 1,
          pageSize: 10
        }
      }
    };
  },
  components: {
    vHeader: header,
    vNav: nav,
    search,
    ProductIntro,
    UpdateProduct
  },
  watch: {
    $route(to, from) {
      this.$store.dispatch('getProduct', this.$route.params.id);
    }
  },
  computed: {
    ...mapGetters(['companyInfo', 'search', 'userInfo']),
    isGlobal() {
      return this.$route.query.route !== 'shop';
    }
  },
 methods: {
    // 进去某个商品
    handleViewProduct(item) {
      this.goto(`/product/${item}?route=shop`);
    },
    // // 选择分类的时候
    async handleLookProduct(item) {
      this.Param.img.pageNo = 1;
      await this.$store.commit('SET_SEARCH_EMPTY');
      await this.$store.dispatch('getSearchEncoded', {
        companyId: this.$route.query.companyId,
        category: item.category,
        encoded: item.encoded,
        searchType: 300
      });
    },
    async handleChangeProductNum(pageNo) {
      this.Param.text = Object.assign({}, this.Param.text, {
        keywords: this.searchVal,
        companyId: this.$route.query.companyId,
        pageNO: pageNo++
      });
      this.Search = (await searchMtd(search)).data.data;
    },
    async handleLoadMore() {
      this.isSearch = true;
      this.isSearchText = false;
      this.Param.img = Object.assign({}, this.Param.img, {
        id: this.Param.img.id,
        pageNo: this.Param.img.pageNo++
      });
      await this.$store.dispatch('searchGetResult', this.Param.img);
      this.$nextTick(() => {
        this.Search.list = this.search.list;
      });
    },
    async handleGetResult(val) {
      this.isSearch = true;
      this.isSearchText = false;
      this.Param.img = Object.assign({}, this.Param.img, {
        id: val
      });
      await this.$store.dispatch('searchGetResult', this.Param.img);
      this.$nextTick(() => {
        this.Search.list = this.search.list;
      });
    },
    handleSearchText(val) {
      this.isSearch = true;
      this.isSearchText = true;
      this.searchVal = val;
      this.Param.text.pageNo = 1;
      this.Param.text = Object.assign({}, this.Param.text, {
        keywords: this.searchVal,
        companyId: this.$route.query.companyId
      });
      this.$nextTick(async() => {
        this.Search = (await searchMtd(this.Param.text)).data.data;
      });
    }
  },
  beforeDestroy() {
    document.querySelector('#topbar').style.display = '';
    document.querySelector('#concat').style.display = '';
  },
  mounted() {
    if (!this.isGlobal) {
      document.querySelector('#topbar').style.display = 'none';
      document.querySelector('#concat').style.display = 'none';
      this.navShow = false;
      this.logoShow = false;
    }
    document.querySelector('.main-wrapper').style.background = '#fff';
    this.$store.dispatch('getProduct', this.$route.params.id);
  }
};
</script>

<style scoped>
@component-namespace flower-detail {
  @component wrapper {
    max-width: 1200px;
    margin: 10px auto;
  }
  @component pagination {
    display: table;
    margin: 10px auto;
  }
  @component search {
    @modifier span {
      background: #f5f6f7;
      height: 100%;
      line-height: 1;
      padding: 9px 16px;
      display: inline-block;
    }
  }
}
</style>
