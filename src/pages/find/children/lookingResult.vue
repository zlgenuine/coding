<template lang="html">
	<div class="lookingResult-wrapper">
		<ts-nav :data="navData"></ts-nav>
		<div class="lookingResult-target">
			<div class="lookingResult-target-cover">
				<!--<ts-image width='100' height='100' :src="searchSingle.searchSource" :canView="false"
          disabledHover></ts-image>-->
				<magnifier :imgSrc="searchSingle.searchSource" :width="100" :height="100"></magnifier>
			</div>
			<div class="lookingResult-target-detail">
				<p>查找类型：{{searchSingle.category | filterDict(dicTree.PRODUCT_TYPE,'name')}}</p>
				<p v-if="userInfo.userType===1">查找人：{{searchSingle.user?searchSingle.user.companyName:''}}</p>
				<p v-if="userInfo.userType===1">联系方式：{{searchSingle.user?searchSingle.user.userMobile:''}}</p>
				<p class="lookingResult-target-detail--title">温馨提示：白色的花型图片更利于找到匹配花型哦。</p>
			</div>
		</div>
		<ts-title-block :bodyStyle="{'font-size':'20px'}">
			<i class="icon-huaxin"></i>&nbsp;查找结果
		</ts-title-block>
		<div class="lookingResult-result">
			<ts-grid :data="Search">
				<ts-grid-item style="width:240px" v-for="product in Search" :key="product" @click="handleViewProduct(product.id)">
					<ts-image width="170" height="170" :canView="false" disabledHover :src="product.defaultPicUrl+'?x-oss-process=image/resize,m_fill,h_170,w_170'+watermask">
					</ts-image>
					<p class="lookingResult-product--number">{{product.productNo}}</p>
					<template slot="footer">
						<span v-if="product.price>0&&!!product.price">¥{{product.price/100}}/{{product.priceUnit | filterDict(dicTree.PRODUCT_UNIT,'name') }}</span>
						<span v-else>价格面议</span>
					</template>
				</ts-grid-item>
			</ts-grid>
		</div>
		<ts-button class="lookingResult-pagination" @click="handleChangePage" type="plain">查找更多{{searchSingle.category | filterDict(dicTree.PRODUCT_TYPE,'name')}}</ts-button>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		searchHistoryId,
		searchGetResult
	} from '@/common/api/api';
	export default {
		data() {
			return {
				DICT: {

				},
				// 单条搜索记录
				searchSingle: {
					user: {}
				},
				// 搜索记录列表
				Search: [],
				Param: {
					id: '',
					pageNo: 1,
					pageSize: 10
				},
				navData: {
					parentName: '大家在找',
					childName: '查找详情',
					path: '/find/everyLooking',
					query: ''
				}
			};
		},
		computed: {
			...mapGetters(['dicTree', 'userInfo', 'watermask'])
		},
		methods: {
			handleChangePage(number) {
				this.Param.pageNo++;
			},
			handleViewProduct(id) {
				this.goto(`/product/${id}`);
			}
		},
		watch: {
			Param: {
				async handler(val) {
					let lists = (await searchGetResult(val)).data.data.list;
					this.Search = this.Search.concat(lists);
				},
				deep: true
			}
		},
		async created() {
			this.navData.query = this.$route.query;
			this.searchSingle = (await searchHistoryId(this.$route.params.id)).data.data;
			this.Param.id = this.searchSingle.id;
		}
	};
</script>

<style lang="css" scoped>
	@component-namespace lookingResult {
		@component pagination {
			margin: 7px auto;
			display: table;
		}
		@component product {
			@modifier number {
				font-size: 16px;
				margin-top: 10px;
				text-align: left;
				max-width: 200px;
				@utils-ellipsis;
			}
		}
		@component target {
			width: 650px;
			margin: 0 auto;
			display: flex;
			align-items: center;
			@descendent detail {
				margin-left: 30px;
				p {
					line-height: 25px;
				}
				@modifier title {
					color: #999;
				}
			}
		}
	}
</style>
