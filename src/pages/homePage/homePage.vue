<template>
<div class="homePage">
  <v-header>
    <search></search>
  </v-header>
  <v-nav></v-nav>
  <div class="swiper">
    <!-- autoplay :autoplay-speed="5000" -->
    <ts-carousel fade v-model="value" arrow="hover" trigger="hover" autoplay :autoplay-speed="5000" easing='linear'>
    	<ts-carousel-item v-for="(item,index) in banners.dynamic">
        <ts-image :src="banner(item.pic)" @click.native="handleGotoAboutLace(item.link)" height="350" class="home-image" :canView="false" disabledHover></ts-image>
      </ts-carousel-item>
      <ts-carousel-item v-for="(item,index) in banners.static">
        <ts-image :src="banner(item)" height="350" class="home-image" :canView="false" disabledHover></ts-image>
      </ts-carousel-item>
    </ts-carousel>
  </div>
  <div class="homePage-box">
    <!--滚动窗口-->
    <div class="">
      <roll-list></roll-list>
    </div>
    <!-- 优质 -->
    <div class="list" id="bestCompany">
      <entry-list></entry-list>
    </div>
    <!--产品配套-->
    <div class="product">
      <div class="product-title">
        <span class="head">
						产业链配套
					</span>
        <p class="eng">Industry Matching</p>
      </div>
      <div class="product-body clearfix">
        <div class="item item-1">
        </div>
        <div class="item item-2">
        </div>
        <div class="item item-3" @click="goProduct(1)">
        </div>
        <div class="item item-4" @click="goProduct(2)">
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  header,
  nav,
  search,
  rollList,
  entryList
} from '@/components';
import {
  // listHomeBanners,
  listProductBuys,
  listCompanySupplys,
  findNewCompanyByIndex
} from '@/common/api/api';
import {mapGetters} from 'vuex';
import {BANNER} from '@/common/dict/const';
import {imgPath} from '@/common/js/utils';
export default {
  data() {
    return {
      CompanyListParam: {
        pageNo: 1,
        pageSize: 50
      },
      // banner图
      banners: BANNER,
      value: 0,
      total: 1,
      purchaseListObj: {}, // 求购列表
      supplyListObj: {}, // 供应列表
      newCompanyList: [] // 最新入驻
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  components: {
    'vHeader': header,
    'vNav': nav,
    search,
    rollList,
    entryList
    //  purchaseList,
    //  supplyList,
    //  qualityList
  },
  watch: {
    userInfo: {
      handler(val) {
        this.index();
      },
      deep: true
    }
  },
  methods: {
    banner(path) {
      let width = document.body.clientWidth || document.documentElement.clientWidth;
      return imgPath(path,`x-oss-process=image/resize,w_${width},h_350,m_fill`);
    },
    goProduct(e) {
      this.goto(`/productExplain?params=${e}`);
    },
    handleGotoAboutLace(path) {
      this.goto(path);
    },
    handleViewProduct(id) {
      this.goto(`/shop/${id}`);
    },
    async index() {
      // =====
      // banner
      // ====
      // listHomeBanners().then(res => {
      //   let bannerArr = res.data.data;
      //   this.bannerImgs = bannerArr;
      // }).catch(res => {});
      // ====
      // 获取求购列表
      // ====
      this.purchaseListObj = {
        type: 'buy',
        data: (await listProductBuys({
          buyStatus: 0,
          pageNo: 1,
          pageSize: 4
        })).data.data.list
      };
      // ======
      // 获取供应列表
      // =======
      this.supplyListObj = {
        type: 'supply',
        data: (await listCompanySupplys({
          supplyStatus: 1, // 供应状态 1--供应中 2--已关闭
          pageNo: 1,
          pageSize: 4
        })).data.data.list
      };
      // ========
      // 获取厂家入驻列表
      // ========
      this.newCompanyList = (await findNewCompanyByIndex({
        companyType: 1 // 1工厂 2 档口
      })).data.data;
    }
  },
  created() {
    this.index();
  }
};
</script>
<style lang="scss" scoped>
.product {
    margin-bottom: 100px;
    width: 100%;
    &-title {
        text-align: center;
        .head {
            position: relative;
            font-size: 18px;
            font-weight: 600;
            color: #333333;
            &::after {
                position: absolute;
                top: 50%;
                left: -260px;
                content: '';
                display: inline-block;
                width: 200px;
                height: 1px;
                background: #e5e5e5;
            }
            &::before {
                position: absolute;
                top: 50%;
                right: -260px;
                content: '';
                display: inline-block;
                width: 200px;
                height: 1px;
                background: #e5e5e5;
            }
        }
        .eng {
            font-size: 12px;
            color: #666;
        }
    }
    &-body {
        margin-top: 30px;
        .item {
            margin-right: 12px;
            float: left;
            width: 290px;
            height: 200px;
            &:nth-of-type(4n) {
                margin: 0;
            }
        }
        .item-1 {
            background: url("/static/images/product/product4.jpg");
        }
        .item-2 {
            background: url("/static/images/product/product3.jpg");
        }
        .item-3 {
            cursor: pointer;
            background: url("/static/images/product/product1.jpg");
        }
        .item-4 {
            cursor: pointer;
            background: url("/static/images/product/product2.jpg");
        }
    }
}
</style>
<style lang="stylus" scoped>
  .homePage
    background #f2f2f2
    .swiper
      width 100%
      height 350px
      max-width 1920px
      margin 0 auto
    .homePage-box
      width 1200px
      margin 0 auto
      padding 16px 0
      background #f2f2f2
      .list
        margin 32px 0
      .button
        width 20%
        margin-top 20px
</style>
