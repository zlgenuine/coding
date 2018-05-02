<template>
    <div class="purchase-list-page-box">
        <!-- 筛选器 -->
        <div style="background:#fff">
            <ts-filter title="求购分类">
                <ts-radio-group v-model="Filter.sort" @change="hanleFilterSort">
                    <ts-radio label="null">全部</ts-radio>
                    <ts-radio label="100010">面料</ts-radio>
                    <ts-radio label="100011">大边</ts-radio>
                    <ts-radio label="100012">小边</ts-radio>
                    <ts-radio label="100013">睫毛</ts-radio>
                </ts-radio-group>
            </ts-filter>
            <ts-filter title="采购布样">
                <ts-radio-group v-model="Filter.fabricType" @change="hanleFilterFabric">
                    <ts-radio label="null">全部</ts-radio>
                    <ts-radio label="200011">成品</ts-radio>
                    <ts-radio label="200010">胚布</ts-radio>
                </ts-radio-group>
            </ts-filter>
            <ts-filter title="接受开机">
                <ts-radio-group v-model="Filter.supplyShapes" @change="handleFilterSupplyShapes">
                    <ts-radio label="null">全部</ts-radio>
                    <ts-radio label="1">接受</ts-radio>
                    <ts-radio label="0">不接受</ts-radio>
                </ts-radio-group>
            </ts-filter>
        </div>
        <!-- 列表 -->
        <div class="pruchase-list-item-wrapper clearfix">
            <div class="item-wrapper" v-for="item in items" @click="goDetail(item.id)">
                <purchase-item :item="item"></purchase-item>
            </div>
        </div>
        <pagination :page="pageData" @selectedPageNum="selectedPageNum"></pagination>
    </div>
</template>

<script>
  import {
    pagination
  } from '@/components/';
  import {
    listProductBuys
  } from '@/common/api/api';
  import {
    mapGetters
  } from 'vuex';
  import purchaseItem from '../purchaseItem.vue';

  export default {
    data () {
      return {
        Filter: {
          sort: 'null',
          fabricType: 'null',
          supplyShapes: 'null'
        },
        param: {
          'buyShapes': null,
          'isStartUp': null,
          'buyTypes': null,
          'pageNo': 1,
          'pageSize': 25
        },
        items: [],
        pageData: {
          pageNumArr: [],
          maxNum: 1,
          pageNO: 1
        }
      };
    },
    methods: {
      listProductBuysMethod () {
        listProductBuys(this.param).then((res) => {
          if (res.data.code === 0) {
            this.items = res.data.data.list;
            this.pageData.maxNum = res.data.data.totalPage;
            this.pageData.pageNO = res.data.data.pageNO;
          }
        }).catch();
      },
      hanleFilterSort (e) {
        console.log(this.param);
        if (e === 'null') {
          this.param.buyTypes = null;
        } else {
          this.param.buyTypes = parseInt(e);
        }
        this.param.pageNo = 1;
        this.listProductBuysMethod();
      },
      handleFilterSupplyShapes (e) {
        if (e === 'null') {
          this.param.isStartUp = null;
        } else {
          this.param.isStartUp = parseInt(e);
        }
        this.param.pageNo = 1;
        this.listProductBuysMethod();
      },
      hanleFilterFabric (e) {
        if (e === 'null') {
          this.param.buyShapes = null;
        } else {
          this.param.buyShapes = parseInt(e);
        }
        this.param.pageNo = 1;
        this.listProductBuysMethod();
      },
      selectedPageNum (e) {
        this.param.pageNo = e;
        this.listProductBuysMethod();
      },
      // 进去求购想也页面
      goDetail (id) {
        // 贸易商会员账号也可以查看其他贸易商发布的求购，但不能接单
        if (this.userInfo.userType === 2 && !this.isMemeber) {
          this.$messagebox.alert('为了保密，该求购信息仅对厂家公开');
          return;
        }
        this.$router.push({
          path: '/purchaseDetailPage',
          query: {
            purchaseId: id,
            pageData1: this.param
          }
        });
      }
    },
    created () {
      /* console.log(this.$route.query.pageData1);
      if (this.$route.query.pageData1) {
        this.param = this.$route.query.pageData1;
      } */
      listProductBuys(this.param).then((res) => {
        if (res.data.code === 0) {
          this.items = res.data.data.list;
          this.pageData.maxNum = res.data.data.totalPage;
          this.pageData.pageNO = res.data.data.pageNO;
        }
      }).catch();
      this.Filter.sort = this.param.buyTypes + '' || 'null';
      this.Filter.fabricType = this.param.buyShapes + '' || 'null';
      this.Filter.supplyShapes = this.param.isStartUp + '' || 'null';
    },
    components: {
      purchaseItem,
      pagination
    },
    computed: {
      ...mapGetters(['userInfo', 'isMemeber'])
    }
  };
</script>
<style lang="stylus" scoped>
  .purchase-list-page-box
    width 1200px
    margin 0 auto
    padding 16px 0
    .filter-container
      .filter-list
        display flex
        width 100%
        height 40px
        line-height 40px
        font-size 16px
        border-top 1px solid #d8d8d8
        &:last-child
          border-bottom 1px solid #d8d8d8
        .filter-title
          flex 0 0 200px
          box-sizing border-box
          width 200px
          height 40px
          text-align center
          background #e5e5e5
          color #666
          border-left 1px solid #d8d8d8
        .filter-detail
          flex 1
          box-sizing border-box
          height 40px
          background #fff
          border-right 1px solid #d8d8d8
          .item
            display inline-block
            height 40px
            line-height 40px
            width 80px
            text-align center
            cursor pointer
            &:hover
              color #4c93fd
            &.active
              color #4c93fd
    .pruchase-list-item-wrapper
      margin-top 10px
      .item-wrapper
        float left
        margin-left 10px
        margin-top 10px
        &:nth-of-type(5n + 1)
          margin-left 0
</style>
