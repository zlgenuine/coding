<template>
	<div class="nav-wrapper">
		<div class="nav-wrapper-box">
			<router-link :to="item.path" :key="item.path" class="nav-wrapper-item" v-for="item in nav" tag="span" @click.native="handleView(item.path)">
				<span class="nav-wrapper-item--title">
        		{{item.name}}
        		<i class="nav-wrapper-item--num" v-if="!!item.num">{{getFirstValue(item.num)}}</i>
      			</span>
			</router-link>
		</div>
	</div>
</template>

<script>
	import {
		countLastDay
	} from '@/common/api/api';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				nav: []
			};
		},
		methods: {
			getFirstValue(item) {
				let temp = '';
				for (let i in item) {
					temp = item[i];
					return temp;
				}
			},
			handleView(path) {
				if (path === '/shopManagePage') {
					if (this.userInfo.id) {
						this.goto(`/shop/${this.userInfo.companyId}`);
						return;
					}
					this.$router.push('/loginPage');
					return;
					//      this.$router.push('/');
				}
			}
		},
		computed: {
			...mapGetters(['navs', 'userInfo']),
			getIsShopMam() {
				return this.$route.path.indexOf('/shop/') >= 0;
			}
		},
		watch: {
			navItem(val) {
				if (this.others) {
					this.$nextTick(() => {
						this.nav = val;
					});
				}
			}
		},
		async created() {
			if (!this.others) {
				// =======
				// 针对全局导航
				// ========
				// 如果导航数据存到vuex中=>直接获取
				if (this.navs) {
					this.nav = this.navs;
					return;
				}
				// 否则
				let isHasNum = this.navItem.some(item => item.num);
				if (isHasNum) {
					// 统计昨日数量
					let res = await countLastDay();
					if (!res.data.code) {
						this.navItem.forEach(item => {
							if (item.num) {
								let data = {};
								// 在每个具有num属性里面=>添加
								Object.defineProperty(data, Object.keys(item.num)[0], {
									enumerable: true,
									configurable: true,
									writable: true,
									value: res.data.data[Object.keys(item.num)[0]]
								});
								item.num = data;
							}
						});
						this.$store.commit('SET_NAV', this.navItem);
					}
				}
			}
			this.$nextTick(() => {
				this.nav = this.navItem;
			});
		},
		props: {
			others: {
				type: Boolean,
				default: false
			},
			// 默认的导航条
			navItem: {
				type: [Array, Object],
				default: function() {
					return [{
							path: '/homePage',
							name: '首页'
						},
						{
							path: '/hotListPage',
							name: '新增热搜',
							num: {
								newAndHot: ''
							}
						},
						{
							path: '/supplyOrBuy',
							name: '供应求购',
							num: {
								supplyAndBuy: ''
							}
						},
						{
							path: '/find/everyLooking',
							name: '大家在找',
							num: {
								everyoneFind: ''
							}
						},
						{
							path: '/entryListPage',
							name: '入驻信息',
							num: {
								entering: ''
							}
						},
						{
							path: '/warehouseManage',
							name: '仓库管理'
						},
						{
							path: '/shopManagePage',
							href: '',
							name: '我的网店'
						},
						{
							path: '/threeDDressPage',
							name: '3D试衣'
						}
//						{
//							path: '/order',
//							name: '订单管理'
//						}
					];
				}
			}
		}
	};
</script>

<style scoped>
	@component-namespace nav {
		@component wrapper {
			background: #4c93fd;
			padding: 1px 10px;
			min-height: 36px;
			text-align: center;
			@descendent container {
				size: 1200px 40px;
				margin: 0 auto;
			}
			@descendent item {
				display: inline-block;
				height: 36px;
				line-height: 36px;
				width: 140px;
				cursor: pointer;
				color: #fff;
				text-align: center;
				@modifier title {
					position: relative;
					display: inline-block;
				}
				@modifier num {
					/*position: absolute 4px 12px * *;*/
					line-height: 1;
					padding: 1px 8px;
					border-radius: 6px;
					font-size: 12px;
					vertical-align: 7px;
					background: rgb(255, 156, 49);
				}
				&:hover {
					background: #3385ff;
				}
				&.active {
					color: #4c93fd;
					border-radius: 2px;
					background: #fff;
					.nav-wrapper-item--num {
						color: #fff;
					}
				}
			}
		}
	}
</style>
