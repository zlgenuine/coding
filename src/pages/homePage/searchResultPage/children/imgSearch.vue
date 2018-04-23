<template>
    <div class="imgSearch-content">
        <div class="imgSearch-result">
            <div class="imgSearch-image-box">
                <img :src="Pic.encoded" width="150" height="150" ref="uploadImg">
                <span class="imgSearch-image-box-tip" @click="handleChoosePic(Pic.encoded)">手动框图</span>
            </div>
            <div class="imgSearch-image-box-text">
                <!-- <p>对该图片的最佳猜测：{{firstProductNo}}</p> -->
                <p>对结果不满意？重新截图试试</p>
                <p>白色的花型更能被查找到哦！所以请尽量添加白色无干扰的花型样板。</p>
            </div>
        </div>
        <ts-title-block :bodyStyle="{'font-size':'20px'}">
            <i class="icon-huaxin"></i>&nbsp;相似花型
        </ts-title-block>
        <!-- 图片列表 -->
        <div class="">
            <ts-grid :data="search.list" class="imgSearch-data">
                <ts-grid-item class="imgSearch-data-item" v-for="product in search.list" :key="product">
                    <div class="imgSearch-image-box-img">
                        <a :href="'/product/'+product.id" target="_blank" style="display: block"
                           @click="handleViewProduct(product.id)">
                            <ts-image
                                    width="170"
                                    height="170"
                                    :canView="false"
                                    disabledHover
                                    :src="getImg(product.defaultPicUrl)">
                            </ts-image>
                        </a>
                        <div class="imgSearch-image-box-menu">
                            <p @click.stop="handleGotoDress(product)"><i class="icon-shiyihui"></i>&nbsp;试衣</p>
                            <p @click.stop="handleChoosePic(getImg(product.defaultPicUrl))"><i class="icon-sousuo"></i>&nbsp;再找
                            </p>
                        </div>
                        <img src="/static/images/tuijian.jpg" v-if="product.isBest===1"
                             class="imgSearch-image-box-watermask" alt="">
                    </div>
                    <div class="imgSearch-title">
                        <p class="imgSearch-title-left">{{product.productNo}}</p>
                        <p>{{product.updateDate | customTime}}发布</p>
                    </div>
                    <template slot="footer">
                        <!--<p class="imgSearch-product-company">{{product.companyName}}</p>-->
                        <router-link class="imgSearch-product-contact"
                                     @click.native="handleViewProduct(product.id)"
                                     :to="'/product/'+product.id" target="_blank">联系厂家
                        </router-link>
                        <p class="imgSearch-product-contrast" @click="contrastShow(product)">对比</p>
                        <!-- <span v-if="!Type.edit">{{product.publishDate | customTime}}</span> -->
                        <span v-if="product.price>0&&!!product.price">¥{{product.price / 100}}/{{product.priceUnit | filterDict(DICT.PriceUnits)
                            }}</span>
                        <span v-else>价格面议</span>
                        <!-- <ts-tag class="imgSearch-tag" v-else>
                            <a>编辑</a>
                        </ts-tag> -->
                    </template>
                </ts-grid-item>
            </ts-grid>
            <br/>
            <div class="imgSearch-tip imgSearch-wrapper">
                <p v-if="Pic.canCropper">
                    <ts-button type="plain" @click="handleLoadMore">查看更多花型</ts-button>
                </p>
                <div v-if="!isShopRoute">
                    没找到合适的？赶紧
                    <router-link tag="a" to="/releasePurchasePage" v-if="userInfo.userType===2">
                        <a>发布求购</a>
                    </router-link>
                    <router-link tag="a" to="/releaseSupplyPage" v-else>
                        <a>发布供应</a>
                    </router-link>
                    吧
                </div>
            </div>
            <!-- 合作厂家的列表 -->
            <div class="imgSearch-bestCompany" v-if="!isShopRoute">
                <p class="imgSearch-bestCompany-tip">没找到合适的？可以找优质厂家开机</p>
                <ts-grid :data="companyBestList.list" class="imgSearch-data">
                    <ts-grid-item style="width:400px" v-for="product in companyBestList.list" :key="product"
                                  @click="handleGotoShop(product)">
                        <ts-image
                                width="371"
                                height="260"
                                :canView="false"
                                disabledHover
                                :src="product.pic">
                        </ts-image>
                        <div slot="footer" class="onepx imgSearch-data-menu">
                            <a>
                                找他开机
                            </a>
                        </div>
                    </ts-grid-item>
                </ts-grid>
            </div>
        </div>
        <div class="imgSearch-footer" v-if="!isShopRoute">
            <p>我也可以开机？赶紧联系客服谈合作吧</p>
            <p>免费热线</p>
            <p>400-801-3357</p>
        </div>
        <cropper-dialog :dialog="Cropper" :imageUrl="Pic.encoded" @check="handleLookProduct" @close="handleClose"
                        @change="handleGetResult">
        </cropper-dialog>
        <!-- 短信接收设置说明对话框 -->
        <ts-dialog title="花型对比" v-model="contrast" v-if="currentRow" type="alert">
            <div style="font-size: 0">
                <div class="contrast" style="width: 50%">
                    <h5 class="contrast__title">搜花原图</h5>
                    <img class="contrast__img" :src="Pic.encoded">
                </div>
                <div class="contrast" style="width: 50%">
                    <h5 class="contrast__title">搜花原图</h5>
                    <img class="contrast__img" :src="getImg(currentRow.defaultPicUrl)"
                         v-show="currentRow.defaultPicUrl">
                </div>
            </div>
            <div slot="footer"></div>
        </ts-dialog>
    </div>
