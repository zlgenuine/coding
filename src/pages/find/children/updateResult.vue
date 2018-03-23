<template>
<div class="update-result-wrapper">
	<ts-nav :data="navData"></ts-nav>
  <p class="update-result-tip">
    <span class="ranking update-result-tip-ranking" :class="`ranking_${$route.params.id}`" v-if="$route.params.id<=3" v-show="topSearch_page===1"></span> 
    周搜索量
    <span class="update-result-tip--count">{{$route.query.searchs}}</span>／共<span class="update-result-tip--count">{{$route.query.sameCount}}</span>款
    <span v-show="topSearch_page===1">，排行<span class="update-result-tip--ranking">{{$route.params.id}}</span>位</span>
  </p>
  <ts-grid :data="Search" class="update-result-data">
    <ts-grid-item style="width:240px" v-for="product in Search" :key="product" @click="handleGotoProduct(product.id)">
      <ts-image width="170" height="170" :canView="false" disabledHover :src="imgPath(product.defaultPicUrl,'x-oss-process=image/resize,m_fill,h_170,w_170'+watermask)">
      </ts-image>
      <p class="update-result-product--number">{{product.productNo}}</p>
      <template slot="footer">
         <span v-if="product.price>0&&!!product.price">¥{{product.price/100}}/{{product.priceUnit | filterDict(DICT.PriceUnits) }}</span>
        <span v-else>价格面议</span>
       </template>
    </ts-grid-item>
  </ts-grid>
  <!--<ts-button type="plain" @click="handleLoadMore">加载更多爆款</ts-button>-->
  <pagination :page="pageData" @selectedPageNum="handleMore"></pagination>
</div>
</template>

<script>
import DICT from '@/common/dict';
import {
  searchGetHot
} from '@/common/api/api';
import { mapGetters } from 'vuex';
import { pagination } from '@/components/';
import {imgPath} from '@/common/js/utils';
export default {
  data() {
    return {
      Search: [],
      // 数据字典
      DICT: {
        PriceUnits: DICT.PriceUnits
      },
      Params: {
        pageNo: 1,
        pageSize: 10,
        rank: ''
      },
      // 分页
      pageData: {
				pageNumArr: [],
				maxNum: 1,
				pageNO: 1
			},
      // 面包屑导航data
      navData: {
      parentName: '新增热搜',
      childName: '热搜详情',
      path: '/hotListPage'
      }
    };
  },
  components: {
		pagination
	},
// watch: {
//  Params: {
//    async handler(val) {
//      let data = (await searchGetHot(val)).data.data;
//      this.Search = data.list;
//      this.pageData.maxNum = data.totalPage;
//      this.pageData.pageNO = this.Params.pageNo;
//    },
//    deep: true
//  }
// },
  methods: {
    imgPath,
    async handleMore(number) {
    console.log(number);
      this.Params.pageNo = number;
      let data = (await searchGetHot(this.Params)).data.data;
      this.Search = data.list;
      this.pageData.maxNum = Math.ceil(this.$route.query.sameCount / 12);
      this.pageData.pageNO = this.Params.pageNo;
      console.log(this.pageData);
    },
    handleGotoProduct(id) {
      this.goto(`/product/${id}`);
    }
  },
  computed: {
    ...mapGetters(['watermask', 'topSearch_page'])
  },
  async created() {
    this.Params.rank = this.$route.params.id;
    let data = (await searchGetHot(this.Params)).data.data;
    this.Search = data.list;
    this.pageData.maxNum = Math.ceil(this.$route.query.sameCount / 12);
    this.pageData.pageNO = this.Params.pageNo;
  }
};
</script>

<style lang="css" scoped>
@component-namespace update-result{
  @component product{
    @modifier number{
      font-size: 16px;
      margin-top: 10px;
      text-align: left;
      max-width: 200px;
      @utils-ellipsis;
    }
  }
  @component data{
    margin-bottom: 16px;
  }
  @component wrapper{
    /*text-align: center;*/
  }
  @component tip{
    text-align: center;
    font-size: 20px;
    margin: 16px auto;
    @modifier count{
      color:#3385ff;
    }
    @descendent ranking{
      vertical-align: middle;
    }
    @modifier ranking{
      color:#ff8400;
    }
    span{
      margin: 0 4px;
    }
  }
}
</style>
