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
			<ts-grid-item style="width:200px; position: relative" v-for="(product,index) in History.list" :key="product" @click="handleViewResult($event, product.id, product)">

				<ts-image width="170" height="170" :canView="false" disabledHover :src="(product.user && product.user.id !==  $store.state.user.userInfo.id  && product.isOpen) !== 0 ? product.searchSource : ''">
				</ts-image>

        <!--无法查看花型的遮罩层-->
        <div style="width: 170px; height: 170px; position: absolute; background-color: #000; opacity: 0.8; top: 15px; left: 15px;" v-if="product.user && product.user.id !==  $store.state.user.userInfo.id && product.isOpen === 0" @click="handleViewResult($event, -1, product.isOpen)">
        </div>
        <img src="/static/images/lock.png" v-if="product.user && product.user.id !==  $store.state.user.userInfo.id && product.isOpen === 0" style=" cursor: default; width: 172px;position: absolute; top: 13px; left: 50%; transform: translateX(-50%)" @click="handleViewResult($event, -1, product)"/>
        <!---->

        <template slot="footer" v-if="userInfo.userType===1 && isMemeber">
					<p class="everyLooking-footer--time" style="font-size:12px">{{product.createDate | filterDate('dateTimeNoYear')}}</p>

          <!--花型设置不公开时隐藏掉不是自己花型的详细信息按钮-->
          <template v-if="product.isOpen === 1 || product.user && product.user.id ===  $store.state.user.userInfo.id">
            <ts-popover trigger="hover" :options="{placement: 'top'}">
              <div class="popper introPic-popper-phone">
                <p>查找人：{{product.user?product.user.userName:''}}</p>
                <p>手机：{{product.user?product.user.userMobile:''}}</p>
              </div>
              <p slot="reference" style="font-size:12px">详细信息</p>
            </ts-popover>
          </template>

				</template>

				<!-- <p v-if="userInfo.userType===1" class="everyLooking-title">
              <i class="icon-dianhua" v-if="product.user"></i>&nbsp;{{product.user?product.user.userMobile:''}}
            </p> -->
				<!-- <template slot="footer" class="everyLooking-footer"> -->

        <!--会员显示或者非会员但是是主营验证厂家显示-->
				<div v-if="userInfo.userType===1 && (isMemeber || userInfo.isMain)">
            <div class="everyLooking-product-item">
              <div class="everyLooking-product-item--div">

                <!--花型设置不公开并不是自己的花型时只显示花型类型，隐藏掉用户信息-->
                <template v-if="product.isOpen === 1 || product.user && product.user.id ===  $store.state.user.userInfo.id">
                    <span class="everyLooking-companyName" :title="product.user?product.user.companyName:''">
                        {{product.user?product.user.companyName:''}}
                      </span>
                  <span>-{{product.category | filterDict(dicTree.PRODUCT_TYPE,'name')}}</span>

                  <span><i class="icon-dianhua" ></i>&nbsp;{{product.user?product.user.userMobile:''}}</span>
                </template>
                <template v-else>
                  <span style="position: relative; left: -44px; top: -10px;">{{product.category | filterDict(dicTree.PRODUCT_TYPE,'name')}}</span>
                </template>

              </div>

              <!--花型设置不公开的隐藏查找结果按钮-->
              <div v-if="product.user && product.user.id !==  $store.state.user.userInfo.id && product.isOpen === 0" style="width: 50px;height: 50px; display: inline-block; cursor: default" ></div>
              <button v-else class="everyLooking-product-item--button" @click="handleViewResult($event, product.id, product)">查找<br>结果</button>

            </div>
				</div>

        <!--非会员与贸易商显示-->
				<template slot="footer" v-if="userInfo.userType===2 || (userInfo.userType===1 && !isMemeber && !userInfo.isMain)" class="everyLooking-footer">
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
    goto
  } from '@/common/js/utils.js';
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
			handleViewResult(e, id, product) {
			  if (product.user && product.user.id !==  this.$store.state.user.userInfo.id && product.isOpen === 0) {
          // e.stopPropagation();
          // this.$messagebox.alert('查找花型已设置为保密状态，无法查看');
			    return;
        }

        // 如果用户时贸易商当并且是非会员时，弹出；或者当用户是厂家并且是非会员与非主营认证厂家就弹出
				if (!this.isMemeber && (this.userInfo.userType === 2 || this.userInfo.userType === 1 && !this.userInfo.isMain)) {
					// this.$messagebox.alert('成为会员，请联系热线电话：4008013357', '你无此权限');
          this.$messagebox.confirm('成为会员，享受更优质服务','您无此权限', {
            confirmButtonText: '开通会员',
            cancelButtonText: '稍后再说',
          }).then(action => {
            goto(`/renew?companyId=${this.userInfo.companyId}`);
          }).catch(e => {
          });

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
          height: 56px;
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
