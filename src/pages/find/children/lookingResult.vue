<template>
    <div class="lookingResult-wrapper">
        <ts-nav :data="navData"></ts-nav>
        <div class="lookingResult-target">
            <div class="lookingResult-target-cover">
                <!--<ts-image width='100' height='100' :src="searchSingle.searchSource" :canView="false"
          disabledHover></ts-image>-->
                <magnifier :imgSrc="searchSingle.searchSource" :width="100" :height="100"></magnifier>
            </div>
            <div class="lookingResult-target-detail">
                <p>查找类型：{{searchSingle.category | filterDict(dicTree.PRODUCT_TYPE, 'name')}}</p>
                <p>查找人：{{searchSingle.user ? searchSingle.user.companyName : ''}}</p>
                <p v-if="userInfo.userType===1">联系方式：{{searchSingle.user ? searchSingle.user.userMobile : ''}}</p>
                <p class="lookingResult-target-detail--title">温馨提示：白色的花型图片更利于找到匹配花型哦。</p>
            </div>
        </div>
        <ts-title-block :bodyStyle="{'font-size':'20px'}">
            <i class="icon-huaxin"></i>&nbsp;查找结果
        </ts-title-block>
        <div class="lookingResult-result">
            <ts-grid :data="Search">
                <ts-grid-item style="width:240px" v-for="product in Search" :key="product"
                              @click="handleViewProduct(product)">
                    <ts-image width="170" height="170" :canView="false" disabledHover
                              :src="imgPath(product.defaultPicUrl,'x-oss-process=image/resize,m_fill,h_170,w_170'+watermask)">
                    </ts-image>

                  <!--判断当前登录用户是否与查找人相同，相同的话则判断显示花型的逻辑与快照搜花列表时的判断逻辑一样，不相同时则正常显示，点击跳转到详情页-->
                  <template v-if="
                    searchSingle.user && (searchSingle.user.id !==userInfo.id) ||
                   isMemeber || (!isMemeber && product.vip) ||
                   (!isMemeber && product.isBest) || product.isMain"
                  >
                    <p class="lookingResult-product--number">{{product.productNo}}</p>
                    <template slot="footer">
                      <span v-if="product.price>0&&!!product.price">¥{{product.price / 100}}/{{product.priceUnit | filterDict(dicTree.PRODUCT_UNIT, 'name')
                              }}</span>
                      <span v-else>价格面议</span>
                    </template>
                  </template>
                   <template v-else>
                     <p style="height: 65px; padding-top: 10px; box-sizing: border-box;">
                       <router-link style="color: #20a0ff;" :to="'/renew'" target="_blank">开通会员查看详情</router-link>
                     </p>
                   </template>

                </ts-grid-item>
            </ts-grid>
        </div>
        <ts-button class="lookingResult-pagination" @click="handleChangePage" type="plain">
            查找更多{{searchSingle.category | filterDict(dicTree.PRODUCT_TYPE, 'name')}}
        </ts-button>
    </div>
</template>

<script>
  import {imgPath} from '@/common/js/utils';
  import {mapGetters} from 'vuex';
  import {searchHistoryId, searchGetResult} from '@/common/api/api';

  export default {
    data () {
      return {
        DICT: {},
        // 单条搜索记录
        searchSingle: {
          user: {}
        },
        // 搜索记录列表
        Search: [],
        Param: {
          id: '',
          pageNo: 1,
          pageSize: 10
        },
        navData: {
          parentName: '大家在找',
          childName: '查找详情',
          path: '/find/everyLooking',
          query: ''
        }
      };
    },
    computed: {
      ...mapGetters(['dicTree', 'userInfo', 'watermask', 'isMemeber'])
    },
    methods: {
      imgPath,
      handleChangePage (number) {
        this.Param.pageNo++;
      },
      handleViewProduct (product) {
        if (this.searchSingle.user && (this.searchSingle.user.id !== this.userInfo.id) || this.isMemeber || (!this.isMemeber && product.vip) || (!this.isMemeber && product.isBest) || product.isMain) {
          this.goto(`/product/${product.id}`);
        } else {
          this.goto(`/renew`);
        }
      }
    },
    watch: {
      Param: {
        async handler (val) {
          let lists = (await searchGetResult(val)).data.data.list;
          this.Search = this.Search.concat(lists);
        },
        deep: true
      }
    },
    async created () {
      this.navData.query = this.$route.query;
      this.searchSingle = (await searchHistoryId(this.$route.params.id)).data.data;
      this.Param.id = this.searchSingle.id;
    }
  };
</script>

<style scoped>
    @component-namespace lookingResult {
        @component pagination {
            margin: 7px auto;
            display: table;
        }
        @component product {
            @modifier number {
                font-size: 16px;
                margin-top: 10px;
                text-align: left;
                max-width: 200px;
                @utils-ellipsis ;
            }
        }
        @component target {
            width: 650px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            @descendent detail {
                margin-left: 30px;
                p {
                    line-height: 25px;
                }

                @modifier title {
                    color: #999;
                }
            }
        }
    }
</style>
