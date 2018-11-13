<template>
    <div>
        <ts-form :model="addPatternForm" :rules="rules" ref="addPatternForm" label-width="125px" label-position="left">
            <ts-row>
                <ts-col :span="6" v-if="!isCreatedStatus" class="center">
                    <ts-image width="200" height="200" :src="Color.detail.picUrl" v-show="Pic.show" :canView="false"
                              disabledHover>
                    </ts-image>
                    <p>
                        <br>
                        <small>白色的花型更能被查找到哦！</small>
                    </p>
                    <p>
                        <small>所以请尽量添加<strong>白色无干扰</strong>的花型样板</small>
                    </p>
                    <br>
                </ts-col>
                <ts-col :span="isCreatedStatus?24:18" class="add-col"
                        :style="{'max-height':`${getClientHeight/1.5}px`}">
                    <ts-menu-table>
                        <div slot="header-left">
                            <strong>花型基本信息</strong>
                        </div>
                        <ts-form-item label="来源厂家1：" prop="produceCompanyName">
                            <ts-input class="add-input" v-model="addPatternForm.produceCompanyName" :maxlength="10"
                                      size="small" placeholder="请输入来源厂家"></ts-input>
                        </ts-form-item>
                        <ts-form-item label="面料种类：" prop="category">
                            <ts-radio-group bordered v-model="addPatternForm.category" @change="handleML">
                                <ts-radio :label="item.dicValue" v-for="item in dicTree.PRODUCT_TYPE"
                                          :key="item.dicValue">{{item.name}}
                                </ts-radio>
                            </ts-radio-group>
                        </ts-form-item>
                        <ts-row>
                            <ts-col v-if="!isCreatedStatus" :span="12">
                                <ts-form-item label="花型编号：" :prop="validate?'productNo':''">
                                    <ts-input v-model="addPatternForm.productNo" placeholder="请输入花型编号"></ts-input>
                                </ts-form-item>
                            </ts-col>
                            <ts-col :span="12">
                                <ts-form-item label="大货类型：" :prop="validate?'productShape':''">
                                    <ts-radio-group bordered v-model="addPatternForm.productShape">
                                        <ts-radio :label="item.dicValue" :key="item.value"
                                                  v-for="item in dicTree.PRODUCT_SHAPE">{{item.name}}
                                        </ts-radio>
                                    </ts-radio-group>
                                </ts-form-item>
                            </ts-col>
                        </ts-row>
                        <ts-form-item label="花型成分：" :prop="validate?'ingredient':''">
                            <ts-radio-group bordered v-model="addPatternForm.ingredient">
                                <!-- 原有的成分 -->
                                <!-- 成分类型ingredientType为1才可以修改／删除 -->
                                <div class="add-radio" v-for="item in ingredientList">
                                    <ts-radio :label="item.ingredientName" :key="item.id">
                                        <span @keydown="handlePreventInput">
                                            {{item.ingredientName}}
                                        </span>
                                    </ts-radio>
                                    <i class="add-radio-close" @click.self="handleDelIngredient(item,'Ingredient')"
                                       v-if="item.ingredientType=== 1">&times</i>
                                </div>
                                <div class="add-radio" v-for="(item,index) in newIngredients" :key="index">
                                    <ts-radio :label="item.ingredientName">
                                        <span @keydown="handlePreventInput">{{item.ingredientName}}</span>
                                    </ts-radio>
                                    <i class="add-radio-close" @click.self="handleDelIngredient(item,'newIngredient')">&times</i>
                                </div>
                                <!-- 新增的成分 -->
                                <ts-input :validateEvent="false" placeholder="自定义成分"
                                          @keyup.enter.native="handleAddIngredient" class="add-input"
                                          v-model="EditIngredient.newIngredient" :maxlength="8" size="small"
                                          v-clickoutside="handleAddIngredient"></ts-input>
                            </ts-radio-group>
                        </ts-form-item>
                        <ts-form-item label="花型分类：" v-show="hasUserCategory">
                            <ts-radio-group bordered v-model="addPatternForm.classId">
                                <ts-radio :label="item.id" v-for="(item,index) in userCategory" :key="index">{{item.className}}</ts-radio>
                            </ts-radio-group>
                        </ts-form-item>
                        <div v-if="!isCreatedStatus">
                            <ts-row :gutter="5">
                                <ts-col :span="12">
                                    <ts-form-item label="幅宽：" prop="width">
                                        <ts-input v-model="addPatternForm.width" :maxlength='10' placeholder="请输入幅宽">
                                            <span slot="append">CM</span>
                                        </ts-input>
                                    </ts-form-item>
                                </ts-col>
                                <ts-col :span="12">
                                    <ts-form-item label="花高：" prop="height">
                                        <ts-input v-model="addPatternForm.height" :maxlength='10' placeholder="请输入花高">
                                            <span slot="append">CM</span>
                                        </ts-input>
                                    </ts-form-item>
                                </ts-col>
                            </ts-row>
                            <ts-row :gutter="10">
                                <ts-col :span="12">
                                    <ts-form-item label="剪版价：" prop="cutPrice">
                                        <ts-input v-model="cutPrice" style="width:50%" :maxlength='9'
                                                  placeholder="请输入单价"></ts-input>
                                        <ts-select style="width:48%" data-key-name="name" data-val-name="dicValue"
                                                   placeholder="选择单位" :options='CopyDICTUnit'
                                                   v-model="addPatternForm.priceUnit"></ts-select>
                                    </ts-form-item>
                                </ts-col>
                                <ts-col :span="12">
                                    <ts-form-item label="大货价：" prop="price">
                                        <ts-input v-model="prince" style="width:50%" :maxlength='9'
                                                  placeholder="请输入单价"></ts-input>
                                        <ts-select style="width:48%" data-key-name="name" data-val-name="dicValue"
                                                   placeholder="选择单位" :options='CopyDICTUnit'
                                                   v-model="addPatternForm.priceUnit"></ts-select>
                                    </ts-form-item>
                                </ts-col>
                            </ts-row>
                            <ts-row>
                                <ts-col :span="12">
                                    <ts-form-item label="出码率：" prop="outRate">
                                        <ts-input v-model="addPatternForm.outRate" :maxlength='10'
                                                  placeholder="请输入出码率"></ts-input>
                                    </ts-form-item>
                                </ts-col>
                            </ts-row>
                        </div>
                    </ts-menu-table>
                    <!-- 添加色卡 -->
                    <add-color v-if="!isCreatedStatus" :ColorList="Color.list" :product="addPatternForm"
                               :unit="CopyDICTUnit" @setColorList="getColorList"
                               @saveColor="handleSaveColor"></add-color>
                </ts-col>
            </ts-row>
        </ts-form>
        <div class="add-bottom-button">
            <ts-button type="primary" @click="submitForm('addPatternForm')">{{isCreatedStatus ? '批量上传图片' : '保存修改'}}
            </ts-button>
            <ts-button slot="footer" type="plain" @click="handleUplace('addPatternForm')" v-if="upLace">
                {{!addPatternForm.isShelve ? '上架蕾丝控' : '下架蕾丝控'}}
            </ts-button>
        </div>
    </div>