</template>

<script>
  import {
    getCompanyBestList, viewSearchProduct
  } from '@/common/api/api';
  import DICT from '@/common/dict';
  import {
    mapGetters
  } from 'vuex';
  import CropperDialog from '@/components/search/searchImgDialog.vue';
  import {imgPath} from '@/common/js/utils';

  export default {
    data () {
      return {
        // 双向绑定 => 与searchImgDialog中 dialog.show对应
        Cropper: {
          show: false
        },
        contrast: true,
        // XXX:仓库管理搜图=>搜图暂时可以跳去编辑页面
        Type: {
          edit: false
        },
        companyBestList: {},
        Pic: {
          destImg: '',
          url: '',
          naturalHeight: 0,
          naturalWidth: 0,
          encoded: '',
          canCropper: true
        },
        DICT: {
          productType: DICT.SupplyType,
          PriceUnits: DICT.PriceUnits
        },
        Params: {
          id: '',
          pageNo: 1,
          pageSize: 10
        },
        // 当前行
        currentRow: null
      };
    },
    watch: {
      $route (to, from) {
        this.Params.pageNo = 1;
        this.Pic.encoded = JSON.parse(sessionStorage['find-pic']).encoded;
        this.Params.id = to.query.imgId;
        this.$store.commit('SET_SEARCH_EMPTY');
        this.$store.dispatch('searchGetResult', this.Params);
      },
      search: {
        handler (val) {
          if (val.list[0]) {
            // this.Pic.encoded = val.list[0].defaultPicUrl;
            let img = new Image();
            img.src = this.Pic.encoded;
            img.onload = () => {
              this.Pic.canCropper = true;
            };
            img.onerror = () => {
              this.Pic.canCropper = false;
            };
          }
        },
        deep: true
      }
    },
    components: {
      CropperDialog
    },
    beforeDestroy () {
      this.$store.commit('SET_PROGRESS', 1);
      this.$store.commit('SET_HANDLE_STATUS', false);
      this.$store.commit('CLEAR_INTERVAL');
      this.$store.commit('SET_SEARCH_EMPTY');
    },
    computed: {
      ...mapGetters(['search', 'userInfo', 'watermask']),
      isShopRoute () {
        return this.$route.path.indexOf('/shop/') >= 0;
      }
      // 去搜索列表第一个数据
      //   firstProductNo() {
      //     if (this.search.list[0]) {
      //       return this.search.list[0].productNo;
      //     }
      //   }
    },
    methods: {
      getImg (img) {
        if (this.isShopRoute) {
          return imgPath(img, 'x-oss-process=image/resize,m_fill,h_170,w_170');
        }
        return imgPath(img, 'x-oss-process=image/resize,m_fill,h_170,w_170' + this.watermask);
      },
      handleLoadMore () {
        this.Params.pageNo++;
        this.$store.dispatch('searchGetResult', this.Params);
      },
      handleGotoDress (item) {
        sessionStorage.setItem('flowerUrl', item.defaultPicUrl);
        this.$router.push({
          path: `/threeDDressPage`
        });
      },
      // 进入商店
      handleGotoShop (item) {
        this.goto(`/shop/${item.companyId}`);
      },
      handleClose () {
        this.Pic.encoded = JSON.parse(sessionStorage['find-pic']).encoded;
      },
      // 选择图片
      handleChoosePic (pic) {
        if (!(pic.indexOf('?') >= 0)) {
          this.Pic.encoded = pic;
          this.Cropper.show = true;
        } else {
          this.convertImgToBase64(pic.split('?')[0], (result) => {
            this.Pic.encoded = result;
            this.Cropper.show = true;
          });
        }
      },
      // 寻找花型(最终一步)
      async handleLookProduct (item) {
        await this.$store.dispatch('getSearchEncoded', {
          category: item.category,
          encoded: item.encoded,
          searchType: 300
        });
      },
      // 裁剪---开始搜索结果
      handleGetResult (val) {
        this.$router.push({
          path: '/search/image',
          query: {
            imgId: val
          }
        });
      },
      // XXX:仓库管理搜图=>搜图暂时可以跳去编辑页面
      async handleViewProduct (id) {
        if (this.Type.edit) {
          this.$router.push({
            path: `/shopManagePage/addwarehouse`,
            query: {
              id: id
            }
          });
        } else {
          try {
            await viewSearchProduct({productId: id, searchResultId: this.Params.id});
          } catch (e) {
            console.log(e);
          } finally {
            // this.goto(`/product/${id}`);
          }

        }
      },
      contrastShow (value) {
        this.contrast = true;
        this.currentRow = value;
      }
    },
    async created () {
      // XXX:从仓库管理跳过来，暂时给他跳去编辑页面
      if (this.$route.query.type) {
        this.Type.edit = true;
      }
      // 如果url存在id =》加载数据
      if (this.$route.query.imgId) {
        this.Params.id = this.$route.query.imgId;
        this.$store.dispatch('searchGetResult', this.Params);
        this.companyBestList = (await getCompanyBestList({
          pageNo: 1,
          pageSize: 3
        })).data.data;
        this.Pic.canCropper = this.search.list.length > 0;
      }
      if (sessionStorage['find-pic']) {
        this.Pic.encoded = JSON.parse(sessionStorage['find-pic']).encoded;
      }
    }
  };
