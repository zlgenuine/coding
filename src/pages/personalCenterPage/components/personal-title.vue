<template>
	<div class="personal-title">
		<h2>{{ title }}</h2>
		<router-link class="fr" to="releaseBuy" v-if="userType === 2">发布求购</router-link>
		<router-link class="fr" to="releaseSupply" v-if="userType === 1">发布供应</router-link>
	</div>
</template>

<script>
	export default {
		props: {
			title: '',
			userType: ''
		}
	};
</script>

<style lang="scss" scoped>
	.personal-title {
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
	}
</style>
