<template>
    <div class="warehouse" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="请稍候">
        <ts-section>
            <!-- ==== -->
            <!-- 菜单 -->
            <!-- ==== -->
            <div slot="menu">
                <ts-input style="width:30%" placeholder="输入花型编号搜索" v-model="Params.productNo">
                    <ts-button slot="append" size="small" @click="handleSearch"><i class="icon-sousuo"></i></ts-button>
                </ts-input>
                <label>
                    <ts-button size="small" type="primary" @click="handleUpload">
                        <i class="icon-xiangji"></i>
                    </ts-button>
                    <input ref="input" type="file" accept="image/png,image/jpeg" @change="uploadImg" v-show="false">
                </label>
                <label style="position:relative">
                    <ts-button type="warning" @click="handleuploadAvatar('create')">批量新增花型</ts-button>
                    <ts-aliupload fileType="3" id="uploadProduct" @begin="fullscreenLoading = true" multiple
                                  @doUpload="uploadProduct"></ts-aliupload>
                </label>
            </div>
            <!-- ======== -->
            <!-- 品种过滤器 -->
            <!-- ======== -->
            <div class="warehouse-filter" v-show="searchStatus">
                <ts-filter title="分类">
                    <ts-radio-group v-model="Filter.publishStatuss" @change="handleFilterPublishStatus">
                        <ts-radio :label="null">全部({{getToTal}})</ts-radio>
                        <ts-radio :label="item.dicValue" :key="item.value" v-for="item in DICT.PublishStatus"
                                  v-if="item.dicValue!==2||getIsStore">
                            <span :title="item.title"
                                  v-if="item.dicValue===2">{{item.label}}({{productList.platform}})</span>
                            <span :title="item.title"
                                  v-if="item.dicValue===1">{{item.label}}({{productList.shop}})</span>
                            <span :title="item.title" v-if="item.dicValue===0">{{item.label}}({{productList.repository}})</span>
                        </ts-radio>
                        <ts-radio label="lsk" v-if="Number(userInfo.isSettled) ===1">蕾丝控({{productList.lsk}})</ts-radio>
                    </ts-radio-group>

                </ts-filter>
                <ts-filter title="面料种类">
                    <ts-radio-group v-model="Filter.categorys" @change="handleFilterCategorys">
                        <ts-radio :label="null">全部</ts-radio>
                        <ts-radio :label="item.dicValue" :key="item.value" v-for="item in dicTree.PRODUCT_TYPE">
                            {{item.name}}
                        </ts-radio>
                    </ts-radio-group>
                </ts-filter>
            </div>
            <ts-button @click="handleReload" v-show="!searchStatus"><<&nbsp;返回上一级</ts-button>
            <!-- ========= -->
            <!-- 表格 -->
            <!-- ======== -->
            <!-- 花型列表 -->
            <ts-checkbox-group v-model="chooseItem">
                <ts-row :gutter="10">
                    <ts-col :span="12" class="warehouse-grid" v-for="item in productList.list" :key="item.id">
                        <div class="warehouse-grid-item" v-loading.body="item.loading">
                            <ts-row>
                                <ts-col :span="7">
                                    <!-- 1.花型图片 -->
                                    <div class="warehouse-grid-item--status">
                                        <img class="warehouse-grid-item--img"
                                             :src="`/static/images/status/${item.publishStatus}.png`" alt="">
                                        <ts-image :src="item.defaultPicUrl" width="120" height="160"></ts-image>
                                    </div>
                                    <span class="warehouse-grid-item--category"></span>
                                </ts-col>
                                <ts-col :span="2">
                                    <!-- 2.切换 -->
                                    <ul class="warehouse-grid-item--navbar">
                                        <li @click="handleTabChange(item,1)"
                                            :class="[item.isActive===1?'is-active':'']">基本信息
                                        </li>
                                        <li @click="handleTabChange(item,2)"
                                            :class="[item.isActive===2?'is-active':'']">花型色卡
                                        </li>
                                    </ul>
                                </ts-col>
                                <ts-col :span="15" style="min-height: 198px">
                                    <!-- 3.列表的详细信息 -->
                                    <div class="warehouse-grid-item--container" v-if="item.isActive===1">
                                        <ts-row class="warehouse-grid-item--row">
                                            <ts-col :span="5">面料种类</ts-col>
                                            <ts-col :span="7">{{item.category | filterDict(dicTree.PRODUCT_TYPE, 'name')}}</ts-col>
                                            <ts-col :span="5">编号</ts-col>
                                            <ts-col :span="7" :title="item.productNo"><span>{{item.productNo}}</span>
                                            </ts-col>
                                        </ts-row>
                                        <ts-row class="warehouse-grid-item--row">
                                            <ts-col :span="5">大货类型</ts-col>
                                            <ts-col :span="7">
                                                <span>{{item.productShape | filterDict(dicTree.PRODUCT_SHAPE, 'name')}}&nbsp;</span>
                                            </ts-col>
                                            <ts-col :span="5">分类</ts-col>
                                            <ts-col :span="7">
                                                <span v-for="(i,index) in item.classList"
                                                      :key="index">{{i}}&nbsp;</span>
                                            </ts-col>
                                        </ts-row>
                                        <ts-row class="warehouse-grid-item--row">
                                            <ts-col :span="5">成分</ts-col>
                                            <ts-col :span="7">{{item.ingredient}}&nbsp;</ts-col>
                                            <ts-col :span="5">出码率</ts-col>
                                            <ts-col :span="7">{{item.outRate}}&nbsp;</ts-col>
                                        </ts-row>
                                        <ts-row class="warehouse-grid-item--row">
                                            <ts-col :span="5">幅宽</ts-col>
                                            <ts-col :span="7">{{item.width ? `${item.width}CM` : ''}}&nbsp;</ts-col>
                                            <ts-col :span="5">花高</ts-col>
                                            <ts-col :span="7">{{item.height ? `${item.height}CM` : ''}}&nbsp;</ts-col>
                                        </ts-row>
                                        <ts-row class="warehouse-grid-item--row">
                                            <ts-col :span="5">剪版价</ts-col>
                                            <ts-col :span="7">
                                                <span v-if="item.cutPrice>0&&!!item.cutPrice">¥{{item.cutPrice / 100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT, 'name')}}</span>
                                                <span v-else>价格面议</span>
                                            </ts-col>
                                            <ts-col :span="5">大货价</ts-col>
                                            <ts-col :span="7">
                                                <span v-if="item.price>0&&!!item.price">¥{{item.price / 100}}/{{item.priceUnit | filterDict(dicTree.PRODUCT_UNIT, 'name')}}</span>
                                                <span v-else>价格面议</span>
                                            </ts-col>

                                        </ts-row>
                                        <ts-row class="warehouse-grid-item--row">
                                            <ts-col :span="5">所属厂家</ts-col>
                                            <ts-col :span="7">
                                                <span>{{item.produceCompanyName}}</span>
                                            </ts-col>
                                        </ts-row>

                                    </div>
                                    <!-- 4.花型色卡 -->
                                    <div class="warehouse-grid-item--container" v-else>
                                        <p>共
                                            <span class="warehouse-product-color--number">{{item.colorCardsNum}}</span>个花型颜色
                                            <span class="warehouse-product-color--tip">(点击“编辑”按钮配置花型颜色信息)</span>
                                        </p>
                                        <div class="warehouse-product-color">
                                            <div v-if="item.colorCardsNum<5">
                                                <span v-for="(color,index) in item.colorCardspic" :key="index">
                                                    <ts-image :src="cards.picUrl" v-for="(cards,index) in color"
                                                              :key="index"
                                                              height="60" width="60" :canView="false" disabledHover
                                                              class="warehouse-product-color--image"
                                                              @click="showColorDetail(cards,item)"></ts-image>
                                                </span>
                                            </div>
                                            <div v-if="item.colorCardsNum>=5">
                                                <ts-carousel class="warehouse-product-color--carousel"
                                                             v-model="item.carousel" dots="never" arrow="always"
                                                             arrowType="square" easing='linear'>
                                                    <ts-carousel-item v-for="(color,index) in item.colorCardspic"
                                                                      :key="index">
                                                        <div class="item">
                                                            <ts-image :src="cards.picUrl" v-for="(cards,index) in color"
                                                                      :key="index"
                                                                      height="60" width="60" :canView="false"
                                                                      disabledHover
                                                                      @click="showColorDetail(cards,item)"></ts-image>
                                                        </div>
                                                    </ts-carousel-item>
                                                </ts-carousel>
                                            </div>
                                        </div>
                                        <ts-row class="warehouse-product-color--row">
                                            <ts-col :span="5">库存</ts-col>
                                            <ts-col :span="7">{{item.colorDetail.isStock | filterDict(DICT.isStock)}}
                                            </ts-col>
                                            <ts-col :span="5" v-if="item.colorDetail.isStock!==0">库存数量</ts-col>
                                            <ts-col :span="7" v-if="item.colorDetail.isStock!==0">
                        <span v-show="!!item.colorDetail.stock">
                          {{item.colorDetail.stock}}/{{item.colorDetail.unit | filterDict(DICT.StockUnits)}}
                        </span>
                                            </ts-col>
                                        </ts-row>
                                    </div>
                                </ts-col>
                            </ts-row>
                            <!-- 5.花型菜单 -->
                            <div class="warehouse-grid-item--footer">
                                <ts-button type="primary" v-if="item.publishStatus!==1"
                                           @click="handleShelveProduct({goal:1,ids:item.id,isUp:true})" size="small">
                                    上架网店
                                </ts-button>
                                <!--只有入驻与上架到平台或网店才能上架lsk-->
                                <ts-button type="primary"
                                           v-if="Number(userInfo.isSettled) ===1 && Number(Filter.publishStatuss) !== 0"
                                           @click="uploadLsk(item)"
                                           size="small">{{Number(item.isShelve) === 1 ? '下架蕾丝控' : '上架蕾丝控'}}
                                </ts-button>
                                <ts-button type="primary" v-if="item.publishStatus!==2&&getIsStore"
                                           @click="handleShelveProduct({goal:2,ids:item.id,isUp:true})" size="small">
                                    上架平台
                                </ts-button>
                                <ts-button type="primary" v-if="item.publishStatus!==0"
                                           @click="handleShelveProduct({goal:0,ids:item.id})" size="small">下架仓库
                                </ts-button>
                                <ts-button type="warning" @click="handleEdit(item,'edit')" size="small">编辑</ts-button>
                                <ts-button type="plain" @click="handleShowDialog([item.id])" size="small">删除</ts-button>
                                <ts-checkbox :label="item.id" v-if="Filter.publishStatuss!==''">&nbsp;</ts-checkbox>
                            </div>
                        </div>
                    </ts-col>
                </ts-row>
            </ts-checkbox-group>
            <!-- ========= -->
            <!-- 底部菜单 -->
            <!-- ========= -->
            <div slot="footer" class="warehouse-footer">
                <div>
                    <ts-checkbox @change='handleChooseAll' v-model="checkAll">全选</ts-checkbox>
                    &nbsp;
                    <span v-if="Filter.publishStatuss!==null">
                        <ts-button type="primary" :disabled="getChooseIemLen"
                                   v-if="Filter.publishStatuss!==2&&getIsStore"
                                   @click="handleShelveProduct({goal:2,ids:chooseItem,isUp:true})">上架平台</ts-button>

                        <ts-button type="primary" :disabled="getChooseIemLen" v-if="Filter.publishStatuss!==1"
                                   @click="handleShelveProduct({goal:1,ids:chooseItem,isUp:true})">上架网店</ts-button>

                        <ts-button type="cancel" :disabled="getChooseIemLen" v-if="Filter.publishStatuss!==0"
                                   @click="handleShelveProduct({goal:0,ids:chooseItem})">下架仓库</ts-button>
                    </span>
                    <ts-button type="cancel" :disabled="getChooseIemLen" @click="handleShowDialog(chooseItem)">删除
                    </ts-button>
                </div>
                <!-- === -->
                <!-- 分页 -->
                <!-- ===-->
                <ts-pagination
                        :detail="searchStatus"
                        class="warehouse-footer--pagation"
                        @change="handleChangeCurrent"
                        @page-size-change="handleChangePageSize"
                        :current="productList.pageNO"
                        :total="productList.totalPage">
                </ts-pagination>
            </div>
        </ts-section>
        <!--  =============== -->
        <!--  对话框 - 删除花型 -->
        <!--  =============== -->
        <ts-dialog v-model="ConfirmDialog.show" width="30%" title="提示" @confirm="handleDelProduct"
                   @cancel="handleCancelDelProduct" class="warehouse-dialog">
            <p class="warehouse-dialog--title">确认将选中花型删除？</p>
            <p>
                <ts-radio @change.native="handleNoShowDialog" type="origin" v-model="ConfirmDialog.noShowDialog"
                          label="0"><span class="warehouse-dialog--tip">不再提示<i>(花型相关数据删除后无法恢复)</i></span></ts-radio>
            </p>
        </ts-dialog>
        <!-- ================ -->
        <!--  对话框 - 批量上传 -->
        <!-- ================ -->
        <ts-dialog :close-on-click-modal="!loading" type="alert" width="80%" v-model="BatchUpload.dialogShow"
                   title="请选择上传花型的属性（*为必填项）" @close="loadProductList">
            <div class="warehouse-dialog-batchupload" v-loading.body="loading">
                <product-add-form
                        :validate="BatchUpload.validateForm"
                        :status="BatchUpload.status"
                        :data="productForm"
                        @created="handleSubmitProducts"
                        @edit="handleEditProduct">
                </product-add-form>
            </div>
            <span slot="footer"></span>
        </ts-dialog>
        <!--  ============ -->
        <!--  对话框 - 裁剪 -->
        <!--  ============ -->
        <cropper-dialog :dialog="Cropper" :imageUrl="Pic.url" @check="handleLookProduct" @change="handleGetResult">
        </cropper-dialog>
    </div>