</template>

<script>
  import {
    getIngredientsList,
    getColorCards,
    addIngredient,
    deleteIngredient,
    updateColorCards,
    // setDefalutColorCards,
    listUserProductCategory
  } from '@/common/api/api';
  import {
    ALI_DOMAIN
  } from '@/common/dict/const';
  import DICT from '@/common/dict';
  import Clickoutside from '@/common/js/clickoutside';
  import addColor from './addColor.vue';
  import {
    mapGetters
  } from 'vuex';

  export default {

    // 大边小边默认码
    // 面料默认公斤
    // 睫毛默认条

    data () {
      return {
        // 数据字典
        DICT: {
          SupplyShapes: DICT.SupplyShapes,
          PriceUnits: DICT.PriceUnits,
          StockUnits: DICT.StockUnits,
          SupplyType: DICT.SupplyType,
          isStock: DICT.isStock
        },
        rules: {
          price: [{
            pattern: /^[+]?\d*[.]?\d{0,2}$/,
            message: '请输入正确的价格'
          }],
          cutPrice: [{
            pattern: /^[+]?\d*[.]?\d{0,2}$/,
            message: '请输入正确的剪板价'
          }],
          productNo: [{
            required: true,
            message: '请输入正确的花型编号'
          }],
          category: [{
            required: true,
            message: '请至少选择一个花型分类'
          }],
          ingredient: [{
            required: true,
            message: '请至少选择一个花型成分'
          }],
          productShape: [{
            required: true,
            message: '请至少选择一个大货类型'
          }],
          defaultPicUrl: [{
            required: true,
            message: '请上传一张花型图片',
            trigger: 'change'
          }]
        },
        Pic: {
          show: false,
          text: '添加图片'
        },
        ingredientList: [],
        newIngredients: [],
        // 编辑的成分 => 专门处理clickoutside时用的也能提交
        EditIngredient: {
          content: '',
          newIngredient: ''
        },
        Tip: '',
        // 深拷贝复制一份库存单位
        CopyDICTUnit: [],
        // 自定义花型分类列表
        userCategory: [],
        // 表单
        addPatternForm: {
          produceCompanyName: '',
          category: '',
          height: '',
          ingredient: '',
          isStock: '-1',
          outRate: '',
          classId: '',
          defaultPicUrl: '',
          price: '',
          cutPrice: '',
          priceUnit: '',
          productNo: '',
          publishStatus: '',
          stock: '',
          stockUnit: '',
          width: '',
          productShape: '',
          colorCards: []
        },
        // 色卡
        Color: {
          list: [],
          detail: {},
          temp: []
        }
      };
    },
    directives: {
      Clickoutside
    },
    watch: {
      data (val) {
        console.log(val);
        this.loadData();
      },
      addPatternForm: {
        handler (val, oldVal) {
          let PTJM = '100013'; // 睫毛
          let PUT = '400012';  // 条
          let PSPB = '200010'; // 码
          let PUSG = '400011'; // 公斤
          // ========
          // 1.上传图片
          if (val.defaultPicUrl) {
            this.Pic.text = val.defaultPicUrl ? '修改图片' : '添加图片';
            this.Pic.show = !!val.defaultPicUrl;
          }
          // ==========
          // 2018-10-19 取消不同类型时对价格单位的限制，直接显示全部价格单位

          // 4.面料改变的时候
          // if (val.category !== PTJM) {
          //   this.CopyDICTUnit = this.CopyDICTUnit.filter(item => item.dicValue !== PUT);
          // } else if (val.productShape === PSPB) {
          //   // 如果有选了胚布 => 那就只显示公斤
          //   this.CopyDICTUnit = this.CopyDICTUnit.filter(item => item.dicValue === PUSG);
          // } else {
          //   // 如果不是睫毛 => 显示所有
          //   this.CopyDICTUnit = JSON.parse(JSON.stringify(this.dicTree.PRODUCT_UNIT));
          // }
          // // =========
          // // 5.如果是胚布 => 只显示公斤
          // if (val.productShape === PSPB) {
          //   this.CopyDICTUnit = this.CopyDICTUnit.filter(item => item.dicValue === PUSG);
          // } else if (val.category === PTJM) {
          //   // 如果面料是睫毛 => 把‘条’也显示
          //   this.CopyDICTUnit = this.dicTree.PRODUCT_UNIT;
          // } else {
          //   // 什么没选的情况下 => 条是隐藏的
          //   this.CopyDICTUnit = this.dicTree.PRODUCT_UNIT.filter(item => item.dicValue !== PUT);
          // }
          this.CopyDICTUnit = JSON.parse(JSON.stringify(this.dicTree.PRODUCT_UNIT));
        },
        deep: true
      }
    },
    props: {
      upLace: {
        type: Boolean,
        default: false
      },
      validate: {
        type: Boolean
      },
      status: {
        type: String
      },
      data: {
        type: Object
      }
    },
    components: {
      addColor
    },
    computed: {
      ...mapGetters(['dicTree', 'userInfo']),
      hasUserCategory () {
        return this.userCategory.length > 0;
      },
      // 是否新建花型状态
      isCreatedStatus () {
        return this.status === 'create';
      },
      // 获取页面高度
      getClientHeight () {
        return document.documentElement.clientHeight || document.dody.clientHeight;
      },
      isMain () {
        if (this.addPatternForm.colorDetail) {
          return this.addPatternForm.colorDetail.isMain === 1;
        }
      },
      // 价格：后台需要分 => 获取的时候处以100，设置的时候乘以100
      prince: {
        get () {
          if ((this.addPatternForm.price / 100 === 0) || isNaN(this.addPatternForm.price)) {
            return '';
          }
          return this.addPatternForm.price / 100;
        },
        set (val) {
          this.addPatternForm.price = val * 100;
        }
      },
      // 剪板价
      cutPrice: {
        get () {
          if ((this.addPatternForm.cutPrice / 100 === 0) || isNaN(this.addPatternForm.cutPrice)) {
            return '';
          }
          return this.addPatternForm.cutPrice / 100;
        },
        set (val) {
          this.addPatternForm.cutPrice = val * 100;
        }
      },
      classId () {
        if (this.userCategory && this.data.classList && this.data.classList.length) {
          let className = this.userCategory.filter(item => item.className === this.data.classList[0])[0];
          if (className) return className.id;
        }
      }
    },
    methods: {
      async loadData () {
        if (!this.isCreatedStatus) {
          this.$store.commit('SET_LOADING', true);
          // 1花型信息
          this.addPatternForm = Object.assign({}, this.addPatternForm, {
            category: this.data.category && this.data.category.toString(),
            productShape: this.data.productShape && this.data.productShape.toString(),
            classId: this.classId,
            price: '',
            cutPrice: ''
          }, this.data
          );
          // 2色卡信息
          this.Color.list = (await getColorCards({
            productId: this.addPatternForm.id
          })).data.data;
          if (this.Color.list.length) {
            this.Color.detail = this.Color.list[0];
          }
          this.$store.commit('SET_LOADING', false);
        }
      },
      // ============
      // 编辑花型成分
      // ============
      // 4.删除成分
      async handleDelIngredient (item, type) {
        if (type !== 'newIngredient') {
          let ingredientIndex = this.ingredientList.findIndex(i => i.id === item.id);
          this.ingredientList.splice(ingredientIndex, 1);
        } else {
          let ingredientIndex = this.newIngredients.findIndex(i => i.ingredientName === item.ingredientName);
          this.newIngredients.splice(ingredientIndex, 1);
        }
        // 新增是没有id => so加个判断条件
        if (item.id) {
          await deleteIngredient({
            ids: item.id.toString()
          });
        }
      },
      // 6.Enter健&&click外部新增自定义成分
      async handleAddIngredient () {
        let value = this.EditIngredient.newIngredient;
        if (value) {
          let newIngredientsIndex = this.newIngredients.findIndex(item => item.ingredientName === value);
          let oldIngredientsIndex = this.ingredientList.findIndex(item => item.ingredientName === value);
          // 如果重复了不准新增
          if (newIngredientsIndex === -1 && oldIngredientsIndex === -1) {
            this.addPatternForm.ingredient = value;
            this.newIngredients.push({
              ingredientName: value
            });
            this.EditIngredient.newIngredient = '';
          }
          // 提交后台
          await addIngredient({
            ingredientName: value
          });
          // 获取成分列表
          this.getIngredientsList();
        }
      },
      // ==================
      // 上传图片
      uploadImg (e) {
        // 放到表单
        this.addPatternForm.defaultPicUrl = ALI_DOMAIN + e[0].storeAs;
      },
      // 提交表单
      submitForm (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.Color.temp.length) {
              this.addPatternForm.colorCards = this.Color.temp;
              this.addPatternForm.isStock = 0;  // 默认无库存
              for (let card of this.Color.temp) { // 色卡有库存则总库存为有
                // 1或 '1' '-1'
                if (card.isStock) this.addPatternForm.isStock = card.isStock;
                break;
              }
            }
            let data = JSON.parse(JSON.stringify(this.addPatternForm));
            console.log(data);
            if (this.isCreatedStatus) {
              await this.$emit('created', data);
            } else {
              await this.$emit('edit', data);
              await this.$emit('editColor', this.Color.temp);
/*              if (this.Color.temp.length) {
                await updateColorCards({
                  productId: data.id,
                  colorCards: this.Color.temp
                });
              } */
            }
            this.$refs[formName].resetFields();
          } else {
            return false;
          }
        });
      },
      // 上下架蕾丝控
      handleUpLace (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            // 上下架蕾丝控状态
            this.addPatternForm.isShelve = !this.addPatternForm.isShelve;
            let data = JSON.parse(JSON.stringify(this.addPatternForm));
            await this.$emit('upLace', data);
            this.$refs[formName].resetFields();
          } else {
            return false;
          }
        });
      },
      // 打开获取色卡列表
      getColorList (item) {
        this.$set(this.addPatternForm, 'colorDetail', item);
        this.Color.detail = item;
      },
      handleSaveColor (list) {
        this.Color.temp = list;
      },
      // 当花型类型选择“睫毛”时，剪版价/大货价对应价格单位自动切换为“条”，花型类型选择“睫毛”以外 的自动切换为码（挖坑）
      handleML (label) {

        // 2018-10-19 取消不同类型时对价格单位的限制，直接显示全部价格单位

        // let PTJM = "100013"; // 睫毛
        // let PUT = "400012";  // 条
        // let PSPB = "400010"; // 码
        // if (String(label) === PTJM) {
        //   this.addPatternForm.priceUnit = PUT;
        // } else {
        //   this.addPatternForm.priceUnit = PSPB;
        // }

      },
      // 获取成分列表
      getIngredientsList: async function () {
        this.newIngredients = [];
        this.ingredientList = (await getIngredientsList()).data.data;
      }
    },
    async created () {
      // ======
      // 库存单位 首先隐藏条 当选择面料为睫毛的时候才显示

      let units = JSON.parse(JSON.stringify(this.dicTree.PRODUCT_UNIT));
      // this.CopyDICTUnit = units.filter(item => item.dicValue !== `400012`);
      this.CopyDICTUnit = units;
      this.addPatternForm.priceUnit = this.CopyDICTUnit[0].dicValue;

      // 用户分类
      let userCategory = (await listUserProductCategory({
        pageNo: 1,
        pageSize: 1000
      })).data.data.list;
      if (userCategory.length > 0) {
        this.userCategory = userCategory;
      }
      this.loadData();
      // 获取成分列表
      this.getIngredientsList();
    }
  };