</script>

<style scoped>
    @component-namespace imgSearch {
        @component tip {
            line-height: 50px;
            a {
                color: #4C93FD;
            }
        }
        @component product {
            @modifier number {
                font-size: 16px;
                margin-top: 10px;
                text-align: left;
                max-width: 200px;
                @utils-ellipsis ;
            }
            @descendent company {
                @utils-ellipsis ;
                max-width: 65%;
            }
            @descendent contact {
                border: 1px solid #4C93FD;
                border-radius: 4px;
                color: #4C93FD;
                font-size: 12px;
                padding: 1px 3px;
            }
            @descendent contrast {
                color: #FF8400;
                font-size: 12px;
                margin-left: -50px;
            }
            @descendent contrast:hover {
                color: rgb(255, 90, 0);
            }
        }
        @component result {
            width: 650px;
            margin: 0 auto;
            display: flex;
            align-items: center;
        }
        @component data {
            @descendent menu {
                width: 100%;
                line-height: 40px;
            }
            @descendent item {
                width: 240px;
                &:hover {

                    .imgSearch-image-box-menu {
                        display: table;
                    }
                }
            }
        }
        @component editPic {
            @modifier menu {
                text-align: center;
                clear: both ;
                padding-top: 16px;
                button {
                    margin: 0 4px;
                }
            }
        }
        @component pagination {
            display: table;
            margin: 7px auto;
        }
        @component title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 40px;
            @descendent left {
                flex: 1;
                padding-right: 4px;
                text-align: left;
                @utils-ellipsis ;
            }
        }
        @component image-box {
            position: relative;
            max-width: 150px;
            &:hover {

                .imgSearch-image-box-tip {
                    display: inline-block;
                }
            }

            @descendent watermask {
                position: absolute;
                top: 0;
                right: 20px;
            }
            @descendent img {
                position: relative;
            }
            @descendent menu {
                position: absolute;
                right: 0;
                left: 0;
                bottom: 0;
                display: none;
                table-layout: fixed;
                width: 100%;
                max-width: 170px;
                margin: 0 auto;
                i[class*='icon-'] {

                    &:before {
                        color: #fff;
                    }
                }

                p {
                    background: rgba(0, 0, 0, 0.3);
                    color: #fff;
                    display: table-cell;
                    width: 50%;
                    position: relative;
                    height: 30px;
                    vertical-align: middle;
                    cursor: pointer;
                    transition: .8s;

                    &:hover {
                        background: rgba(0, 0, 0, 0.5);
                    }

                    &:first-child:after {
                        content: '';
                        position: absolute;
                        right: 0;
                        height: 100%;
                        top: 0;
                        width: 1px;
                        background: #fff;
                    }

                }
            }
            @descendent text {
                margin-left: 30px;
                p {
                    line-height: 35px;

                    &:nth-of-type(1) {
                        font-size: 20px;
                        letter-spacing: 0;
                    }

                    &:nth-of-type(2) {
                        color: #FF8400;
                        margin-top: 20px;
                    }

                    &:nth-of-type(3) {
                        color: #999;
                    }
                }
            }
            @descendent tip {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                display: inline-block;
                height: 28px;
                line-height: 28px;
                background: rgba(0, 0, 0, 0.4);
                color: #fff;
                display: none;
                cursor: pointer;
                text-align: center;
            }
        }
        @component bestCompany {
            @descendent tip {
                text-align: left;
                line-height: 50px;
            }
        }
        @component footer {
            text-align: center;
            p {

                &:nth-of-type(1) {
                    font-size: 14px;
                    color: #999999;
                    margin: 10px 0;
                    letter-spacing: 0;
                }

                &:nth-of-type(2) {
                    font-size: 18px;
                    color: #666666;
                }

                &:nth-of-type(3) {
                    font-size: 18px;
                    color: #FF8400;
                    margin-bottom: 10px;
                }
            }
        }
        @component tag {
            a {
                color: #fff;

                &:hover {
                    color: #FF8400;
                }
            }
        }
        @component wrapper {
            text-align: center;
        }

    }
</style>
<style lang="scss">
    .contrast {
        display: inline-block;
        font-size: 0;
        &__title {
            font-size: 13px;
            text-align: center;
            font-weight: normal;
            margin-bottom: 10px;
        }
        &__img {
            display: block;
            width: 210px;
            height: 210px;
            margin: 0 auto;
        }
    }
</style>
