<template lang="html">
	<div class="update" style="margin-top: 10px;">
		<div class="update-container">
			<div v-for="item in NewProductList">
				<factory-update @viewProduct="handleViewProduct" @viewStore="handleViewStore" :data="item" :products="item.productList">
					<template slot="header">
						<p>新增&nbsp;<span>{{item.newCount}}</span>&nbsp;款／共&nbsp;<span>{{item.totalCount}}</span>&nbsp;款</p>
						<p>{{ item.publishDate | customTime }}</p>
						<span class="fr router" @click="handleViewStore(item)">访问店铺<i class="icon-gengduo"></i></span>
					</template>
				</factory-update>
			</div>
		</div>
		<div class="topSearch-btn">
			<!--<ts-button @click="handleMore" type="plain" class="topSearch-button">
				加载更多厂家
			</ts-button>-->
			<pagination :page="pageData" @selectedPageNum="handleMore"></pagination>
		</div>
	</div>
</template>

<script>
	import factoryUpdate from '../component/factoryProduct.vue';
	import { pagination } from '@/components/';
	import {
		mapGetters
	} from 'vuex';
	import {
		getCompanyNewProductList
	} from '@/common/api/api';
	export default {
		data() {
			return {
				Params: {
					pageNo: 1,
					pageSize: 10
				},
				pageData: {
					pageNumArr: [],
					maxNum: 1,
					pageNO: 1
				},
				NewProductList: []
			};
		},
		computed: {
			...mapGetters(['watermask']),
			length() {
				return this.NewProductList.list.length > 0;
			}
		},
		components: {
			factoryUpdate,
			pagination
		},
		methods: {
			handleViewProduct(item) {
				this.goto(`/product/${item.id}`);
			},
			handleMore(number) {
				this.Params.pageNo = number;
			},
			// 进去店铺
			handleViewStore(company) {
				this.goto(`/shop/${company.companyId}`);
				// this.goto(`http://${company.indexName}.lacewang.cn`);
			}
		},
		watch: {
			Params: {
				async handler(val) {
					let data = (await getCompanyNewProductList(this.Params)).data.data;
					this.NewProductList = data.list;
					this.pageData.maxNum = data.totalPage;
					this.pageData.pageNO = this.Params.pageNo;
				},
				deep: true
			}
		},
		async created() {
			let data = (await getCompanyNewProductList(this.Params)).data.data;
			this.NewProductList = data.list;
			this.pageData.maxNum = data.totalPage;
			this.pageData.pageNO = this.Params.pageNo;
		}
	};
</script>
<style lang="scss" scoped>
.router {
	position: relative;
	padding-right: 30px;
	color: #333 !important;
	font-size: 14px;
	cursor: pointer;
	i {
		position: absolute;
		padding-left: 6px;
		top: 17px;
	}
}
</style>
