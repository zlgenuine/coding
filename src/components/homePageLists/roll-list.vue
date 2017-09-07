<template>
<div class="roll clearfix">
  <div class="roll-item">
    <total-title :type="1" @clickMth="goMore(1)"></total-title>
    <div class="roll-item-content">
      <div style="overflow: hidden;">
        <div class="img-box animated-left">
          <ts-image width="120" :canView="false" disabledHover height="120" v-for="item in items_find" :src="item.searchSource" @click="goFind(item.id)"></ts-image>
        </div>
      </div>
    </div>
  </div>
  <div class="roll-item">
    <total-title :type="2" @clickMth="goMore(2)"></total-title>
    <div class="roll-item-content">
      <div style="overflow: hidden;">
        <div class="animated-left" @click="goMore(2)">
          <div class="img-box1" style="margin-bottom: 10px;">
            <ts-image width="120" :canView="false" disabledHover height="120" v-for="item in items_new" :src="item.productList[0].defaultPicUrl"></ts-image>
          </div>
          <div class="img-box1">
            <ts-image width="120" :canView="false" disabledHover height="120" v-for="item in items_hot" :src="item.pics[0]"></ts-image>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="roll-item">
    <total-title :type="3" @clickMth="goMore(3)"></total-title>
    <div class="roll-item-content">
      <div style="overflow: hidden; height: 260px;">
        <div class="p-box animated-top">
          <p v-for="item in items_enter" @click="goEnter(item.id)">
            <span>{{item.companyName}}</span>
            <span class="fr time">{{item.createDate | filterDate1}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="roll-item">
    <total-title :type="4" @clickMth="goMore(4)"></total-title>
    <div class="roll-item-content">
      <div style="overflow: hidden; height: 260px;">
        <div class="p-box animated-top">
          <p v-for="item in items_buySupply" @click="goSupplyOrBuy(item)">
            <span class="info fl" :title="item.description">{{item.description}}</span>
            <span class="fr time">{{item.createDate | filterDate1}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import totalTitle from './rollComponents/totalTitle.vue';
import {
  searchHistory,
  burstHotSearch,
  getSupplyAndBuy,
  getEntering,
  getCompanyNewProductList
} from '@/common/api/api';
import {
  mapGetters
} from 'vuex';
export default {
  data() {
    return {
      param_find: {
        pageNo: 1,
        pageSize: 40
      },
      param_new: {
        pageNo: 1,
        pageSize: 20
      },
      param_hot: {
        pageNo: 1,
        pageSize: 20
      },
      param_buySupply: {
        pageNo: 1,
        pageSize: 16
      },
      param_enter: {
        pageNo: 1,
        pageSize: 16
      },
      items_find: [],
      items_hot: [],
      items_buySupply: [],
      items_enter: [],
      items_new: []
    };
  },
  components: {
    totalTitle
  },
  computed: {
    ...mapGetters(['userInfo', 'isMemeber'])
  },
  async created() {
    // 大家在找
    this.items_find = (await (searchHistory(this.param_find))).data.data.list;
    this.items_find = this.items_find.concat(this.items_find.slice(0, 20));
    // 厂家上新
    this.items_new = (await (getCompanyNewProductList(this.param_new))).data.data.list;
    this.items_new = this.items_new.concat(this.items_new.slice(0, 4));
    // 供应求购
    this.items_buySupply = (await (getSupplyAndBuy(this.param_buySupply))).data.data.list;
    this.items_buySupply = this.items_buySupply.concat(this.items_buySupply.slice(0, 8));
    // 最新入驻
    this.items_enter = (await (getEntering(this.param_enter))).data.data.list;
    this.items_enter = this.items_enter.concat(this.items_enter.slice(0, 8));
    // 新增热搜
    this.items_hot = (await (burstHotSearch(this.param_hot))).data.data.list;
    this.items_hot = this.items_hot.concat(this.items_hot.slice(0, 4));
  },
  methods: {
    // 查看更多
    goMore(e) {
      let url;
      if (e === 1) {
        url = `/find/everyLooking`;
      }
      if (e === 2) {
        url = `/hotListPage`;
      }
      if (e === 3) {
        url = `/entryListPage`;
      }
      if (e === 4) {
        url = `/supplyOrBuy`;
      }
      //				this.goto(url);
      this.$router.push({
        path: url
      });
    },
    // 大家在找
    goFind(id) {
      if (!this.userInfo.id) {
        this.$messagebox.alert('您还未登录，不能查看相关信息');
        return;
      }
      if (!this.isMemeber) {
        this.$messagebox({
          title: '你无此权限',
          message: '成为会员，请联系热线电话：4008013357',
          confirmButtonText: '知道了'
        });
        return;
      }
      this.goto(`/catagory/${id}`);
    },
    // 访问最新入驻
    goEnter(id) {
      if (!this.userInfo.id) {
        this.$messagebox.alert('您还未登录，不能查看相关信息');
        return;
      }
      if (!this.isMemeber) {
        this.$messagebox({
          title: '你无此权限',
          message: '成为会员，请联系热线电话：4008013357',
          confirmButtonText: '知道了'
        });
        return;
      }
      this.goto(`/shop/${id}`);
    },
    // 访问供应或求购
    goSupplyOrBuy(item) {
      if (!this.userInfo.id) {
        this.$messagebox.alert('您还未登录，不能查看相关信息');
        return;
      }
      // 供应
      if (item.type === 1) {
        if (this.userInfo.userType === 1) {
					this.$messagebox.alert('为了保密，该供应信息只对贸易商开放');
          return;
        }
        this.goto(`/supplyDetailPage?supplyId=${item.id}`);
      }
      // 求购
      if (item.type === 2) {
        if (!this.isMemeber) {
					this.$messagebox.alert('为了保密，该求购信息只对厂家开放');
          return;
        }
        this.goto(`/purchaseDetailPage?purchaseId=${item.id}`);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.roll {
    margin-top: 20px;
    &-item {
        float: left;
        margin-right: 16px;
        margin-bottom: 30px;
        width: 592px;
        &:nth-of-type(2n) {
            margin-right: 0;
        }
        &-content {
            box-sizing: border-box;
            padding: 25px;
            height: 320px;
            background: #fff;
            overflow: hidden;
            z-index: 9999;
            .img-box {
                width: 4200px;
                height: 260px;
            }
            .img-box1 {
                width: 4200px;
                height: 130px;
            }
            .p-box {
                height: 768px;
            }
            .ts-image {
                box-sizing: border-box;
                margin-right: 20px;
                margin-bottom: 20px;
                cursor: pointer;
            }
            p {
                font-size: 15px;
                color: #333;
                cursor: pointer;
                line-height: 32px;
                .info {
                    display: inline-block;
                    width: 300px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
        }
    }
}
@keyframes roll-left {
    0% {
        transform: translate(0, 0);
        -webkit-transform: translate(0, 0);
    }
    100% {
        transform: translate(-2800px, 0);
        -webkit-transform: translate(-2800px, 0);
    }
}
@keyframes roll-top {
    0% {
        transform: translate(0, 0);
        -webkit-transform: translate(0, 0);
    }
    100% {
        transform: translate(0, -512px);
        -webkit-transform: translate(0, -512px);
    }
}

.animated-left {
    -webkit-animation: 36s roll-left linear infinite;
    animation: 36s roll-left linear infinite;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    &:hover {
        -webkit-animation-play-state: paused;
        animation-play-state: paused;
    }
}

.animated-top {
    -webkit-animation: 14s roll-top linear infinite;
    animation: 14s roll-top linear infinite;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    &:hover {
        -webkit-animation-play-state: paused;
        animation-play-state: paused;
    }
}
</style>