</template>

<script>
  import Toast from '@/components/common/toast/toast';
  import schema from 'async-validator';
  import DICT from '@/common/dict';
  import {
    mapGetters
  } from 'vuex';
  import {
    ALI_DOMAIN
  } from '@/common/dict/const';
  import ProductAddForm from './warehouse/add.vue';
  import CropperDialog from '@/components/search/searchImgDialog.vue';
  import {
    shelveProduct,
    deleteProduct,
    getProductList,
    listLSKProduct,
    batchAddProduct,
    updateProduct,
    getColorCards,
    shelveLSK
  } from '@/common/api/api';

  export default {
    data () {
      return {
        fullscreenLoading: false,
        productList: {},
        // 双向绑定 => 与searchImgDialog中 dialog.show对应
        Cropper: {
          show: false
        },
        Pic: {
          url: ''
        },
        // 数据字典
        DICT: {
          PriceUnits: DICT.PriceUnits,
          StockUnits: DICT.StockUnits,
          SupplyType: DICT.SupplyType,
          userType: DICT.userType,
          PublishStatus: DICT.PublishStatus,
          isStock: DICT.isStock
        },
        productForm: {},
        // 搜索值
        searchVal: '',
        // 选择的项目
        chooseItem: [],
        // 全选
        checkAll: '',
        // 参数
        // =======
        Params: {
          publishStatuss: 0,
          pageSize: 10,
          productNo: null,
          pageNo: 1,
          categorys: []
        },
        searchStatus: true,
        ParamsSearchImg: {
          pageNo: 1,
          pageSize: 10,
          id: ''
        },
        // =========
        // 过滤器
        Filter: {
          categorys: null,
          publishStatuss: 0
        },
        // 对话框
        ConfirmDialog: {
          noShowDialog: false,
          show: false,
          id: []
        },
        BatchUpload: {
          dialogShow: false,
          validateForm: false,
          status: 'create'
        },
        // cookie
        Cookie: {
          key: 'showDelProductDialog',
          value: 1,
          day: 7
        },
        // 色卡详细信息
        ColorDetail: {},
        lsk: false,  // 是否获取lsk花型列表
      };
    },
    computed: {
      ...mapGetters(['dicTree', 'userInfo', 'search', 'isMemeber', 'loading']),
      // 判断是否档口
      getIsStore () {
        return this.userInfo.userType !== 2;
      },
      getToTal () {
        return this.productList.platform + this.productList.shop + this.productList.repository;
      },
      // ChooseItem的长度
      getChooseIemLen () {
        return this.chooseItem.length <= 0;
      }
    },
    watch: {
      Params: {
        handler (val) {
          this.checkAll = false;
          this.chooseItem = [];
          this.loadProductList();
        },
        deep: true
      }
    },
    components: {
      CropperDialog,
      ProductAddForm
    },
    async created () {
      // 获取花型列表
      // 先去未上传=>判断是否未上传的花型
      // 如果没有回到获取全部花型
      let productList = (await getProductList(this.Params)).data.data;
      this.productList = productList;

      if (productList.list.length > 0) {
        this.productList.list = productList.list.map(item => {
          return Object.assign({}, item, {
            isActive: 1
          });
        });
      } else {
        this.Filter = Object.assign({}, this.Filter, {
          publishStatuss: null
        });
        this.Params = Object.assign({}, this.Params, {
          publishStatuss: null
        });
      }
      // 默认创建一个cookie
      !this.cookie.get(this.Cookie.key) ? this.cookie.set(this.Cookie.key, this.Cookie.value, this.Cookie.day, '/') : '';
    },
    methods: {
      // 返回上一级=> 库内搜花=》花型列表
      async handleReload () {
        this.ParamsSearchImg = Object.assign({}, this.ParamsSearchImg, {
          pageNo: 1
        });
        this.Params.pageNo = 1;
        this.searchStatus = true;
        this.loadProductList();
      },
      async loadProductList () {
        let dataList = (await getProductList(this.Params)).data.data;
        this.$nextTick(() => {
          this.productList = dataList;
          if (this.productList.list) {
            this.productList.list = dataList.list.map(item => {
              return Object.assign({}, item, {
                isActive: 1,
                loading: false,
                carousel: 0
              });
            });
          }
        });
      },
      // 获取lsk的花型列表
      async getLsk () {
        let dataList = (await listLSKProduct({
          companyId: this.userInfo.companyId,
          pageNo: this.Params.pageNo,
          pageSize: this.Params.pageSize
        })).data.data;
        this.$nextTick(() => {
          if (dataList.list) {
            this.productList.list = dataList.list.map(item => {
              return Object.assign({}, item, {
                isActive: 1,
                loading: false,
                carousel: 0
              });
            });
            this.productList.lsk = this.productList.list.length;
          }
        });
      },
      async handleUpOrEditPro (data, type) {
        if (type === 'create') {
          let res = await batchAddProduct({
            product: data,
            classId: data[0].classId
          });
          if (!res.data.code) {
            // 转为“未上传”页面
            this.Filter = {
              publishStatuss: 0
            };
          }
        } else {
          await updateProduct(data);
        }
        this.loadProductList();
      },
      // 上传花型
      async uploadProduct (pic) {
        let data = pic.map((item, i) => {
          return Object.assign({}, this.productForm, {
            defaultPicUrl: ALI_DOMAIN + item.storeAs,
            productNo: item.name,
            publishStatus: 0
          });
        });
        try {
          this.handleUpOrEditPro(data, 'create');
        } catch (e) {
          console.log(e, '图片上传失败');
          this.$toast('图片上传失败');
        } finally {
          this.fullscreenLoading = false;
        }
        return;
      },
      // 修改花型
      handleEditProduct (data) {
        this.handleUpOrEditPro(data, 'edit');
        this.BatchUpload.dialogShow = false;
      },
      // =======
      // 批量上传前的各种选择
      // =======
      // 选择分类
      handleSubmitProducts (item) {
        this.BatchUpload.dialogShow = false;
        this.productForm = item;
        setTimeout(() => {
          document.querySelector('#uploadProduct').click();
        }, 400);
      },
      // 批量上传花型
      handleuploadAvatar (type) {
        this.BatchUpload.dialogShow = true;
        this.BatchUpload.status = type;
        if (type === 'edit') {
          this.BatchUpload.validateForm = this.userInfo.userType === 1;
        }
      },
      // =======
      // 分页处理
      // searchStatus Y：库内搜花 N：花型列表
      // =========
      async handleChangeCurrent (current) {
        if (!this.searchStatus) {
          this.ParamsSearchImg.pageNo = current;
          await this.$store.dispatch('searchGetResult', this.ParamsSearchImg);
        } else {
          this.Params.pageNo = current;
        }
      },
      async handleChangePageSize (size) {
        if (!this.searchStatus) {
          this.ParamsSearchImg.pageSize = size;
          await this.$store.dispatch('searchGetResult', this.ParamsSearchImg);
        } else {
          this.Params.pageSize = size;
        }
      },
      // ========
      // 文本搜索
      // =======
      async handleSearch () {
        this.Params = Object.assign({}, this.Params, {
          categorys: [],
          publishStatuss: null,
          pageNo: 1,
          productNo: this.Params.productNo.trim()
        });
        this.Filter = {
          categorys: null,
          publishStatuss: ''
        };
      },
      // ===========
      // 裁剪
      // ===========
      // // 隐藏上传file控件
      handleUpload () {
        if (!this.isMemeber) {
          this.$messagebox.alert('成为会员，请联系热线电话：4008013357', '你无此权限');
          return;
        }
        this.$refs.input.click();
      },
      // 上传图片=>搜库内
      uploadImg (e) {
        var file = this.$refs.input.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = () => {
            var url = reader.result;
            this.Cropper.show = true;
            this.ParamsSearchImg = Object.assign({}, this.ParamsSearchImg, {
              pageNo: 1
            });
            this.Pic.url = url;
          };
          reader.readAsDataURL(file);
          e.target.value = '';
        } else {
          this.$toast('出错');
        }
      },
      // 裁剪---选择分类的时候
      async handleLookProduct (item) {
        try {
          this.$store.commit('SET_GLOBAL', false);
          await this.$store.dispatch('getSearchEncoded', {
            companyId: this.userInfo.companyId,
            category: item.category,
            encoded: item.encoded,
            searchType: Number(`${this.userInfo.userType}10`)
          });
        } catch (e) {
          console.error('搜索-BASE64文本出错');
        }
      },
      // 裁剪---开始搜索结果
      async handleGetResult (val) {
        this.$store.commit('SET_SEARCH_EMPTY');
        this.ParamsSearchImg.id = val;
        try {
          await this.$store.dispatch('searchGetResult', this.ParamsSearchImg);
          this.productList.list = this.search.list.map(item => {
            return Object.assign({}, item, {
              isActive: 1
            });
          });
          this.searchStatus = false;
          this.$store.commit('SET_GLOBAL', true);
        } catch (e) {
          console.error('传图搜花结果出错');
        }
      },
      // 全选
      handleChooseAll (event) {
        this.chooseItem = event.target.checked ? this.productList.list.map(item => item.id) : [];
      },
      // ================
      // 条件搜索
      // ================
      // 添加“分类”条件搜索
      async handleFilterPublishStatus (e) {
        if (e === 'lsk') {
          this.lsk = true;
          this.getLsk();
        } else {
          this.lsk = false;
          this.Params = Object.assign({}, this.Params, {
            publishStatuss: e,
            pageNo: 1
          });
        }
      },
      // 添加“面料”条件搜索
      async handleFilterCategorys (e) {
        this.Params = Object.assign({}, this.Params, {
          categorys: !e ? [] : [this.Filter.categorys].map(item => parseInt(item)),
          pageNo: 1
        });
      },
      /*处理接口处理
       type=shelve : 花型上下架
       goal    上下架到哪    number    上架：1--网店 2--平台 下架：0--仓库 1--网店
       ids    id串    string    逗号隔开
       isUp    上架类型    boolean    true--上架 false--下架（默认）*/
      async handleShelveProduct (params) {
        await shelveProduct({
          goal: params.goal,
          ids: [params.ids].join(','),
          isUp: params.isUp
        });
        this.checkAll = false;
        this.chooseItem = [];
        this.loadProductList();
      },
      // lsk上下架
      async uploadLsk (params) {
        if (!params.cutPrice) {
          params.cutPrice = null;
        }
        let descriptor = {
          category: {required: false, message: '请补充花型面料类型'},
          cutPrice: {required: false, type: 'number', message: '请补充剪版价'},
          ingredient: {required: false, message: '请补充花型成分'},
          productShape: {required: false, message: '请补充产品形态'}
        };
        let validator = new schema(descriptor);
        validator.validate(params, async (errors, fields) => {
          if (errors) {
            console.log(errors, fields);
            Toast({type: 'error', message: errors[0].message});
            return handleErrors(errors, fields);
          }
          // validation passed
          let isUp = Number(params.isShelve) === 1 ? false : true;
          await shelveLSK({
            id: params.id,
            isUp: isUp,
            category: params.category,
            cutPrice: params.cutPrice,
            ingredient: params.ingredient,
            productNo: params.productNo,
            productShape: params.productShape
          });
          if (!this.lsk) {
            this.loadProductList();
          } else {
            this.getLsk();
          }
        });
      },
      // 删除花型
      // ================
      // 1.点击“删除”=>判断cookie是否显示
      handleShowDialog (item) {
        this.ConfirmDialog.id = item;
        if (this.cookie.get(this.Cookie.key) === '1') {
          this.ConfirmDialog.show = true;
        } else {
          this.handleDelProduct();
        }
      },
      // 2.删除花型
      async handleDelProduct () {
        await deleteProduct({
          ids: this.ConfirmDialog.id.join(',')
        });
        this.ConfirmDialog.show = false;
        this.chooseItem = [];
        this.checkAll = false;
        this.loadProductList();
      },
      // 取消删除
      handleCancelDelProduct () {
        this.ConfirmDialog.show = false;
        this.cookie.set(this.Cookie.key, this.Cookie.value, this.Cookie.day, '/');
      },
      // 编辑花型
      handleEdit (item) {
        this.productForm = JSON.parse(JSON.stringify(item));
        this.handleuploadAvatar('edit');
      },
      // 切换卡
      async handleTabChange (item, tab) {
        if (tab === 2 && !item.colorCards) {
          await this.handleGetColor(item);
        }
        item.carousel = 0;
        item.isActive = tab;
      },
      // 设置cookie
      handleNoShowDialog (e) {
        this.cookie.set(this.Cookie.key, e, this.Cookie.day, '/');
      },
      // ========
      // 色卡
      // ========
      // 将色卡数组拆分成4份每份3个
      colorPicList (list, num = 3) {
        let result = [];
        for (let i = 0, len = list.length; i < len; i += num) {
          result.push(list.slice(i, i + num));
        }
        ;
        return result;
      },
      // 获取色卡信息
      async handleGetColor (product) {
        product.loading = true;
        let productColor = {};
        let res = await getColorCards({
          productId: product.id
        });
        if (!res.data.code) {
          product.loading = false;
          productColor = res.data.data;
        }
        this.$nextTick(() => {
          this.productList.list.map((item, index, list) => {
            if ((item.id === product.id) && product.id) {
              // 1.色卡长度
              this.$set(item, 'colorCardsNum', productColor.length);
              // 2.色卡数组
              this.$set(item, 'colorCardspic', this.colorPicList(productColor));
              // 3.色卡详情
              this.$set(item, 'colorDetail', productColor[0]);
            }
          });
        });
      },
      // 简略查看色卡信息
      showColorDetail (color, item) {
        item.colorDetail = color;
        item.defaultPicUrl = color.picUrl;
      }
    }
  };
