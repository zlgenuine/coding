<template lang="html">
  <div>
    <ts-grid :data="Exclusive.list" v-show="!isExclusive">
      <ts-grid-item style="width:240px" v-for="product in Exclusive.list" :key="product">
        <ts-image
         width="170"
         height="170"
         :canView="false"
         disabledHover
         @click="handleViewProduct(product)"
         :src="product.defaultPicUrl">
         </ts-image>
         <p class="exclusive-product--number">{{product.productNo}}</p>
         <div class="exclusive-color-wrapper">
            <div v-if="product.productColors.length<=5">
              <span v-for="color in colorPicList(product.productColors)">
                <ts-image :src="cards.picUrl" v-for="(cards,index) in color" height="30" width="30" :canView="false" disabledHover class="exclusive-color--image" @click="showColorDetail(cards,index, product)"></ts-image>
              </span>
            </div>
            <ts-carousel class="exclusive-color-wrapper carousel" dots="never" arrow="always" arrowType="square" easing='linear' v-else>
              <ts-carousel-item v-for="color in colorPicList(product.productColors)">
                <ts-image :src="cards.picUrl" v-for="(cards,index) in color" height="30" width="30" :canView="false" disabledHover class="exclusive-color--image" @click="showColorDetail(cards,index, product)"></ts-image>
              </ts-carousel-item>
            </ts-carousel>
          </div>
         <template slot="footer">
           <span v-if="product.price>0&&!!product.price">¥{{product.price/100}}/{{product.priceUnit | filterDict(DICT.PriceUnits) }}</span>
           <span v-else>价格面议</span>
         </template>
       </ts-grid-item>
    </ts-grid>
    <ts-pagination type="page" :total="Exclusive.totalNum"  :current="Exclusive.pageNO" :pageSize="Exclusive.pageSize" @change="handleChangePage" class="exclusive-pagination" v-show="!isExclusive"></ts-pagination>
    <div v-show="isExclusive">
      <div class="exclusive-tip">
        <p class="exclusive-tip-content">
          <span>独家花型需要商家授权才能访问，请向商家索取访问密码！</span>
        </p>
      </div>
      <ts-form :model="Pwd" :rules="rules" ref="Pwd" label-width="130px">
        <ts-form-item prop="password" label="请输入访问密码">
          <ts-input v-model="Pwd.password" placeholder="请输入密码" @keyup.enter.native="handleSetPwd('Pwd')" :maxlength="6" width="30%"></ts-input>
        </ts-form-item>
      </ts-form>
      <ts-button type="primary" @click="handleSetPwd('Pwd')">访问</ts-button>
    </div>
  </div>
</template>

<script>
import {
  getCompanyBindingProductList,
  getVisitSystemProductCategoryList
} from '@/common/api/api';
import DICT from '@/common/dict/index';
import {
  mapGetters
} from 'vuex';
export default {
  data() {
    return {
      DICT: {
        PriceUnits: DICT.PriceUnits
      },
      Exclusive: {},
      isExclusive: false,
      Pwd: {
        password: ''
      },
      Params: {
        classId: '',
        companyId: '',
        pageNo: 1,
        pageSize: 10,
        password: null
      },
      rules: {
        password: [{
          required: true,
          message: '请输入6位数字的访问密码',
          min: 6,
          max: 6,
          trigger: 'blur'
        }]
      }
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'productDetail']),
    isShop() {
      return !~this.$route.path.indexOf('/detail');
    }
  },
  async created() {
    this.Params.companyId = this.isShop && !this.productDetail.companyId ? this.$route.params.id : this.productDetail.companyId;
    let SystemCategories = (await getVisitSystemProductCategoryList({
      companyId: this.Params.companyId
    })).data.data;
    let exclusiveArr = SystemCategories.filter(item => item.className === '独家花型');
    if (exclusiveArr.length) {
      this.Params.classId = exclusiveArr[0].id;
    }
    // 如果是自己的店铺
    if (this.userInfo.companyId && (this.userInfo.companyId.toString() === this.Params.companyId)) {
      this.Exclusive = (await getCompanyBindingProductList(this.Params)).data.data;
    } else {
      this.isExclusive = true;
    }
  },
  methods: {
    async handleChangePage(pageNo) {
      this.Params.pageNo = pageNo;
      this.Exclusive = (await getCompanyBindingProductList(this.Params)).data.data;
    },
    // 店铺
    handleViewProduct(product) {
      this.goto(`/product/${product.id}?route=shop&companyId=${this.$route.params.id}`);
    },
    showColorDetail(card, index, product) {
      product.defaultPicUrl = card.picUrl;
    },
    // ========
    // 色卡
    // ========
    // 将色卡数组拆分成5份每份5个
    colorPicList(list, num = 5) {
      let result = [];
      for (let i = 0, len = list.length; i < len; i += num) {
        result.push(list.slice(i, i + num));
      };
      return result;
    },
    handleSetPwd(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.Params = Object.assign({}, this.Params, {
            password: this.Pwd.password
          });
          let res = await getCompanyBindingProductList(this.Params);
          if (!res.data.code) {
            this.$nextTick(() => {
              this.Exclusive = res.data.data;
            });
            this.isExclusive = false;
          }
        }
      });
    }
  }
};
</script>

<style lang="css" scoped>
@component-namespace exclusive{
  @component pagination{
    display: table;
    margin: 10px auto;
  }
  @component color{
    @descendent wrapper{
      max-width: 200px;
      margin-top: 10px; 
      &.carousel{
        text-align: left;
      }
    }
    @modifier image{
      margin-left:3px; 
    }
  }
  @component tip{
    background: #FFF7E3;
    padding: 10px;
    border: 1px solid #f2d794;
    border-radius: 4px;
    margin: 10px 0;
  }
}
</style>
