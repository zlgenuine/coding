<template>
	<div class="total">
		<div class="total-title">
			<div class="total-title-small"></div>
			<div class="total-title-big"></div>
		</div>
		<div class="total-head">
			<span class="title">
				<span v-if="type === 1"><i class="icon-sousuo"></i>大家在找</span>
				<span v-else-if="type === 2"><i class="icon-baokuanresou"></i>新增热搜</span>
				<span v-else-if="type === 3"><i class="icon-ruzhu"></i>最新入驻</span>
				<span v-else-if="type === 4"><i class="icon-gongying"></i>供应求购</span>
			</span>
			<span class="fr more" @click="clickMth">查看更多<i class="icon-gengduo"></i></span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			type: {
				type: Number
			}
		},
		methods: {
			clickMth() {
				this.$emit('clickMth');
			}
		}
	};
</script>

<style lang="scss" scoped>
	.total {
		&-title {
			position: relative;
			width: 100%;
			&-small {
				position: absolute;
				left: 3px;
				bottom: 0;
				width: 32px;
				height: 8px;
				background: #2871DD;
				&::after {
					position: absolute;
					right: 0px;
					top: -5px;
					content: '';
					display: block;
					width: 0;
					height: 0;
					border-bottom: 13px solid #4C93FD;
					border-left: 13px solid transparent;
				}
			}
			&-big {
				margin-left: 35px;
				width: calc(100% -38px);
				height: 13px;
				background: #4C93FD;
			}
		}
		&-head {
			box-sizing: border-box;
			padding: 0 20px;
			width: 100%;
			height: 42px;
			background: #fff;
			line-height: 42px;
			.title {
				font-size: 16px;
				font-weight: 600;
				color: #333;
				i {
					padding-right: 5px;
					position: relative;
					top: 2px;
					&::before {
						font-size: 18px;
						color: #4C93FD;
					}
				}
			}
			.more {
				color: #666666;
				font-size: 12px;
				i {
					&::before {
						padding-left: 5px;
					}
				}
				&:hover {
					color: #4C93FD;
					cursor: pointer;
				}
			}
			&::after {
				position: relative;
				top: -1px;
				content: '';
				display: block;
				width: calc(100%-40px);
				height: 1px;
				background: #f2f2f2;
			}
		}
	}
</style>
