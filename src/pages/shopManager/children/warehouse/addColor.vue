<template lang="html">
  <ts-menu-table>
    <div slot="header-left">
      <strong>花型色卡信息</strong>
      <span>(共 <i class="red">{{getColorLength}}</i>个花型颜色，默认被查找花型不能删除)</span>
    </div>
    <div slot="header-right">
      <label>
        <ts-button type="warning" @click="handleAddColor">添加花型色卡</ts-button>
      </label>
      <ts-aliupload fileType="3" id="AddColor" multiple @doUpload="handleAddColorCards" :maxNum="8"></ts-aliupload>
    </div>
    <ts-row :gutter="10">
      <ts-col :span="12" v-for="item in ColorList">
        <ts-row class="add-dynamic-col">
          <ts-col :span="7">
            <ts-image class="add-dynamic-image" width="90" height="90" :src="item.picUrl" :canView="false" disabledHover></ts-image>
          </ts-col>
          <ts-col :span="17">
            <div class="add-dynamic--menu">
              <ts-tag  v-show="item.isMain===1">默认被查找花型</ts-tag>
              <ts-button v-show="item.isMain!==1" type="plain" size="small" class="add-dynamic--button" @click="handleSetDefault(item)">设置被默认查找</ts-button>
              <ts-button v-show="item.isMain!==1" type="plain" size="small" class="add-dynamic--button del" @click="handleDelColor(item)">删除色卡</ts-button>
            </div>
            <ts-form-item :show-message="false" label="库存:" labelWidth="50px" class="add-dynamic">
              <ts-radio-group v-model="item.isStock" @change="handleSetColorList">
                <ts-radio type="origin" :label="item.dicValue" v-for="item in DICT.isStock" :key="item.dicValue">{{item.label}}</ts-radio>
              </ts-radio-group>
            </ts-form-item>
            <ts-form-item :show-message="false"  labelWidth="0" v-if="item.isStock===1" class="add-dynamic--input">
                <ts-input size="small" v-model.trim="item.stock" :maxlength="9" placeholder="请输入库存数量" style="width:48%" @input="handleSetColorList"></ts-input>
                <ts-select style="width:48%" data-key-name="name" data-val-name="dicValue" placeholder="选择单位" :options='unit' v-model="item.unit" size="small" @change="handleSetColorList"></ts-select>
            </ts-form-item>
          </ts-col>
        </ts-row>
      </ts-col>
    </ts-row>
  </ts-menu-table>
</template>

<script>
import {
  getColorCards,
  addColorCards,
  deleteColorCard,
  setDefalutColorCards
  // updateColorCards,
  // setDefalutColorCards
} from '@/common/api/api';
import DICT from '@/common/dict';
export default {
  data() {
    return {
      // 数据字典
      DICT: {
        isStock: DICT.isStock
      }
    };
  },
  async created() {
    if (this.ColorList.length) {
      this.$emit('setColorList', this.ColorList[0]);
    }
  },
  props: ['product', 'unit', 'ColorList'],
  computed: {
    getColorLength() {
      return this.ColorList.length;
    }
  },
  methods: {
    // 1.删除色卡
    async handleDelColor(item) {
      this.$store.commit('SET_LOADING', true);
      let res = await deleteColorCard({
        id: item.id
      });
      if (!res.data.code) {
        this.ColorList = (await getColorCards({
          productId: this.product.id
        })).data.data;
        this.$store.commit('SET_LOADING', false);
      }
    },
    // 设置默认色卡
    async handleSetDefault(color) {
      let res = await setDefalutColorCards({
        productId: this.product.id,
        id: color.id
      });
      if (!res.data.code) {
        this.$nextTick(async() => {
          this.ColorList = (await getColorCards({
            productId: this.product.id
          })).data.data;
        });
        this.handleChangeCard(color);
        this.$store.commit('SET_LOADING', false);
      }
    },
    // 选中色卡
    handleChangeCard(item) {
      this.$emit('setColorList', item);
    },
    // 把数据传给父组件 => 主要用于保存信息用
    handleSetColorList() {
      this.$emit('saveColor', this.ColorList);
    },
    // 显示上传色卡的选项框
    handleAddColor() {
      document.querySelector('#AddColor').click();
    },
    // 添加色卡
    async handleAddColorCards(cards) {
      await this.$store.commit('SET_LOADING', true);
      await addColorCards({
        productId: this.product.id,
        picUrls: cards.map(item => {
          return {
            picUrl: item.storeAs
          };
        })
      });
      this.ColorList = (await getColorCards({
        productId: this.product.id
      })).data.data;
      this.$store.commit('SET_LOADING', false);
    }
  }
};
</script>

<style lang="css" scoped>
.red {
  color: red;
}
@component-namespace add {
  @component dynamic {
    clear: both;
    @descendent image{
      border: 4px solid transparent;
      border-radius: 4px;
    }
    @descendent col {
      border: 1px solid #eaeaea;
      border-radius: 2px;
      margin-top: 10px;
      padding: 8px;
      font-size: 12px;
    }
    @modifier menu{
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    @modifier button {
      height: 20px;
      color: #4C93FD;
      border: 1px solid;
      &.del{
        color:red;
      }
    }
    @modifier input{
      margin-left: 50px;
    }
  }
}

</style>
