<template>
	<div class="introPic-wrapper">
		<div class="introPic-wrapper-content">
			<div class="introPic-wrapper-content--info">
				<div style="padding: 130px 0 0 130px;">
					<h3>{{companyInfo.companyName}}<span @click="handleCollectStore" v-if="getCanCollect"><i :class="getIsCollect?'icon-yishoucang':'icon-shoucang'"></i> {{getIsCollect?'已收藏店铺':'收藏店铺'}}</span></h3>
					<h4>公司主营</h4>
					<p>{{companyBusiness}}</p>
					<h4>联系电话</h4>
					<p>{{companyInfo.phone}}</p>
					<h4>公司地址</h4>
					<p>{{companyInfo.address}}</p>
				</div>
				<div class="introPic-wrapper-content--code">
					<ts-image class="introPic-company-header--erweima" :canView="false" disabledHover width="100" height="100" :src="companyInfo.qrCode"></ts-image>
					<em>扫码手机下单</em>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		favoriteBus,
		getCompanyQRcode
	} from '@/common/api/api';
	export default {
		data() {
			return {
				// 二维码
				Qrcode: '',
				companyPro: {
					src: '',
					error: '/static/images/default.jpg',
					loading: ''
				},
				companyBusiness: ''
			};
		},
		async created() {
			// this.Qrcode = 'data:image/png;base64,' + (await getCompanyQRcode({
			// 	companyId: this.$route.params.id
			// })).data.data;
		},
		methods: {
			// 收藏店铺
			async handleCollectStore() {
				let res = (await favoriteBus({
					businessId: this.$route.params.id,
					businessType: 2
				})).data;
				this.companyInfo.favoriteSatus = res.message.indexOf('收藏') >= 0 ? 1 : 0;
			}
		},
		watch: {
			companyInfo: {
				async handler(val) {
					if (val.companyExtendBO) {
						this.companyBusiness = val.companyExtendBO.companyBusiness;
					}
					if (!val.qrCode) {
						val.qrCode = 'data:image/png;base64,' + (await getCompanyQRcode({
							companyId: this.$route.params.id
						})).data.data;
					}
					this.companyPro.src = val.companyBanner;
					if (val.address.indexOf('/.') >= 0) {
						val.address = val.address.split('/.')[0];
					}
				},
				deep: true
			}
		},
		computed: {
			...mapGetters(['companyInfo', 'userInfo']),
			// 是否档口
			getIsStore() {
				return this.companyInfo.companyType === 2;
			},
			// 收藏状态 0未收藏 1已收藏
			getIsCollect() {
				return this.companyInfo.favoriteSatus === 1;
			},
			getCanCollect() {
				return this.userInfo.companyId && (this.userInfo.companyId.toString() !== this.$route.params.id);
			}
		}
	};
</script>

<style lang="css" scoped>
	@component-namespace introPic {
		@component wrapper {
			position: relative;
			width: 100%;
			height: 580px;
			background: url(/static/images/shop/shopbeijing.jpg);
			background-size: 100% 100%;
			@descendent content {
				position: absolute;
				top: 60px;
				left: calc(50% - 400px);
				@modifier info {
					width: 800px;
					min-height: 480px;
					background: url(/static/images/shop/shopbeijing-box.png) no-repeat;
					color: #333;
					h3 {
						font-size: 18px;
						span {
							padding-left: 30px;
							color: #333;
							font-size: 16px;
							font-weight: 400;
							cursor: pointer;
						}
					}
					h4 {
						margin-top: 10px;
						font-size: 14px;
						font-weight: 600;
					}
					p {
						@utils-ellipsis 3;
						max-width: 300px;
						font-size: 14px;
						color: #666;
					}
				}
				@modifier code {
					position: absolute;
					top: 130px;
					right: 130px;
					em {
						display: block;
						margin-top: 10px;
						color: #333333;
						font-size: 16px;
						font-weight: 600;
						text-align: center;
					}
				}
			}
		}
	}
	
	.icon-shoucang:before {
		color: grey;
	}
</style>
