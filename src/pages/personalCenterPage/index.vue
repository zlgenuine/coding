<template>
	<div class="personal">
		<v-header>
			<search></search>
		</v-header>
		<v-nav/>
		<!--personal-conent-->
		<div class="personal-container  clearfix">
			<div class="personal-nav">
				<h1>个人中心</h1>
				<ul>
					<li v-for="(navItem,index) in navItems" :class="{ 'personal-nav-b':navItem.isBorder }" v-if="!navItem.isShow">
						<router-link :to="navItem.path">
							<span>
							{{ navItem.context }}
							</span>
						</router-link>
					</li>
				</ul>
			</div>
			<div class="personal-item">
				<!--<div class="title clearfix">
					<h2>{{ title }}</h2>
					<router-link class="fr" to="releaseBuy" v-if="userInfo.userType === 2">发布求购</router-link>
					<router-link class="fr" to="releaseSupply" v-if="userInfo.userType === 1">发布供应</router-link>
				</div>-->
				<div class="personal-item-box">
					<router-view></router-view>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import {
		header,
		nav,
		search
	} from '@/components';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				title: '账户信息',
				navItems: [{
						context: '账户信息',
						path: 'index'
					},
					{
						context: '变更手机号',
						path: 'mobile'
					},
					{
						context: '修改密码',
						path: 'password'
					},
					{
						context: '短信设置',
						path: 'message'
					},
					{
						context: '我的求购',
						path: 'buy',
						isShow: false,
						isBorder: 'ok'
					},
					{
						context: '我的接单',
						path: 'list',
						isShow: false,
						isBorder: 'ok'
					},
					{
						context: '花型收藏',
						path: 'flower',
						isBorder: 'ok'
					},
					{
						context: '商家收藏',
						path: 'business'
					},
					{
						context: '供应收藏',
						path: 'supply',
						isShow: false
					}
				]
			};
		},
		components: {
			'vHeader': header,
			'vNav': nav,
			search
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		created() {
			if (this.userInfo.userType === 1) {
				this.navItems[4].isShow = true;
				this.navItems[8].isShow = true;
			} else {
				this.navItems[5].isShow = true;
			}
		}
	};
</script>
<style lang="css">
	@import '../../common/css/personal.css';
</style>
<style lang="scss" scoped="scoped">
	.personal {}
	
	.personal-container {
		width: 1200px;
		margin: 50px auto;
	}
	
	.personal-nav {
		float: left;
		width: 256px;
		min-height: 728px;
		background: #f8f8f8;
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
				&.active {
					/*position: relative;
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
                }*/
				}
				&:hover {
					color: #5296fd;
				}
			}
		}
		.personal-nav-b {
			/*&::after {
            content: '';
            display: block;
            margin: 28px auto;
            height: 1px;
            width: 112px;
            background: #eaeaea;
        }*/
			&::before {
				content: '';
				display: block;
				margin: 28px auto;
				height: 1px;
				width: 112px;
				background: #eaeaea;
			}
		}
	}
	
	.personal-item {
		float: left;
		width: 944px;
		min-height: 728px;
		background: #fff;
		/*.title {
			margin-bottom: 30px;
			border-bottom: 1px solid #eaeaea;
			h2 {
				display: inline-block;
				padding: 0 15px;
				margin-top: 50px;
				margin-bottom: 15px;
				width: 200px;
				font-size: 24px;
				font-zaweight: 400;
				color: #333;
			}
			a {
				margin: 50px 50px 0 0;
				padding: 5px 16px;
				color: #fff;
				border: 1px solid #4C93FD;
				background: rgba(76, 147, 253, .9);
				&:hover {
					background: rgba(76, 147, 253, 1);
				}
			}
		}*/
	}
</style>
