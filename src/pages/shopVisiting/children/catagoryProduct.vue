<template lang="html">
    <div class="">
      <ts-title-block>{{$route.query.name}}</ts-title-block>
      <ts-grid>
        <ts-grid-item v-for="(product,e) in ProductList.list" :key="product" @click="handleViewProduct(product)">
          <ts-image
           width="170"
           height="170"
           :canView="false"
           disabledHover
           :src="product.defaultPicUrl">
           </ts-image>
           <p class="catagoryProduct-product--number">{{product.productNo}}</p>
           <template slot="footer">
             <span v-if="product.price>0&&!!product.price">¥{{product.price/100}}/{{product.priceUnit | filterDict(DICT.PriceUnits) }}</span>
             <span v-else>价格面议</span>
           </template>
         </ts-grid-item>
      </ts-grid>
    </div>
</template>

<script>
import {
  getCompanyBindingProductList
} from '@/common/api/api';
import {mapGetters} from 'vuex';
import DICT from '@/common/dict';
export default {
  data() {
    return {
      Params: {
        pageNO: 1,
        pageSize: 10,
        companyId: '',
        classId: ''
      },
      // 数据字典
      DICT: {
        PriceUnits: DICT.PriceUnits
      },
      ProductList: {}
    };
  },
  methods: {
    // 店铺
    handleViewProduct(product) {
      this.goto(`/product/${product.id}?route=shop&companyId=${this.$route.params.id}`);
    }
  },
  computed: {
    ...mapGetters(['dicTree', 'productDetail']),
    isShop() {
      return !~this.$route.path.indexOf('/detail');
    }
  },
  async created() {
   // 绑定好公司ID
    this.Params.companyId = this.isShop && !this.productDetail.companyId ? this.$route.params.id : this.productDetail.companyId;
    this.Params.classId = this.$route.query.catagoryId;
    this.ProductList = (await getCompanyBindingProductList(this.Params)).data.data;
  }
};
</script>
