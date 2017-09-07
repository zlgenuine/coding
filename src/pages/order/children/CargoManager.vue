<template>
	<div class="order-cargo">
		<ts-title :title="'大货订单管理'"></ts-title>
		<div class="order-cargo-wrap">
			<ts-filter title="订单分类">
				<ts-radio-group v-model="Filter.sort" @change="hanleFilterSort">
					<ts-radio :label="item.label" v-for="item in classData">{{item.name}}<span style="color: #4C93FD;">{{item.label}}</span></ts-radio>
				</ts-radio-group>
			</ts-filter>
			<div class="order-cargo-wrap--searchBox">
				<ts-form :model="searchForm" :rules="rules" ref="searchForm" inline label-width="85px">
					<ts-form-item label="订单关键词" prop="keyWord" style="margin: 0 0 0 20px;">
						<ts-input placeholder="货品名称 / 订单号" v-model="searchForm.keyWord"></ts-input>
					</ts-form-item>
					<ts-form-item label="下单时间" prop="startTime" style="margin-bottom: 0; width: 260px;">
						<ts-date-picker placeholder="选择起始时间" v-model="searchForm.startTime" backward></ts-date-picker>
					</ts-form-item>
					<label style="padding: 5px 10px 0 0; line-height: 35px;">至</label>
					<ts-form-item prop="endTime" style="margin-bottom: 0; width: 185px;" :marginLeft="false">
						<ts-date-picker placeholder="选择结束时间" v-model="searchForm.endTime" backward></ts-date-picker>
					</ts-form-item>
					<ts-button type="primary" @click="submitForm('searchForm')">搜索</ts-button>
				</ts-form>
			</div>
			<div class="order-cargo-wrap--checkBox">
				<ts-checkbox @change="handleHideList" v-model="checkbox.hideList" :label="checkbox.data.id">隐藏关闭的交易订单</ts-checkbox>
			</div>
			<div class="order-cargo-wrap--contentBox">
				<ts-menu-table :header="false" style="margin-bottom: 15px;">
					<ts-menu-table-item width="260">订单详情</ts-menu-table-item>
					<ts-menu-table-item width="114">运费</ts-menu-table-item>
					<ts-menu-table-item width="80">备货期</ts-menu-table-item>
					<ts-menu-table-item width="140">金额</ts-menu-table-item>
					<ts-menu-table-item width="80">订单状态</ts-menu-table-item>
					<ts-menu-table-item width="100">操作</ts-menu-table-item>
				</ts-menu-table>
				<ts-menu :prop="list">
					<ts-menu-table content v-for="item in list">
						<div class="title" slot="header-left">
							<span>
								<!--<img src="../../../../dist/static/images/assets/clock.svg" width="40" height="40"/>-->
								{{item.author}}
							</span>
							<span class="column">订单号：{{item.listNum}}</span>
							<span class="column">下单时间：{{item.time}}</span>
						</div>
						<ts-menu-table-item width="260" style="padding:0">
							<ts-row v-for="i in item.products" style="display: block;">
								<ts-col :span="12" style="text-align:left" class="clearfix">
									<ts-image class="fl" width="80" height="80" :src="i.src"></ts-image>
									<div class="detail fl">
										<span class="detail-item detail-num">{{'#' + i.id}}</span>
										<span class="detail-item">大货交易价：¥ <em>{{i.price + ' / '}}{{i.danwei || '码'}}</em></span>
										<span class="detail-item">数量：{{i.price}}{{i.danwei || '码'}}<em></em></span>
									</div>
								</ts-col>
							</ts-row>
						</ts-menu-table-item>
						<ts-menu-table-item width="114">{{logistics}}</ts-menu-table-item>
						<ts-menu-table-item width="80">{{item.price + '天'}}</ts-menu-table-item>
						<ts-menu-table-item width="140">{{item.price}}</ts-menu-table-item>
						<ts-menu-table-item width="80">{{item.price}}</ts-menu-table-item>
						<ts-menu-table-item width="100">{{item.price}}</ts-menu-table-item>
					</ts-menu-table>
				</ts-menu>
			</div>
		</div>
	</div>
</template>

<script>
	import tsTitle from '../component/order-title.vue';
	import DICT from '../const.js';
	export default {
		data() {
			return {
				classData: DICT.cargo,
				Filter: {
					sort: '111'
				},
				searchForm: {
					keyWord: '',
					startTime: '',
					endTime: ''
				},
				checkbox: {
					hideList: false,
					data: {
						id: 1
					}
				},
				list: [{
					products: [{
						src: '/static/images/tuijian.jpg',
						id: 222,
						name: '111',
						price: '222'
					},
					{
						src: '/static/images/tuijian.jpg',
						id: 222,
						name: '111',
						price: '222'
					}],
					address: 'addaasdf',
					price: '53435',
					author: '庄志勇',
					listNum: '2017080122223333'
				},
				{
					products: [{
						src: '/static/images/tuijian.jpg',
						id: 222,
						name: '111',
						price: '222'
					},
					{
						src: '/static/images/tuijian.jpg',
						id: 222,
						name: '111',
						price: '222'
					}],
					address: 'addaasdf',
					price: '53435'
				}]
			};
		},
		components: {
			tsTitle
		},
		computed: {
			logistics() {
				return '卖家包邮';
			}
		},
		methods: {
			// 订单分类选择
			hanleFilterSort(e) {
				console.log(e);
			},
			// 搜索-提交表单
			submitForm(e) {
				console.log(e);
			},
			// 隐藏关闭订单
			handleHideList() {
				if (this.checkbox.hideList) {
					console.log(this.checkbox.hideList);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.order-cargo {
		&-wrap {
			&--searchBox {
				box-sizing: content-box;
				padding: 10px 0 10px 0px;
				width: 100%;
				color: #333;
				border: 1px solid #e5e5e5;
			}
			&--checkBox {
				margin: 10px 0;
			}
			&--contentBox {
				margin-bottom: 50px;
				.title {
					font-size: 14px;
					color: #666;
					.column {
						margin-left: 60px;
					}
				}
				.detail {
					margin-left: 8px;
					color: #666;
					font-size: 14px;
					&-item {
						display: block;
					}
					&-num {
						margin-bottom: 15px;
					}
				}
			}
		}
	}
</style>
