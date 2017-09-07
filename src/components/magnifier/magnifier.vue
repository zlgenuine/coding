<template>
	<div class="magnifier">
		<div class="magnifier-small" :style="{width: width + 'px', height: height + 'px'}">
			<img :src="imgSrc"/>
			<div class="mark" @mousemove="showMagnifier($event)" @mouseout="hideMagnifier"></div>
			<span class="magnifier-floatBox" :style="{left: floatStyleData.l + 'px', top: floatStyleData.t + 'px'}"></span>
		</div>
		<div class="magnifier-big" :style="{left: width + 1 + 'px'}">
			<img class="magnifier-showBigImg" :src="imgSrc" :style="{left: imgStyleData.l + 'px', top: imgStyleData.t + 'px'}"/>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				floatStyleData: {
					l: '',
					t: ''
				},
				imgStyleData: {
					l: '',
					t: ''
				}
			};
		},
		props: {
			imgSrc: {
				type: String,
				default: '../../../static/images/default/morenhuaxing.png'
			},
			width: {
				type: String,
				default: 422
			},
			height: {
				type: String,
				default: 425
			}
		},
		created() {
		},
		methods: {
			showMagnifier(ev) {
				// 图片为默认花型时  不展示放大镜
				if (this.imgSrc.indexOf('morenhuaxing') > -1) {
					return;
				}
				let oWrap = document.querySelector('.magnifier');
				let oSmall = document.querySelector('.magnifier-small');
				let oBig = document.querySelector('.magnifier-big');
				let oFloat = document.querySelector('.magnifier-floatBox');
				let oImg = document.querySelector('.magnifier-showBigImg');
				if (oImg.width < this.width) {
					return;
				}
				oFloat.style.display = 'block';
				oBig.style.display = 'block';
				// oFlaot
				this.floatStyleData.l = ev.clientX - oWrap.offsetLeft - oSmall.offsetLeft - oFloat.offsetWidth / 2;
				this.floatStyleData.t = ev.clientY - oWrap.offsetTop - oSmall.offsetTop - oFloat.offsetHeight / 2;
				if (this.floatStyleData.l < 0) {
					this.floatStyleData.l = 0;
				} else if (this.floatStyleData.l > (oSmall.offsetWidth - oFloat.offsetWidth)) {
					this.floatStyleData.l = oSmall.offsetWidth - oFloat.offsetWidth;
				};
				if (this.floatStyleData.t < 0) {
					this.floatStyleData.t = 0;
				} else if (this.floatStyleData.t > (oSmall.offsetHeight - oFloat.offsetHeight)) {
					this.floatStyleData.t = oSmall.offsetHeight - oFloat.offsetHeight;
				};
				// img
				let ppX = this.floatStyleData.l / (oWrap.offsetWidth - oFloat.offsetWidth);
				let ppY = this.floatStyleData.t / (oWrap.offsetHeight - oFloat.offsetHeight);
				this.imgStyleData.l = -ppX * (oImg.offsetWidth - oBig.offsetWidth);
				this.imgStyleData.t = -ppY * (oImg.offsetHeight - oBig.offsetHeight);
			},
			hideMagnifier() {
				let oBig = document.querySelector('.magnifier-big');
				let oFloat = document.querySelector('.magnifier-floatBox');
				oFloat.style.display = 'none';
				oBig.style.display = 'none';
			}
		}
	};
</script>

<style lang="scss" scoped>
	.magnifier {
		position: relative;
		&-small {
			position: relative;
			box-sizing: border-box;
			/*width: 220px;
			height: 220px;
			line-height: 220px;*/
			border: 1px solid #d1d1d1;
			overflow: hidden;
			cursor: move;
			img {
				width: 100%;
				height: 100%;
			}
			span {
				position: absolute;
				display: none;
				width: 80px;
				height: 80px;
				background: rgba(0,0,0,.4);
			}
			.mark {
				width: 100%;
				height: 100%;
				position: absolute;
				opacity: 0;
				top: 0;
				left: 0;
				z-index: 2;
			}
		}
		&-big {
			position: absolute;
			/*left: 221px;*/
			top: 0px;
			width: 422px;
			height: 422px;
			display: none;
			background: #fff;
			border: 1px solid #000;
			overflow: hidden;
			z-index: 9999;
			img {
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}
</style>