</script>

<style lang="postcss" scoped>
    @component-namespace warehouse {
        @component product-color {
            min-height: 60px;
            @modifier number {
                color: red;
                margin: 0 2px;
            }
            @modifier tip {
                color: grey;
            }
            @modifier carousel {
                margin: 20px auto;
                .item {
                    .ts-image {
                        margin: 0 10px;
                        &:first-child {
                            margin-left: 15px;
                        }
                    }
                }
            }
            @modifier image {
                margin: 22px 2px;
            }
            @modifier row {
                padding-top: 12px;
                border-top: 1px solid #eaeaea;
            }
        }
        @component grid {
            @descendent item {
                font-size: 12px;
                display: inline-block;
                margin-top: 10px;
                border: 2px solid #eee;
                width: 100%;
                border-radius: 4px;
                box-sizing: border-box;
                padding: 8px;
                @modifier flex {
                    display: flex;
                }
                @modifier category {
                    margin: 6px auto;
                    width: 120px;
                    display: inline-block;
                    text-align: center;
                }
                @modifier container {
                    flex: 1;
                    padding-left: 4px;
                    height: 160px;
                    box-sizing: border-box;
                }
                @modifier navbar {
                    li {
                        border: 1px solid #eaeaea;
                        border-radius: 1px;
                        margin: 0 6px 4px;
                        width: 18px;
                        line-height: 19px;
                        font-size: 12px;
                        text-align: center;
                        transition: .3s;
                        cursor: pointer;
                        @when active {
                            border: 1px solid #4c93fd;
                            background: #fff;
                            color: #4c93fd;
                        }
                    }
                }
                @modifier status {
                    position: relative;
                }
                @modifier img {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                    width: 25%;
                }
                @modifier row {
                    margin-bottom: 18px;
                    .ts-col-5 {
                        color: grey;
                        text-align: right;
                    }

                    .ts-col-7 {
                        text-align: left;
                        padding-left: 10px;
                        max-width: 140px;
                        display: inline-block;
                        @utils-ellipsis ;
                    }
                }
                @modifier footer {
                    text-align: right;
                    padding-top: 10px;
                    border-top: 1px solid #eaeaea;
                    button {
                        margin-right: 6px;
                    }
                }
            }
        }
        @component filter {
            margin-bottom: 24px;
        }
        @component footer {
            display: flex;
            align-items: center;
            @modifier button {
                button {
                    margin-right: 32px;
                }
            }
            @modifier pagation {
                flex: 1;
                text-align: right;
            }
        }
        @component table {
            @modifier link {
                display: block;
                text-align: center;
            }
        }
        @component dialog {
            p {
                text-align: center;
            }

            @modifier title {
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 10px;
            }
            @modifier tip {
                font-size: 14px;
                i {
                    font-size: smaller;
                    color: #3F3F3F;
                }
            }
        }
        @component photo {
            @modifier search {
                margin: 0 20px;
                min-width: 40px;
            }
        }
    }
    .icon-xiangji {
        &:before {
            color: #fff;
        }
    }
</style>
