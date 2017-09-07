<template>
<!-- 1.2 确认订单  -->
<ts-dialog width="20%" v-model="dialog.show" title="确认订单">
  <p class="dialog-confirmOrder--content">
    该订单买家应一次性支付全款金额为{{data.orderMoney}}元，买家要求备货期为{{data.surplusStockPeriodTime}}天，是否确定
  </p>
</ts-dialog>
</template>
<script>
	export default {
		props: {
			data: {
				type: Object
			},
			dialog: {
				type: Object,
				default: function(argument) {
					return {
						show: false
					};
				}
			}
		}
	};
</script>
<style scoped>
/* @component-namespace dialog{
	@component confirmOrder {
		@modifier content {
			
		}
	}
} */
</style>

