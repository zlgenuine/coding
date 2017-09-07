<template>
	<div class="detail-wrapper">
		<div class="detail-header">
			<div class="detail-header--title">
			 	<span>{{title}}</span>
			</div>
			<div class="detail-header--menu">
				<slot name="menu"></slot>
			</div>
		</div>
		<div class="detail-content">
			<slot></slot>
		</div>
	</div>
</template>
<script>
	export default{
		props: ['title']
	};
</script>
<style scoped>
:root{
	--title-primary-color: #9D4ec6;
	--border-primary-color: #E5E5E5;
};
	@component-namespace detail{
		@component wrapper{
			background: #fff;
			border: 1px solid var(--border-primary-color);
		}
		@component content{
			padding: 20px;
		}
		@component header{
			background: #eaeaea;
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10px;
			@modifier title{
				background: #fff;
				min-width: 120px;
				text-align: center;
				line-height: 35px;
				color: var(--title-primary-color)
			} 
		}
	}
</style>
