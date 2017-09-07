<template lang="html">
	<div class="updateProduct-wrapper">
		<div class="updateProduct-list-block">
			<p>最新上架</p>
			<p>
				<router-link :to="{path:`/shop/${productDetail.companyId}/allProducts`}">
				更多新花
				<i class="icon-gengduo"></i>
				</router-link>
			</p>
		</div>
		<div class="updateProduct-container">
			<ts-grid :data="Update.list">
				 <ts-grid-item v-for="(product,index) in Update.list" :key="product" @click="handleViewProduct(product.id)">
					 <ts-image
						width="170"
						height="170"
						:canView="false"
						disabledHover
						:src="product.defaultPicUrl+'?x-oss-process=image/resize,m_fill,h_170,w_170'+watermask">
						</ts-image>
						<p class="updateProduct-item">{{product.productNo}}</p>
						<template slot="footer" class="updateProduct-footer">
							<span v-if="product.totalPrice>0 && !!product.totalPrice">
                      		¥{{product.totalPrice/100}}/{{product.unit | filterDict(dicTree.PRODUCT_UNIT,'name')}}
                      		</span>
                      		<span v-else>价格面议</span>
							<p class="updateProduct-footer--time">{{product.publishDate | customTime}}</p>
						</template>
					</ts-grid-item>
			</ts-grid>
		</div>
	</div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import {
  getVistitCompanyProductsList
} from '@/common/api/api';
export default {
  data() {
    return {
      Update: {}
    };
  },
  computed: {
    ...mapGetters(['dicTree', 'productDetail', 'watermask'])
  },
  watch: {
    productDetail: {
      async handler(val) {
        this.Update = (await getVistitCompanyProductsList({
          companyId: val.companyId,
          pageNo: 1,
          pageSize: 6
        })).data.data;
      },
      deep: true
    }
  },
  methods: {
    handleViewProduct(id) {
			this.goto(`/product/${id}` + '?route=shop');
    }
  }
};
</script>

<style lang="css" scoped>
@component-namespace updateProduct {
	@component list-block{
			background: #F8F8F8;
			border: 1px solid #E5E5E5;
			line-height: 40px;
			margin-top:0;
			display: flex;
			justify-content: space-between;
			padding:0 20px;
			color: #333;
			p:last-child{
				color:#999;
		}
	}
	@component item{
		line-height: 40px;
		text-align: left;
		@utils-ellipsis;
	}
}
</style>
