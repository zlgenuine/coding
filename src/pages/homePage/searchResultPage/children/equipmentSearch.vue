<template>
	<div class="result-wrapper">
		<ts-nav></ts-nav>
		<div class="title clearfix">
			<span style="width: 400px;">厂名</span>
			<span style="width: 300px;">疏节</span>
			<span style="width: 300px;">针数</span>
		</div>
		<div class="item-wrap">
			<div class="item-default" v-if="items.length < 1">
				未找到数据
			</div>
			<div class="item" v-for="item in items" v-else>
				<span style="width: 399px; margin-right: 1px;" :class="{isOk: item.companyId}" @click="goStore(item)">{{item.companyName}}</span>
				<span style="width: 299px; margin-right: 1px;">{{item.machineType || "没有数据"}}</span>
				<span style="width: 300px">{{item.machineNo || "没有数据"}}</span>
			</div>
			<pagination :page="pageData" @selectedPageNum="handleMore"></pagination>
		</div>
	</div>
</template>

<script>
	import { header, nav, search, pagination } from '@/components';
	import { getListDevice } from '@/common/api/api';
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				param: {
					machine: '',
					pageNo: 1,
					pageSize: 10
				},
				pageData: {
					pageNumArr: [],
					maxNum: 1,
					pageNO: 1
				},
				items: []
			};
		},
		computed: {
			...mapGetters(['userInfo', 'isMemeber'])
		},
		components: {
			vHeader: header,
			vNav: nav,
			search,
			pagination
		},
		watch: {
			$route(to, from) {
				console.log(to);
				console.log(from);
				if (to.query.search) {
					this.param.machine = to.query.search;
					this.getItems();
				}
			}
		},
		async created() {
			if (!this.isMemeber) {
				this.$messagebox({
					title: '你无此权限',
					message: '成为会员，请联系热线电话：4008013357',
					confirmButtonText: '知道了'
				}).then(() => {
					this.$router.push('/');
				});
				return;
			}
			if (this.$route.query.search) {
				this.param.machine = this.$route.query.search;
				let data = await getListDevice(this.param);
				this.items = data.data.data.list;
				this.pageData.maxNum = data.data.data.totalPage;
				this.pageData.pageNO = this.param.pageNo;
			}
		},
		methods: {
			async getItems() {
				let data = await getListDevice(this.param);
				this.items = data.data.data.list;
				this.pageData.maxNum = data.data.data.totalPage;
				this.pageData.pageNO = this.param.pageNo;
			},
			goStore(item) {
				if (!item.companyId) {
					return;
				}
				this.goto(`/shop/${item.companyId}`);
			},
			async handleMore(e) {
				this.param.pageNo = e;
				let data = await getListDevice(this.param);
				this.items = data.data.data.list;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.result-wrapper {
		margin: 0 auto;
		width: 1000px;
		.title {
			height: 54px;
			background: #fff;
			border-bottom: 2px solid #4C93FD;
			span {
				float: left;
				text-align: center;
				line-height: 54px;
				color: #333;
				font-size: 16px;
				font-weight: 600;
			}
		}
		.item-wrap {
			margin-top: 10px;
			min-height: 500px;
			.item {
				margin-bottom: 1px;
				height: 42px;
				span {
					float: left;
					background: #fff;
					text-align: center;
					line-height: 42px;
					color: #333333;
					font-size: 14px;
				}
				.isOk {
					color: #4C93FD;
					text-decoration: underline;
					cursor: pointer;
				}
			}
			.item-default {
				text-align: center;
				line-height: 200px;
				font-size: 16px;
			}
		}
	}
</style>
