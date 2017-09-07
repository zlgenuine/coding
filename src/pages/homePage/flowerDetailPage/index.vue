<template>
  <section>
  	<product-intro></product-intro>
  	<update-product></update-product>
  </section>
</template>
<script>
import ProductIntro from './children/productIntro.vue';
import UpdateProduct from './children/updateProducts.vue';
export default{
   components: {
    ProductIntro,
    UpdateProduct
  }
};
</script>
