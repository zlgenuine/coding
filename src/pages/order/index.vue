<template>
	<div class="order">
		<ts-header>
			<search></search>
		</ts-header>
		<ts-nav></ts-nav>
		<div class="order-container clearfix">
			<div class="order-container-nav">
				<h1>订单管理</h1>
				<ul>
					<li v-for="navItem in navItems" :class="{ 'nav-b':navItem.isBorder }">
						<router-link :to="navItem.path">
							<span>
							{{ navItem.context }}
							</span>
						</router-link>
					</li>
				</ul>
			</div>
			<div class="order-container-item">
				<div class="item-box">
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { header, nav, search } from '@/components';
	//	import {mapGetters} from 'vuex';
	export default {
		components: {
			'tsHeader': header,
			'tsNav': nav,
			search
		},
		data() {
			return {
				title: '账户信息',
				navItems: [{
						context: '大货订单',
						path: 'cargo'
					},
					{
						context: '剪版订单',
						path: 'cutVersion'
					},
					{
						context: '剪样订单',
						path: 'cuttings'
					}
				]
			};
		},
		async created() {
//			await setTimeout(() => {
//				alert(1);
//			}, 40);
		}
	};
</script>

<style lang="scss" scoped>
	.order {
		width: 100%;
		&-container {
			width: 1200px;
			margin: 50px auto;
			background: #fff;
			&-nav {
				float: left;
				width: 256px;
				min-height: 728px;
				background: #fff;
				text-align: center;
				h1 {
					margin: 50px 0;
					font-size: 24px;
					font-weight: 400;
					color: #333;
					&::after {
						content: '';
						display: block;
						margin: 15px auto 30px;
						width: 85%;
						height: 1px;
						background: #eaeaea;
					}
				}
				li {
					margin-bottom: 20px;
					font-size: 16px;
					color: #333;
					cursor: pointer;
					text-align: left;
					.active {
						span {
							position: relative;
							color: #5296fd;
							&::after {
								content: '';
								display: block;
								position: absolute;
								left: -16px;
								top: -2px;
								width: 4px;
								height: 20px;
								background: #5296fd;
							}
						}
					}
					span {
						margin-left: 86px;
						&:hover {
							color: #5296fd;
						}
					}
				}
			}
			&-item {
				float: left;
				padding: 0 20px;
				width: 904px;
				min-height: 728px;
				background: #fff;
			}
		}
	}
</style>
