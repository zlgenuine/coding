<template>
    <div>
        <ts-nav :showIndex="false" :data="navData" @goto="gotoStore(productDetail.companyId)"></ts-nav>
        <div class="productIntro-wrapper">
            <ts-row :gutter="20">
                <ts-col :span="16">
                    <ts-row :gutter="15">
                        <!-- 1.花型图片 -->
                        <ts-col :span="13">
                            <div class="productIntro-product-cover">
                               <!-- <ts-image width="380" height="380" :canView="false" disabledHover
                                          :src="imgPath(productDetail.defaultPicUrl,'x-oss-process=image/resize,m_fill,h_380,w_380'+watermask)">
                                </ts-image>-->
                                <magnifier  width="380" height="380" :s_width="200" :imgSrc="imgPath(this.Color.picUrl ,'x-oss-process=image/resize,m_fill,h_800,w_800'+this.watermask)"></magnifier>
                                <div class="productIntro-product-share" @click="handleCollected"
                                     v-if="productDetail.userId!==userInfo.id&&userInfo.id">
                                    <i :class="Collect.isCollected?'icon-yishoucang':'icon-shoucang'"></i>
                                    {{Collect.isCollected ? '已收藏' : '收藏'}}
                                </div>
                            </div>
                        </ts-col>
                        <ts-col :span="11">
                            <!-- 2.简介 -->
                            <div class="productIntro-product-intro">
                                <ts-row>
                                    <ts-col :span="24" class="productIntro-product-intro--productNo">
                                        {{productDetail.productNo}}
                                    </ts-col>
                                </ts-row>
                                <ts-row>
                                    <ts-row class="productIntro-product-intro--line">
                                        <ts-col :span="4" class="price">剪版价：</ts-col>
                                        <ts-col :span="8" class="productIntro-product-intro--price">
												<span v-if="!!productDetail.cutPrice">
													¥{{productDetail.cutPrice / 100}}/{{productDetail.priceUnit | filterDict(dicTree.PRODUCT_UNIT, 'name')}}
												</span>
                                            <span v-else>
													价格面议
												</span>
                                        </ts-col>
                                        <ts-col :span="4" class="price">大货价：</ts-col>
                                        <ts-col :span="8" class="productIntro-product-intro--price">
												<span v-if="!!productDetail.price">
													¥{{productDetail.price / 100}}/{{productDetail.priceUnit | filterDict(dicTree.PRODUCT_UNIT, 'name')}}
												</span>
                                            <span v-else>
													价格面议
												</span>
                                        </ts-col>
                                        <ts-col :span="4">种&nbsp;&nbsp;类：</ts-col>
                                        <ts-col :span="20">
                                            {{productDetail.category | filterDict(dicTree.PRODUCT_TYPE, 'name')}}&nbsp;
                                        </ts-col>
                                        <ts-col :span="4" v-show="!!productDetail.classList.length">分&nbsp;&nbsp;类：
                                        </ts-col>
                                        <ts-col :span="20" v-show="!!productDetail.classList.length"><span
                                                v-for="(i,index) in productDetail.classList" :key="index">{{i}}&nbsp;</span>&nbsp;
                                        </ts-col>
                                        <ts-col :span="4">成&nbsp;&nbsp;分：</ts-col>
                                        <ts-col :span="20">{{productDetail.ingredient}}&nbsp;</ts-col>
                                        <ts-col :span="4">货&nbsp;&nbsp;型：</ts-col>
                                        <ts-col :span="20">
                                            {{productDetail.productShape | filterDict(dicTree.PRODUCT_SHAPE, 'name')}}&nbsp;
                                        </ts-col>
                                        <ts-col :span="4">幅&nbsp;&nbsp;宽：</ts-col>
                                        <ts-col :span="20">{{productDetail.width}}{{!!productDetail.width ? 'CM' : ''}}&nbsp;</ts-col>
                                        <ts-col :span="4">花&nbsp;&nbsp;高：</ts-col>
                                        <ts-col :span="20">{{productDetail.height}}{{!!productDetail.height ? 'CM' : ''}}&nbsp;</ts-col>
                                        <ts-col :span="4">出码率：</ts-col>
                                        <ts-col :span="20">{{productDetail.outRate}}&nbsp;</ts-col>
                                        <ts-col :span="4">色&nbsp;&nbsp;系：</ts-col>
                                        <ts-col :span="20">
                                            <div class="productIntro-product-color">
                                                <div v-if="getColorsLength<2">
														<span v-for="(color,index) in Color.list" :key="index">
																<ts-image :src="cards.picUrl"
                                                                          v-for="(cards,index) in color" height="56"
                                                                          width="56" :canView="false" disabledHover
                                                                          class="productIntro-product-color--image"
                                                                          @click="showColorDetail(cards,index)"
                                                                          :class="Color.chosed===index?'is-chosed':''"
                                                                          :key="index"></ts-image>
														</span>
                                                </div>
                                                <div v-if="getColorsLength>=2">
                                                    <ts-carousel class="productIntro-product-color--carousel"
                                                                 v-model="carousel" dots="never" arrow="always"
                                                                 arrowType="square" easing='linear'>
                                                        <ts-carousel-item v-for="(color,index) in Color.list" :key="index">
                                                            <div class="item">
                                                                <ts-image :src="cards.picUrl"
                                                                          v-for="(cards,index) in color" height="56"
                                                                          width="56" :canView="false" disabledHover
                                                                          @click="showColorDetail(cards,index)"
                                                                          :class="Color.chosed===index?'is-chosed':''" :key="index"></ts-image>
                                                            </div>
                                                        </ts-carousel-item>
                                                    </ts-carousel>
                                                </div>
                                            </div>
                                            &nbsp;
                                        </ts-col>
                                        <ts-col :span="4">库&nbsp;&nbsp;存：</ts-col>
                                        <ts-col :span="20">
                                            <span v-if="Color.detail.isStock===0">{{Color.detail.isStock | filterDict(DICT.isStock, 'label2')}}</span>
                                            <span v-else
                                                  v-show="!!Color.detail.stock">{{Color.detail.stock}}/{{Color.detail.unit | filterDict(dicTree.PRODUCT_UNIT, 'name')}}
												</span>
                                            &nbsp;
                                        </ts-col>
                                    </ts-row>
                                </ts-row>
                                <!-- 3.菜单 -->
                                <ts-row class="productIntro-product--row">
                                    <ts-popover trigger="click" :options="{placement: 'bottom'}">
                                        <div class="popper productIntro-popper-phone">
                                            <p class="productIntro-popper-phone-user">
                                                <strong>{{CompanySimpleInfo.phone}}</strong>
                                            </p>
                                            <div class="productIntro-popper-phone-tip">老板，拨打电话时，记得说明
                                                <br> 是坐视布管的客户哦～
                                            </div>
                                        </div>
                                        <ts-col :span="12" slot="reference">
                                            <div class="productIntro-product--col">
                                                <i class="icon-dianhua"></i>电话
                                            </div>
                                        </ts-col>
                                    </ts-popover>
                                    <ts-col :span="12" @click.native="Dialog.enquiry=!Dialog.enquiry">
                                        <div class="productIntro-product--col is-purchase">
                                            <i class="icon-xunjia"></i>我要采购
                                        </div>
                                    </ts-col>
                                </ts-row>
                                <ts-row class="productIntro-product--row">
                                    <ts-col :span="12" @click.native="handleGoto3Ddress">
                                        <div class="productIntro-product--col">
                                            <i class="icon-shiyihui"></i>试衣
                                        </div>
                                    </ts-col>
                                    <ts-col :span="12" v-if="getIsShowSample"
                                            @click.native="Dialog.sendSample=!Dialog.sendSample">
                                        <div class="productIntro-product--col">
                                            <i class="icon-suoyang"></i>索样
                                        </div>
                                    </ts-col>
                                </ts-row>
                            </div>
                        </ts-col>
                    </ts-row>
                </ts-col>
                <ts-col :span="8">
                    <!-- 右侧 -->
                    <div class="productIntro-wrapper-right onepx center">
                        <ts-image shape="round" :src="CompanySimpleInfo.companyHeadIcon" width="100" height="100"
                                  :canView="false"
                                  disabledHover class="productIntro-company-cover">
                        </ts-image>
                        <p class="productIntro-company-name">{{CompanySimpleInfo.companyName}}</p>
                        <div class="productIntro-company--type">
                            <span>{{CompanySimpleInfo.companyType | filterDict(DICT.userType)}}</span>
                        </div>
                        <p class="productIntro-company-business">公司主营</p>
                        <div class="productIntro-company--span">
                            {{CompanySimpleInfo.companyBusiness}}
                        </div>
                        <a :href="'http://' + CompanySimpleInfo.indexName + '.lacewang.cn'">
                            <ts-button type="primary" class="productIntro-company--button">进入网店</ts-button>
                        </a>
                    </div>
                </ts-col>
            </ts-row>

            <!--========== -->
            <!-- 对话框:寄样  -->
            <!--========== -->
            <ts-dialog v-model="Dialog.sendSample" title="索样提示" width="25%" @confirm="handleConfirmSendSample"
                       @close="Dialog.sendSample=false" @cancel="Dialog.sendSample=false">
                <div class="productIntro-dialog-sendSample">
                    <p class="productIntro-dialog-sendSample--text">
                        你的寄样需求系统将以短信方式通知厂家，厂家会尽快与你联系确认需求！
                    </p>
                    <p class="productIntro-dialog-sendSample--tip">本服务由物齐快递全程跟踪(限广州至长乐往返)</p>
                </div>
            </ts-dialog>
            <!-- 对话框---采购信息登记  -->
            <ts-dialog v-model="Dialog.enquiry" title='采购信息登记' @confirm="handleConfirmEnquiry('enquiryForm')"
                       @cancel="handleCancelEnquiry('enquiryForm')" @close="handleCancelEnquiry('enquiryForm')"
                       width="60%">
                <ts-row :gutter="20">
                    <ts-col :span="7">
                        <p class="productIntro-dialog-sendSample--title">已选色卡</p>
                        <ts-image width="200" height="200" :src="Color.picUrl" :canView="false"
                                  disabledHover></ts-image>
                    </ts-col>
                    <ts-col :span="17">
                        <ts-form :model="enquiryForm" :rules="rules" ref="enquiryForm" label-width="125px"
                                 label-position="left">
                            <ts-form-item label="采购类型" prop="purchaseType">
                                <ts-radio-group bordered v-model="enquiryForm.purchaseType">
                                    <ts-radio :label="item.dicValue" v-for="(item,index) in DICT.purchaseType" :key="index">{{item.label}}
                                    </ts-radio>
                                </ts-radio-group>
                            </ts-form-item>
                            <ts-form-item label="采购人" prop="userName">
                                <ts-input v-model="enquiryForm.userName" placeholder="请输入采购人或公司名称"></ts-input>
                            </ts-form-item>
                            <ts-form-item label="手机号码" prop="phone">
                                <ts-input v-model="enquiryForm.phone" placeholder="请输入联系手机"></ts-input>
                            </ts-form-item>
                            <ts-form-item label="剪版数量" prop="purchaseNum" v-if="enquiryForm.purchaseType===3">
                                <ts-input v-model="enquiryForm.purchaseNum" width="50%" :maxlength="9"
                                          placeholder="请输入剪版数量"></ts-input>
                                <ts-select style="width:30%" data-key-name="name" data-val-name="dicValue"
                                           :options="dicTree.PRODUCT_UNIT" v-model="enquiryForm.numUnit"></ts-select>
                            </ts-form-item>
                            <ts-form-item label="大货数量" prop="purchaseNum" v-if="enquiryForm.purchaseType===2">
                                <ts-input v-model="enquiryForm.purchaseNum" width="50%" :maxlength="9"
                                          placeholder="请输入大货数量"></ts-input>
                                <ts-select style="width:30%" data-key-name="name" data-val-name="dicValue"
                                           :options="dicTree.PRODUCT_UNIT" v-model="enquiryForm.numUnit"></ts-select>
                            </ts-form-item>
                            <p class="productIntro-dialog-sendSample--tip">确认提交后系统将以短信方式通知到商家</p>
                        </ts-form>
                    </ts-col>
                </ts-row>

            </ts-dialog>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import DICT from '@/common/dict/';
  import {imgPath} from '@/common/js/utils';
  import {
    getCompanyInfoByUserId,
    sampleAskFor,
    // enquiryAskPrice,
    enquiryAskPurchase,
    favoriteIsFavorite,
    favoriteBus,
    getColorCards
  } from '@/common/api/api';

  export default {
    data () {
      return {
        navData: {
          parentName: '商家网店',
          childName: '花型详情',
          type: 2
        },
        Color: {
          detail: {},
          list: [],
          picUrl: '',
          chosed: ''
        },
        companyId: '',
        companyExtendBO: {},
        CompanySimpleInfo: {},
        DICT: {
          purchaseType: DICT.purchaseType,
          isStock: DICT.isStock,
          userType: DICT.userType
        },
        Dialog: {
          sendSample: false,
          enquiry: false,
          hasAsked: false
        },
        enquiryForm: {
          phone: '',
          userName: '',
          colorId: '',
          purchaseType: '',
          purchaseNum: '',
          numUnit: null
        },
        Collect: {
          isCollected: false
        },
        rules: {
          purchaseNum: [{
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '请输入正确的数量',
            trigger: 'blur',
            min: 1,
            required: true
          }],
          purchaseType: [{
            message: '请选择采购类型',
            required: true
          }],
          userName: [{
            message: '请输入采购人姓名（长度最多为20）',
            max: 20,
            trigger: 'blur',
            required: true
          }],
          phone: [{
            pattern: /^1[34578]\d{9}$/,
            trigger: 'blur',
            required: true,
            message: '请输入正确的手机号码'
          }]
        }
      };
    },
    methods: {
      imgPath,
      gotoStore (id) {
        this.goto(`/shop/${id}`);
      },
      // 去3D试衣
      handleGoto3Ddress () {
        sessionStorage.setItem('flowerUrl', this.productDetail.defaultPicUrl);
        this.$router.push({
          path: `/shop/${this.productDetail.companyId}/models`
        });
      },
      // 取消询价
      handleCancelEnquiry (formName) {
        this.Dialog.enquiry = false;
        this.$refs[formName].resetFields();
      },
      // 收藏花型
      async handleCollected () {
        let res = (await favoriteBus({
          businessId: this.$route.params.id,
          businessType: 1
        })).data;
        this.Collect.isCollected = res.message.indexOf('收藏') >= 0;
      },
      // 确定询价=>提交表单
      handleConfirmEnquiry (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.enquiryForm.productId = this.$route.params.id; // 产品ID
            let res = await enquiryAskPurchase(this.enquiryForm);
            if (!res.data.code) {
              this.Dialog.enquiry = false;
            }
          } else {
            return false;
          }
        });
      },
      // 确定索样
      async handleConfirmSendSample () {
        let res = await sampleAskFor({
          companyId: this.productDetail.companyId,
          productId: this.productDetail.id
        });
        if (!res.data.code) {
          this.$toast('索样成功');
        }
        this.Dialog.sendSample = false;
      },
      // ========
      // 色卡
      // ========
      // 将色卡数组拆分成4份每份4个
      colorPicList (list, num = 4) {
        let result = [];
        for (let i = 0, len = list.length; i < len; i += num) {
          result.push(list.slice(i, i + num));
        }
        ;
        return result;
      },
      // 获取色卡信息
      async handleGetColor (id) {
        let res = await getColorCards({
          productId: id
        });
        if (!res.data.code && res.data.data) {
          this.Color.list = this.colorPicList(res.data.data);
          this.Color.detail = res.data.data[0];
          this.Color.chosed = 0;
          if (this.Color.detail.picUrl) {
            this.$nextTick(() => {
              this.Color.picUrl = this.Color.detail.picUrl; // 色卡图片
            });
            this.enquiryForm.colorId = this.Color.detail.id; // 色卡ID
          }
        }
      },
      // 简略查看色卡信息
      showColorDetail (color, i) {
        this.Color.detail = color;
        this.Color.picUrl = color.picUrl;
        this.$nextTick(() => {
          this.Color.picUrl = color.picUrl; // 色卡图片
        });
        this.enquiryForm.colorId = color.id; // 色卡ID
        this.Color.chosed = i;
      }
    },
    computed: {
      ...mapGetters(['dicTree', 'productDetail', 'userInfo', 'companyInfo', 'watermask']),
      // 是否显示索样
      getIsShowSample () {
        return this.userInfo.userType === 1 && this.companyInfo.city === 440100 && this.companyInfo.province === 440000;
      },
      getColorsLength () {
        return this.Color.list.length;
      },
      img: function () {
        return imgPath(this.Color.picUrl ,'x-oss-process=image/resize,m_fill,h_800,w_800'+this.watermask);
      }
    },
    async created () {
      this.handleGetColor(this.$route.params.id);
      // 是否收藏
      if (this.userInfo.userType) {
        try {
          let {data} = await favoriteIsFavorite({
            businessId: this.$route.params.id,
            businessType: 1
          });
          this.Collect.isCollected = data.data !== 0;
        } catch (e) {
          console.error('获取是否收藏花型失败');
        }
        this.$store.dispatch('getCompanyInfo', this.userInfo.companyId);
        this.companyId = this.productDetail.companyId;
      }
      if (this.dicTree.PRODUCT_UNIT) {
        this.enquiryForm.numUnit = this.dicTree.PRODUCT_UNIT[0].dicValue;
      }
      // path
    },
    watch: {
      productDetail: {
        async handler (val) {
          this.CompanySimpleInfo = (await getCompanyInfoByUserId({
            userId: val.userId
          })).data.data;
          this.$store.commit('SET_COMPANY_INFO', this.CompanySimpleInfo);
        },
        deep: true
      },
      companyInfo: {
        async handler (val) {
          this.companyExtendBO = val.companyExtendBO;
        },
        deep: true
      }
    }
  };
