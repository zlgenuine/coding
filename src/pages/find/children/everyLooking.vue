<template lang="html">
	<div class="everyLooking">
		<ts-title-block>大家在找</ts-title-block>
		<div>
			<ts-form :model="lookingForm" :rules="rules" inline ref="lookingForm" label-width="120px" label-position="left" class="add-form">
				<ts-form-item label="开始时间" prop="startDate">
					<ts-date-picker placeholder="选择开始日期" v-model="lookingForm.startDate" backward></ts-date-picker>
				</ts-form-item>
				<ts-form-item label="结束时间" prop="endDate">
					<ts-date-picker placeholder="选择结束日期" v-model="lookingForm.endDate" backward></ts-date-picker>
				</ts-form-item>
				<ts-button type="plain" @click="handleLooking('lookingForm')">查找</ts-button>
			</ts-form>
		</div>
		<ts-grid :data="History.list">
			<ts-grid-item style="width:200px" v-for="(product,index) in History.list" :key="product" @click="handleViewResult(product.id)">
				<ts-image width="170" height="170" :canView="false" disabledHover :src="product.searchSource">
				</ts-image>
				<template slot="footer" v-if="userInfo.userType===1">
					<p class="everyLooking-footer--time" style="font-size:12px">{{product.createDate | filterDate('dateTimeNoYear')}}</p>
					<ts-popover trigger="hover" :options="{placement: 'top'}">
						<div class="popper introPic-popper-phone">
							<p>查找人：{{product.user?product.user.userName:''}}</p>
							<p>手机：{{product.user?product.user.userMobile:''}}</p>
						</div>
						<p slot="reference" style="font-size:12px">详细信息</p>
					</ts-popover>
				</template>
				<!-- <p v-if="userInfo.userType===1" class="everyLooking-title">
              <i class="icon-dianhua" v-if="product.user"></i>&nbsp;{{product.user?product.user.userMobile:''}}
            </p> -->
				<!-- <template slot="footer" class="everyLooking-footer"> -->
				<div v-if="userInfo.userType===1">
					<div class="everyLooking-product-item">
						<div class="everyLooking-product-item--div">
							<span class="everyLooking-companyName" :title="product.user?product.user.companyName:''">
                        {{product.user?product.user.companyName:''}}
                      </span>
							<span>-{{product.category | filterDict(dicTree.PRODUCT_TYPE,'name')}}</span>
							<i class="icon-dianhua"></i>&nbsp;{{product.user?product.user.userMobile:''}}
						</div>
						<button class="everyLooking-product-item--button">查找<br>结果</button>
					</div>
				</div>
				<template slot="footer" v-if="userInfo.userType===2" class="everyLooking-footer">
					<p>{{product.category | filterDict(dicTree.PRODUCT_TYPE,'name')}}</p>
					<p class="everyLooking-footer--time" style="font-size:12px">{{product.createDate | filterDate('dateTimeNoYear')}}</p>
				</template>
			</ts-grid-item>
		</ts-grid>
		<ts-pagination type="page" :total="History.totalNum" :current="History.pageNO" :pageSize="History.pageSize" class="everyLooking-pagination" @change="handleChangePage"></ts-pagination>
	</div>
</template>

<script>
	import {
		searchHistory
	} from '@/common/api/api';
	import {
		mapGetters
	} from 'vuex';
	let ValiEndDate = async(rule, value, callback) => {
		if (!value) {
			return callback(new Error('请选择结束日期'));
		}
		var oDate1 = new Date(startDate);
		var oDate2 = new Date(value);
		if (oDate1.getTime() > oDate2.getTime()) {
			return callback(new Error('起始时间必须小于结束时间'));
		}
		callback();
	};
	let startDate = '';
	export default {
		data() {
			return {
				History: {},
				Params: {
					pageNo: 1,
					endDate: '',
					startDate: '',
					pageSize: 12
				},
				lookingForm: {
					endDate: '',
					startDate: ''
				},
				rules: {
					startDate: [{
						required: true,
						message: '请选择开始时间',
						trigger: 'change'
					}],
					endDate: [{
						required: true,
						validator: ValiEndDate,
						trigger: 'change'
					}]
				},
				BurstHotSearch: {}
			};
		},
		computed: {
			...mapGetters(['dicTree', 'userInfo', 'isMemeber'])
		},
		watch: {
			lookingForm: {
				handler(val) {
					this.Params.startDate = (new Date(val.startDate)).getTime();
					this.Params.endDate = (new Date(val.endDate)).getTime();
				},
				deep: true
			},
			async 'Params.pageSize' (val) {
				this.History = (await searchHistory(this.Params)).data.data;
			},
			async 'Params.pageNo' (val) {
				this.History = (await searchHistory(this.Params)).data.data;
			},
			'Params.startDate' (val) {
				startDate = this.Params.startDate;
			}
		},
		methods: {
			handleLooking(formName) {
				this.$refs[formName].validate(async(valid) => {
					if (valid) {
						this.Params.pageNo = 1;
						this.History = (await searchHistory(this.Params)).data.data;
					} else {
						return false;
					}
				});
			},
			// 页数改变
			handleChangePage(number) {
				this.Params.pageNo = number;
			},
			// 查看结果
			handleViewResult(id) {
				if (!this.isMemeber) {
					this.$messagebox.alert('成为会员，请联系热线电话：4008013357', '你无此权限');
					return;
				}
				this.$router.push({
					path: `/catagory/${id}`,
					query: {
						pageData: this.Params
					}
				});
			}
		},
		async mounted() {
			if (this.$route.query.pageData) {
				this.Params = this.$route.query.pageData;
			}
			this.History = (await searchHistory(this.Params)).data.data;
		}
	};
</script>
<style scoped>
	@component-namespace everyLooking {
		@component pagination {
			margin: 7px auto;
			display: table;
		}
		@component product {
			@descendent item {
				display: table;
				table-layout: fixed;
				width: 100%;
				/*align-items: center;*/
				margin-top: 5px;
				/*justify-content: space-between;*/
				@modifier div {
					display: table-cell;
					vertical-align: middle;
					width: 70%;
				}
				@modifier button {
					display: table-cell;
					vertical-align: middle;
					background: transparent;
					border: 1px solid #eaeaea;
					padding: 2px 9px;
					margin-left: 2px;
					text-align: center;
					transition: .8s;
					size: 50px 50px;
					white-space: nowrap;
					&:hover {
						border: 1px solid #4c93fd;
					}
				}
			}
		}
		@component companyName {
			@utils-ellipsis;
			max-width: 50%;
			display: inline-block;
			vertical-align: middle;
		}
		@component title {
			margin-top: 12px;
			color: #999;
			font-size: 13px;
		}
	}
</style>
<style>
	.everyLooking {
		.ts-form-item--label {
			&:before {
				content: ""!important;
			}
		}
	}
</style>
