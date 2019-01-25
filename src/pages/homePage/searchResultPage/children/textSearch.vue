<template>
	<div class="textSearch-wrapper">
		<ts-navbar v-model="selected" v-if="!isShopRoute">
			<ts-tab-item class="textSearch-tab-item" id="1">搜索花型结果</ts-tab-item>
			<ts-tab-item class="textSearch-tab-item" id="2">搜索厂家结果</ts-tab-item>
		</ts-navbar>
		<ts-tab-container v-model="selected" class="models-tab-container">
			<!-- 搜索花型 -->
			<ts-tab-container-item id="1">
				<div class="textSearch-filter">
					<ts-filter title="分类">
						<ts-radio-group v-model="Filter.categorys" @change="handleChangeCategorys">
							<ts-radio :label="null">全部</ts-radio>
							<ts-radio :label="item.dicValue" v-for="item in dicTree.PRODUCT_TYPE" :key="item.dicValue">
								{{item.name}}
							</ts-radio>
						</ts-radio-group>
					</ts-filter>
					<ts-filter title="库存盘点">
						<ts-radio-group v-model="Filter.isStock" @change="handleChangeIsStock">
							<ts-radio :label="null">全部</ts-radio>
							<ts-radio :label="item.dicValue" v-for="item in DICT.isStock" :key="item.id">
								{{item.label}}
							</ts-radio>
						</ts-radio-group>
					</ts-filter>
				</div>
				<ts-grid :data="Search.list" class="textSearch-data">
					<ts-grid-item style="width:240px" v-for="product in Search.list" :key="product">
						<div class="textSearch-image-box-img" >
							<ts-image width="170" height="170"
									:canView="false" disabledHover
									:src="getImg(product.defaultPicUrl)"
                                    @click="handleGotoProduct(product.id)">
							</ts-image>
							<div class="textSearch-title">
								<p class="textSearch-title-left">{{product.productNo}}</p>
								<p>{{product.updateDate | customTime}}发布</p>
							</div>
							<img src="/static/images/tuijian.jpg" v-if="product.isBest===1"
								 class="textSearch-image-box-watermask" alt="">
						</div>
						<template slot="footer">
							<!--<p class="textSearch-product-company">{{product.companyName}}</p>-->
							<p class="textSearch-product-contact" @click="handleGotoProduct(product.id)">联系厂家</p>
							<span v-if="product.price>0&&!!product.price">¥{{product.price / 100}}/{{product.priceUnit | filterDict(DICT.PriceUnits)
								}}</span>
							<span v-else>价格面议</span>
						</template>
					</ts-grid-item>
				</ts-grid>
				<ts-pagination type="page" class="textSearch-pagination" :total="Search.totalNum"
							   :current="Search.pageNO" :pageSize="Search.pageSize"
							   @change="handleChangeProductNum"></ts-pagination>
			</ts-tab-container-item>
			<!-- 搜索厂家 -->
			<ts-tab-container-item id="2">
				<text-table :params="company"></text-table>
			</ts-tab-container-item>
		</ts-tab-container>
	</div>
</template>

<script>
  import {imgPath} from '@/common/js/utils';
  import {
    mapGetters
  } from 'vuex';
  import DICT from '@/common/dict';
  import TextTable from './text/table.vue';
  import {
    searchMtd
  } from '@/common/api/api';

  export default {
    data () {
      return {
        selected: '1',
        // 数据字典
        DICT: {
          PriceUnits: DICT.PriceUnits,
          isStock: DICT.isStock,
          userType: DICT.userType
        },
        Filter: {
          categorys: null,
          isStock: null
        },
        company: '',
        Search: {},
        Params: {
          pageSize: 10,
          pageNo: 1,
          categorys: null,
          isStock: null,
          keywords: '',
          companyId: ''
        }
      };
    },
    methods: {
      getImg (img) {
        if (this.isShopRoute) {
          return imgPath(img, 'x-oss-process=image/resize,m_fill,h_170,w_170');
        }
        return imgPath(img, 'x-oss-process=image/resize,m_fill,h_170,w_170' + this.watermask);
      },
      handleChangeProductNum (number) {
        this.Params.pageNo = number;
      },
      handleGotoProduct (id) {
        this.goto(`/product/${id}`);
      },
      handleChangeCategorys () {
        this.Params.categorys = this.Filter.categorys;
        this.Params.pageNo = 1;
      },
      handleChangeIsStock () {
        this.Params.isStock = this.Filter.isStock;
        this.Params.pageNo = 1;
      }
    },
    watch: {
      searchValue (val) {
        this.Params = Object.assign({}, this.Params, {
          keywords: val,
          pageNo: 1,
          categorys: null,
          isStock: null
        });
        this.Filter = Object.assign({}, this.Filter, {
          categorys: null,
          isStock: null
        });
      },
      async selected (val) {
        if (val === '2') {
          this.company = this.$route.query.search;
        }
      },
      Params: {
        async handler (val) {
          this.Search = (await searchMtd(val)).data.data;
          console.log(val);
        },
        deep: true
      }
    },
    components: {
      TextTable
    },
    computed: {
      ...mapGetters(['dicTree', 'productDetail', 'watermask']),
      isShopRoute () {
        return !~this.$route.path.indexOf('/search/text');
      },
      searchValue () {
        return this.$route.query.search;
      }
    },
    async created () {
      this.Params = Object.assign({}, this.Params, {
        keywords: this.$route.query.search,
        searchType: this.$route.query.searchType,
        companyId: this.isShopRoute ? this.$route.query.companyId : null
      });
    }
  };
</script>

<style lang="css" scoped>
@component-namespace textSearch{
	@component filter{
		background: #fff;
		margin-top: 10px;
	}
	@component data{
		margin: 16px 0;
		background: #fff;
	}
	@component pagination{
		display: table;
		margin: 7px auto;
	}
	@component product{
		@modifier number{
      font-size: 16px;
      margin-top: 10px;
      text-align: left;
			max-width: 200px;
      @utils-ellipsis;
    }
		@descendent company{
			@utils-ellipsis;
			max-width: 65%;
		}
		@descendent contact{
			border: 1px solid #4C93FD;
            border-radius: 4px;
            color: #4C93FD;
		    font-size: 12px;
            padding: 1px 3px;
        }
  }
  @component title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;
    @descendent left {
      flex: 1;
      padding-right: 4px;
      text-align: left;
      @utils-ellipsis;
    }
  }
	@component image-box{
		@descendent img{
			position: relative;
		}
		@descendent watermask{
			position: absolute 0 20px * *;
		}
	}
	@component tab-item{
		max-width: 150px;
	}
}
</style>
