<template>
	<div class="order-title">
		<h2>{{title}}</h2>
	</div>
</template>

<script>
	export default {
		props: {
			title: ''
		}
	};
</script>

<style lang="scss" scoped>
	.order-title {
		margin-bottom: 30px;
		border-bottom: 1px solid #eaeaea;
		h2 {
			display: inline-block;
			padding: 0 15px;
			margin-top: 50px;
			margin-bottom: 15px;
			width: 200px;
			font-size: 24px;
			font-weight: 400;
			color: #333;
		}
	}
</style>