</script>

<style scoped>
    @component-namespace productIntro{
        @component wrapper{
            margin-bottom: 10px;
            padding-left: 14px;
            padding-right: 14px;
            @descendent right{
                padding: 14px;
                margin-left: 10px;
                padding-top: 70px;
                text-align: center;
            }
        }
        @component dialog-sendSample{
            text-align: center;
            @modifier text{
                font-weight: bold;
                margin-bottom: 12px;
            }
            @modifier tip{
                color:grey;
                font-size: 12px;
                text-align: right;
                padding-top: 10px;
            }
            @modifier title{
                margin: 10px auto;
                display: table;
            }
        }
        @component carousel{
            .item{
                .ts-image{
                    margin: 0 4px;
                    &:first-child{
                        margin-left:6px;
                    }
                }
            }
        }
        @component company{
            @descendent name{
                padding: 35px 0 10px 0;
                font-size: 18px;
                position: relative;
            }
            @descendent cover{
                box-shadow: 0px 0px 20px 2px rgba(155,155,155,0.4);
            }
            @descendent business{
                position: relative;
                color:#999999;
                line-height: 34px;
                &:before{
                    content:' ';
                    position: absolute 50% * * 0;
                    background: #eaeaea;
                    size: 50px 1px;
                    transform: translate(150%,-50%);
                }
                &:after{
                    content:' ';
                    position: absolute 50% 0 * *;
                    background: #eaeaea;
                    size: 50px 1px;
                    transform: translate(-150%,-50%);
                }
            }
            @modifier button{
                margin: 40px auto;
                display: table;
            }
            @modifier span {
                color: #666;
                margin: 10px 0;
            }
            @modifier type{
                color: #4C93FD;
                border: 1px solid;
                padding: 0 10px;
                margin-bottom: 30px;
                display: inline-block;
                text-align: center;
            }
        }
        @component popper-phone{
            line-height: 140%;
            padding: 15px;
            @descendent user{
                margin: 10px 0;
                font-size: 23px;
            }
            @descendent tip{
                color: #999;
            }
        }
        @component product{
            @descendent cover{
                position: relative;
                padding-bottom: 80px;
            }
            @descendent color{
                .ts-image{
                    margin: 0 4px;
                }
                @modifier image{
                    border: 1px solid transparent;
                    @when chosed{
                        border-color: #4C93FD;
                    }
                }
            }
            @descendent intro{
                @modifier price{
                    font-size: 17px;
                    margin-bottom: 15px!important;
                    color:red;
                    line-height: 22px;
                }
                @modifier productNo{
                    margin-top: 5px;
                    margin-bottom: 5px;
                    font-size: 20px;
                    font-weight: 700;
                    @utils-ellipsis;
                }
                @modifier line{
                    border-top: 1px dotted #eaeaea;
                    border-bottom: 1px dotted #eaeaea;
                    padding-top: 10px;
                    padding-bottom: 5px;
                    margin-bottom: 5px;
                    margin-top: 10px;
                    font-size: 13px;
                    .ts-col{
                        margin-bottom: 8px;
                        &.ts-col-4{
                            color:grey;
                            &.price{
                                line-height: 22px;
                            }
                        }
                    }
                }
            }
            @descendent share{
                text-align: center;
                margin: 30px 0;
                font-size: 18px;
                position: absolute * * -15px 50%;
                transform: translate(-50%,-50%);
                cursor: pointer;
                transition: .8s;
                &:hover{
                    color:#4C93FD;
                }
                i{
                    padding: 0 10px;
                }
            }
            @modifier col{
                background: #F8F8F8;
                text-align: center;
                margin: 4px;
                border-radius: 1px;
                padding: 10px;
                cursor: pointer;
                transition: .3s;
                &:hover{
                    background:#eaeaea;
                }
                i[class*='icon-']{
                    padding-right: 4px;
                }
                @when purchase{
                    background: rgba(255, 164, 66, 0.86);
                    color: #fff;
                    &:hover{
                        background:rgba(255, 164, 66, 1);
                    }
                    i[class*='icon-']:before{
                        color:#fff;
                    }
                }
            }
            @modifier row{
                width: 230px;
            }
        }
    }
    .grey{
        color: #999;
    }
    .popper-tip{
        line-height: 40px;
        color:grey;
    }
    .icon-shoucang:before {
        color: grey;
    }
</style>
