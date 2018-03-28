<template>
    <div>
        <v-header>
            <search></search>
        </v-header>
        <v-nav></v-nav>
        <div class="supplyOrBuy-wrapper">
            <div class="supplyOrBuy-tabber">
                <ts-navbar v-model="selected">
                    <ts-tab-item id="1">求购信息</ts-tab-item>
                    <ts-tab-item id="2">供应信息</ts-tab-item>
                    <ts-tab-item id="3" v-if="userInfo.userType===2">我的求购</ts-tab-item>
                    <ts-tab-item id="4" v-if="userInfo.userType===1">我的供应</ts-tab-item>
                </ts-navbar>
                <span class="supplyOrBuy-tabber--button">
        <router-link to="/releaseSupplyPage">
          <ts-button type="primary" v-if="userInfo.userType===1">发布供应</ts-button>
        </router-link>
        <router-link to="/releasePurchasePage">
          <ts-button type="primary" v-if="userInfo.userType===2">发布求购</ts-button>
        </router-link>
      </span>
            </div>
            <ts-tab-container v-model="selected">
                <ts-tab-container-item id="1">
                    <purchase-list></purchase-list>
                </ts-tab-container-item>
                <ts-tab-container-item id="2">
                    <supply-list></supply-list>
                </ts-tab-container-item>
                <ts-tab-container-item id="3" v-if="userInfo.userType===2">
                    <buy-component :titleShow="false"></buy-component>
                </ts-tab-container-item>
                <ts-tab-container-item id="4">
                    <supply-component :titleShow="false"></supply-component>
                </ts-tab-container-item>
            </ts-tab-container>
        </div>
    </div>
</template>

<script>
import {
  header,
  nav,
  search
} from '@/components';
import {
  mapGetters
} from 'vuex';
import SupplyComponent from '../../shopManager/children/supply/supplyIndex.vue';
import buyComponent from '../../personalCenterPage/children/personal-buy.vue';
import purchaseList from '../../homePage/purchaseListPage/children/purchaseList';
import supplyList from '../../homePage/supplyListPage/children/supplyList.vue';
export default {
  components: {
    SupplyComponent,
    purchaseList,
    buyComponent,
    supplyList,
    'vHeader': header,
    'vNav': nav,
    search
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() {
    return {
      selected: '1'
    };
  },
  created() {
    if (this.$route.query.type) {
      this.selected = this.$route.query.type.toString();
    }
  }
};
</script>

<style lang="css" scoped>
@component-namespace supplyOrBuy{
  @component wrapper{
    margin-top: 10px;
    max-width: 1200px;
    margin: 1em auto;
  }
  @component tabber{
    position: relative;
    @modifier button{
      position: absolute 50% 10px * *;
      transform: translateY(-50%);
    }
  }
}
</style>
