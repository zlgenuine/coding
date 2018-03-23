<template>
	<div class="hotSearch-content" ref="hotSearch">
		<ts-grid :data="BurstHotSearch" class="hotSearch-content">
			<ts-grid-item width="200px" v-for="(product,index) in BurstHotSearch" :key="product" @click="handleViewProduct(product,index)">
				<span class="ranking hotSearch-rank" :class="`ranking_${index+1}`" v-if="index<3&&pageData.pageNO===1"></span>
				<ts-image width="170" height="170" :canView="false" disabledHover :src="imgPath(product.pics[0],'x-oss-process=image/resize,m_fill,h_170,w_170'+watermask)">
				</ts-image>
				<template slot="footer" class="hotSearch-footer">
					<p>搜索量&nbsp;<span class="hotSearch-footer--searchNum">{{product.searchs}}</span></p>
					<p class="hotSearch-footer--total">共{{product.sameCount}}款</p>
				</template>
			</ts-grid-item>
		</ts-grid>
		<br/>
		<!--<ts-button type="plain" @click="handleLoadMore" style="margin-bottom: 20px;">加载更多爆款</ts-button>-->
		<pagination :page="pageData" @selectedPageNum="handleLoadMore"></pagination>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex';
	import { burstHotSearch } from '@/common/api/api';
	import { pagination } from '@/components/';
    import {imgPath} from '@/common/js/utils';
	export default {
		data() {
			return {
				Params: {
					pageNo: 1,
					pageSize: 24
				},
				pageData: {
					pageNumArr: [],
					maxNum: 1,
					pageNO: 1
				},
				BurstHotSearch: {}
			};
		},
		components: {
			pagination
		},
		computed: {
			...mapGetters(['watermask'])
		},
		watch: {
			'Params.pageNo'(val) {
				this.$store.commit('SET_TOPSEARCH_PAGE', val);
			}
		},
		methods: {
            imgPath,
			async handleLoadMore(number) {
				this.Params.pageNo = number;
				let data = (await burstHotSearch(this.Params)).data.data;
				this.BurstHotSearch = data.list;
				this.pageData.maxNum = data.totalPage;
				this.pageData.pageNO = this.Params.pageNo;
			},
			// 进去某个商品
			handleViewProduct(item, id) {
				this.$router.push({
					name: 'updateResult',
					params: {
						id: id + 1
					},
					query: {
						sameCount: item.sameCount,
						searchs: item.searchs
					}
				});
			}
		},
		async created() {
			try {
				let { data } = await burstHotSearch(this.Params);
				this.BurstHotSearch = data.data.list;
				this.pageData.maxNum = data.data.totalPage;
				this.pageData.pageNO = this.Params.pageNo;
				this.$store.commit('SET_TOPSEARCH_PAGE', this.pageData.pageNO);
			} catch (e) {
				console.log('获取爆款热搜失败');
			}
		}
	};
</script>

<style lang="css" scoped>
	@component-namespace hotSearch {
		@component rank {
			position: absolute;
			z-index: 1;
		}
		@component content {
			padding-bottom: 30px;
			margin-top: 10px;
			text-align: center;
			background: #fff;
		}
		@component footer {
			@modifier searchNum {
				color: #FF8400;
			}
			@modifier total {
				color: #999999;
			}
		}
	}
</style>
