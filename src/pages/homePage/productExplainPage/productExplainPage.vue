<template>
	<div class="product-explain">
		<v-header>
			<search></search>
		</v-header>
		<v-nav></v-nav>
		<div class="product-explain-wrapper">
			<img :src='imgData' />
		</div>
	</div>
</template>

<script>
	import {
		header,
		nav,
		search
	} from '@/components';
	export default {
		data() {
			return {
				imgUrl: {
					'1': '/static/images/product/explain1.jpg',
					'2': '/static/images/product/explain2.jpg'
				},
				imgData: ''
			};
		},
		components: {
			vHeader: header,
			vNav: nav,
			search
		},
		created() {
			let param = location.href.split('?').pop().split('=').pop();
			this.imgData = this.imgUrl[param];
		}
	};
</script>

<style lang="scss" scoped>
	.product-explain-wrapper {
		-webkit-box-flex: 1;
		flex: 1;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		overflow: hidden;
	}
</style>
