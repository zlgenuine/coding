<template>
	<!-- 2.关闭订单  -->
	<ts-dialog width="20%" v-model="dialog.show" title="关闭订单" @confirm="handleClose" @cancel="dialog.show=false">
	  <div class="dialog-confirmOrder--title">
	   <ts-select v-model="closeOrder" :options="DICT.CloseOrderReasons" data-key-name="label" data-val-name="label">
	   </ts-select>
	  </div>
	</ts-dialog>	
</template>
<script>
import DICT from '@/common/dict/index';
export default {
	data() {
		return {
			closeOrder: '缺货',
			DICT: {
				CloseOrderReasons: DICT.CloseOrderReasons
			}
		};
	},
	methods: {
		handleClose() {
			try {
				this.$emit('cancelOrder', this.closeOrder);
			} catch (e) {
				console.error('关闭订单失败');
			}
		}
	},
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
/* 	@component-namespace dialog {
		@component confirmOrder {

		}
	} */
</style>
