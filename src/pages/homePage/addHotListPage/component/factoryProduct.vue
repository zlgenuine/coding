<template lang="html">
	<div class="factory">
		<div class="factory-row">
			<div class="factory-row--left" :style="{'width':width}">
				<p class="factory-company--title">{{data.companyName}}</p>
				<img width="100" height="100" :src="data.companyHeadIcon?data.companyHeadIcon:'/static/images/default/changjia.png'" style="margin: 20px 0;"/>
				<p class="factory-company--title1" :title="data.address.split('/.')[0]"><i class="icon-dianpu"></i>&nbsp;{{data.address.split('/.')[0]}}</p>
				<p class="factory-company--title1"><i class="icon-dianhua2"></i>&nbsp;{{data.phone}}</p>
				 <p class="factory-company--title1"><i class="icon-qq"></i>&nbsp;{{data.qq}}</p> 
				<p class="factory-company--title1"><i class="icon-weixin"></i>&nbsp;{{data.wechat}}</p>
				<!--<ts-button type="plain" size="large" class="factory-company--button button" @click="handleViewStore(data)">
					访问店铺
				</ts-button>-->
			</div>
			<div class="factory-row--right">
				<div class="factory-list-block onepx">
					<slot name="header"></slot>
				</div>
				<ts-grid :data="products">
					<ts-grid-item v-for="product in products" :key="product" @click="handleViewProduct(product)" :style="{'width':width}">
						<ts-image width="170" height="170" :canView="false" disabledHover :src="product.defaultPicUrl+'?x-oss-process=image/resize,m_fill,h_170,w_170'+watermask">
						</ts-image>
						<p class="factory-product--number">{{product.productNo}}</p>
						<template slot="footer">
							{{product.category | filterDict(dicTree.PRODUCT_TYPE,'name')}}
							<!-- <ts-tag>{{product.isStock | filterDict(DICT.isStock,'label')}}</ts-tag> -->
						</template>
					</ts-grid-item>
				</ts-grid>
			</div>
		</div>

	</div>
</template>

<script>
	import DICT from '@/common/dict';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				// 数据字典
				DICT: {
					isStock: DICT.isStock
				}
			};
		},
		props: {
			data: [Array, Object],
			products: [Array],
			width: {
				type: String,
				default: '200px'
			}
		},
		computed: {
			...mapGetters(['dicTree', 'watermask']),
			getPublishDate() {
				let firstPublish = this.data[0].productList[0];
				if (firstPublish) {
					return firstPublish.publishDate;
				}
			}
		},
		methods: {
			// 进去某个商品
			handleViewProduct(item) {
				this.$emit('viewProduct', item);
			},
			// 进去店铺
			handleViewStore(item) {
				this.$emit('viewStore', item);
			}
		}
	};
</script>

<style lang="css" scoped>
	:root {
		--grid-border-color: #eaeaea;
	}

	@import '../../../../common/css/_var.css';
	@import '../../../../common/css/mixin/setOnepx.css';
	@component-namespace factory {
		@component row {
			display: table;
			width: 100%;
			table-layout: fixed;
			position: relative;
			margin-bottom: 20px;
			&:before {
				@mixin setLeftLine var(--grid-border-color);
			}
			&:after {
				@mixin setTopLine var(--grid-border-color);
			}
			@modifier left {
				display: table-cell;
				text-align: center;
				position: relative;
				margin-bottom: 0;
				height: 100%;
				background: #f8f8f8;
				&:after {
					@mixin setBottomLine var(--grid-border-color);
				}
			}
			@modifier right {
				display: table-cell;
				vertical-align: middle;
				width: 100%;
				background: #fff;
			}
		}
		@component company {
			@modifier title {
				font-size: 17px;
				line-height: 20px;
				margin-top: 30px;
				@utils-ellipsis 2;
			}
			@modifier title1 {
				margin: 0 auto;
				width: 80%;
				font-size: 14px;
				color: #666;
				text-align: left;
				@utils-ellipsis 1;
				.icon-weixin:before{
					color:grey;
				}
			}
			@modifier cover {
				margin-top: 38px;
			}
			@modifier button {
				&.button {
					position: absolute * * 25px 50%;
					transform: translate(-50%);
					width: 80%;
				}
			}
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
		@component list {
			@descendent block {
				line-height: 48px;
				white-space: nowrap;
				display: flex;
				justify-content: space-between;
				padding: 0 20px;
				color: #333;
				p:last-child {
					color: #999;
				}
				span {
					color: #FF8400;
				}
			}
		}
	}
</style>