</script>

<style scoped>
    :root {
        --add-radio-close-color: white;
        --add-radio-close-bg: red;
        --add-radio-close-hover-bg: #bc0303;
        --add-radio-close-size: 16px;
    }

    .center {
        text-align: center;
    }

    @component-namespace add {
        @component input {
            width: 15%;
            display: inline-block;
        }
        @component col {
            overflow-x: hidden;
            overflow-y: auto;
            padding-right: 10px;
        }
        @component radio {
            display: inline-block;
            position: relative;
            @descendent close {
                position: absolute;
                top: 0;
                left:-8px;
                border-radius: 50%;
                text-align: center;
                line-height: 1;
                cursor: pointer;
                background: var(--add-radio-close-bg);
                color: var(--add-radio-close-color);
                size: var(--add-radio-close-size) var(--add-radio-close-size);
                transition: .3s;
                z-index: 1;
                &:hover {
                    background: var(--add-radio-close-hover-bg);
                }
            }
        }
        @component bottom {
            @descendent button {
                display: table;
                margin: 10px auto;
                button {
                    margin-left: 8px;
                }
            }
        }
        @component upload {
            @descendent button {
                color: #4C93FD;
                height: 38px;
                line-height: 38px;
                cursor: pointer;
                transition: .5s;
                position: relative;
                &:hover {
                    color: #105bca;
                }
            }
        }
    }
</style>
