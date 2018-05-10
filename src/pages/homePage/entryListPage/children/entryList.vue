<template>
<div class="entryList">
  <!-- Tab -->
  <div class="entryList-tab">
    <ts-navbar v-model="selected" v-if="!isShopRoute">
      <ts-tab-item  id="1">优质厂家
        <ts-tag class="entryList-tab-item-tag" type="primary">{{Entry.totalNum}}</ts-tag>
      </ts-tab-item>
      <ts-tab-item id="2">入驻厂家
        <ts-tag class="entryList-tab-item-tag" type="primary">{{totalCompanies.factory}}</ts-tag>
      </ts-tab-item>
      <ts-tab-item id="3">入驻贸易商
        <ts-tag class="entryList-tab-item-tag" type="primary">{{totalCompanies.shop}}</ts-tag>
      </ts-tab-item>
    </ts-navbar>
    <ts-input class="entryList-search input" @input="handleInput" placeholder="输入厂名或贸易商" v-model="searchParam.companyName">
      <ts-button slot="append" size="small" @click="handleSearch"><i class="icon-sousuo"></i></ts-button>
    </ts-input>
  </div>
  <!-- Table -->
  <div class="entryList-table" v-if="showSearchItem">
    <el-table class="entryList-table" :data="Search.list"  border>
      <el-table-column  width="150px" align="center" label="公司名称">
        <template scope="scope">
          <span style="margin-left: 10px">{{ scope.row.companyName }}</span>
          <span v-if="Number(scope.row.isSettled)" class="tag">在线交易</span>
        </template>
      </el-table-column>
      <el-table-column prop="USERATYPE" width="100px" align="center" label="公司类型"></el-table-column>
      <el-table-column prop="phone" align="center" label="联系电话" width="130px"></el-table-column>
      <el-table-column prop="address" align="center" label="地址"></el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <ts-button @click="handleGotoShop(scope.row)" type="primary" class="btn">进入官网</ts-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="entryList-pagination page">
      <ts-pagination type="page" :total="Search.totalNum" :current="Search.pageNO" @change="handleChangeCompanyNum" :pageSize="Search.pageSize"></ts-pagination>
    </div>
  </div>
  <ts-tab-container v-model="selected" class="models-tab-container">
    <!-- 1.优质厂家 -->
    <ts-tab-container-item id="1">
      <ts-grid :data="Entry" class="entryList-company">
        <ts-grid-item class="entryList-company-item item" v-for="product in Entry.list" :key="product" @click="handleGotoShop(product)">
          <div class="entryList-company-item--img">
            <ts-image width="260" height="150" :canView="false" disabledHover :src="product.pic">
            </ts-image>
            <img src="/static/images/zuixin.png" class="zuixin"  v-if="product.isNew===1"  alt="">
          </div>
          <div class="entryList-company-item--right">
            <qrcode :size="90" :val="`http://${product.indexName}.lacewang.cn`"></qrcode>
            <ts-button type="plain" class="entryList-company-item--button">进入官网</ts-button>
          </div>
        </ts-grid-item>
      </ts-grid>
    </ts-tab-container-item>
    <ts-tab-container-item id="2">
    <!-- 2.入驻厂家 -->
      <!-- <div class="entryList-container" v-for="item in NewEntry"> -->
      <!-- <factory-list @viewProduct="handleViewProduct" @viewStore="handleGotoShop" :data="item" :products="item.products">
          <template slot="header">
           <p></p>
         <ts-button type="text" class="entryList-more--button button" @click="handleGotoMore(item)">
           查看更多 <i class="icon-gengduo"></i>
         </ts-button>
         </template>
        </factory-list> -->
      <ts-grid :data="NewEntryCompany.list" class="entryList-company newEntry" v-if='isMemeber'>
        <ts-grid-item class="entryList-company-item item" v-for="product in NewEntryCompany.list" :key="product" @click="handleGotoShop(product)">
        <div class="entryList-company-item--img">
           <ts-image width="110" height="110" :canView="false" disabledHover :src="product.companyHeadIcon">
          </ts-image>
          <img src="/static/images/zuixin.png" class="zuixin"  v-if="product.isNew===1"  alt="">
        </div>
          <div class="entryList-company-item--right">
            <h4>{{product.companyName}}</h4>
            <p><i class="icon-dianhua"></i>&nbsp;{{product.phone}}</p>
            <p class="createDate">{{product.createDate | filterDate1('date')}}</p>
            <ts-button type="plain" class="entryList-company-item--button">进入官网</ts-button>
          </div>
        </ts-grid-item>
      </ts-grid>
      <ts-pagination type="page" :total="NewEntryCompany.totalNum" :current="NewEntryCompany.pageNO" :pageSize="NewEntryCompany.pageSize" class="entryList-pagination page" @change="handleChangePage"></ts-pagination>
      <!-- </div> -->
    </ts-tab-container-item>
    <ts-tab-container-item id="3">
      <!-- <div class="entryList-container" v-for="item in NewEntry"> -->
      <!-- <factory-list @viewProduct="handleViewProduct" @viewStore="handleGotoShop" :data="item" :products="item.products">
          <template slot="header">
           <p></p>
         <ts-button type="text" class="entryList-more--button button" @click="handleGotoMore(item)">
           查看更多 <i class="icon-gengduo"></i>
         </ts-button>
         </template>
        </factory-list> -->
      <ts-grid :data="NewEntryStore.list" class="entryList-company newEntry" v-if='isMemeber'>
        <ts-grid-item class="entryList-company-item item" v-for="product in NewEntryStore.list" :key="product" @click="handleGotoShop(product)">
          <div class="entryList-company-item--img">
          <ts-image width="110" height="110" :canView="false" disabledHover :src="product.companyHeadIcon">
          </ts-image>
          <img src="/static/images/zuixin.png" class="zuixin"  v-if="product.isNew===1"  alt="">
          </div>
          <div class="entryList-company-item--right">
            <h4>{{product.companyName}}</h4>
            <p><i class="icon-dianhua"></i>&nbsp;{{product.phone}}</p>
            <p class="createDate">{{product.createDate | filterDate1('date')}}</p>
            <ts-button type="plain" class="entryList-company-item--button">进入官网</ts-button>
          </div>
        </ts-grid-item>
      </ts-grid>
      <ts-pagination type="page" :total="NewEntryStore.totalNum" :current="NewEntryStore.pageNO" :pageSize="NewEntryStore.pageSize" class="entryList-pagination page" @change="handleChangePage"></ts-pagination>
      <!-- </div> -->
    </ts-tab-container-item>
  </ts-tab-container>
</div>
</template>

<script>
import {
  // findNewCompanys,
  totalCompanies,
  searchCompany,
  getEntering,
  qualityCompanyList1
} from '@/common/api/api';
import {
  mapGetters
} from 'vuex';
import DICT from '@/common/dict/';
import debounce from 'lodash.debounce';
import qrcode from '@/components/qrcode/qrcode.vue';
// 属于发现--厂家上新模块
import factoryList from '../../../find/component/factoryProduct.vue';
export default {
  data() {
    return {
      DICT: {
        userType: DICT.userType
      },
      selected: '1',
      Entry: [],
      // Param: {
      //   companyType: 1
      // },
      Param: {
        pageNo: 1,
        pageSize: 999
      },
      EnteringParam: {
        companyType: '',
        pageNo: 1,
        pageSize: 12
      },
      searchParam: {
        companyName: '',
        pageNo: 1,
        pageSize: 10
      },
      showSearchItem: false,
      NewEntryCompany: [],
      NewEntryStore: [],
      totalCompanies: {},
      Search: {}
    };
  },
  computed: {
    ...mapGetters(['isMemeber', 'userInfo']),
    getOrigin() {
      return window.location.origin;
    }
  },
  watch: {
    selected(val, oldVal) {
      this.IsSotre();
    },
    async 'EnteringParam.pageNo' (val) {
      if (this.selected === '2') {
        // 入驻厂家
        this.NewEntryCompany = (await getEntering(Object.assign({}, this.EnteringParam, {
          companyType: 1
        }))).data.data;
      } else if (this.selected === '3') {
        // 入驻贸易商
        this.NewEntryStore = (await getEntering(Object.assign({}, this.EnteringParam, {
          companyType: 2
        }))).data.data;
      }
    },
    Search: {
      handler(val) {
        if (val.list) {
          val.list.forEach(item => {
            item.USERATYPE = this.filterDict(item.companyType, DICT.userType);
          });
        }
      },
      deep: true
    }
  },
  methods: {
    IsSotre() {
      if (['2', '3'].indexOf(this.selected) >= 0 && !this.isMemeber) {
        this.$messagebox.alert('成为会员，请联系热线电话：4008013357', '你无此权限').then(action => {
          this.selected = '1';
        });
      }
    },
    handleChangePage(number) {
      this.EnteringParam.pageNo = number;
    },
    // 搜索
    async handleSearch() {
      if (this.isMemeber) {
        this.showSearchItem = true;
        this.searchParam.pageNo = 1;
        this.Search = (await searchCompany(this.searchParam)).data.data;
      } else {
        this.$messagebox.alert('成为会员，请联系热线电话：4008013357', '你无此权限').then(action => {
          this.selected = '1';
          this.searchParam.companyName = '';
        });
      }
    },
    async handleChangeCompanyNum(e) {
      this.searchParam.pageNo = e;
      this.Search = (await searchCompany(this.searchParam)).data.data;
    },
    handleInput: debounce(function(item, event) {
      if (item.length === 0) {
        this.searchParam.pageNo = 1;
        this.showSearchItem = false;
      }
    }, 2000),
    // 查看更多---浏览网店的全部花型
    handleGotoMore(item) {
      this.goto(`/shop/${item.id}/allProducts`);
    },
    // 查看网店的首页
    handleGotoShop(item) {
      var shopId;
      if (!item.companyId) {
        shopId = item.id;
       // this.goto(`/shop/${item.id}`);
      // return;
      }else{
        shopId = item.companyId;
        // this.goto(`/shop/${item.companyId}`);
      }
     // console.log('indexName:'+item.indexName);
     var url = 'http://' + item.indexName + '.lacewang.cn';
     this.goto(url);
    },
    handleGotoShopTable(item) {
      this.goto(`/shop/${item.id}`);
      
    },
    handleViewProduct(item) {
      this.goto(`/product/${item.id}`);
    }
  },
  async created() {
    this.totalCompanies = (await totalCompanies()).data.data;
    // 最新入驻改为优质厂家
    this.Entry = (await qualityCompanyList1(this.Param)).data.data;
    // 最新入驻
    this.NewEntryCompany = (await getEntering(Object.assign({}, this.EnteringParam, {
      companyType: '1'
    }))).data.data;
    this.NewEntryStore = (await getEntering(Object.assign({}, this.EnteringParam, {
      companyType: '2'
    }))).data.data;
  },
  components: {
    qrcode,
    factoryList
  }
};
</script>

<style lang="css" scoped>
@component-namespace entryList{
  @component pagination{
      &.page{
        display: table;
        margin: 10px auto;
      }
  }
  @component search{
    &.input{
      width: 30%;
      position: absolute;
      top:50% ;
      left: 70%;
      margin-left: -10px;
      transform: translateY(-50%);
    }
  }
  @component company{
    &.newEntry{
      .entryList-company-item.item{
        width: 292px;
      }
      .entryList-company-item--right{
        height: 110px;
        text-align: left;
        flex: 1;
        padding-left: 10px;
      }
    }
    @descendent item{
      background: #fff;
      margin: 4px;
      position: relative;
      &.item{
        width: 392px;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .zuixin {
        position: absolute 0 * * 0;
      }
      @modifier right{
        text-align: right;
        display: flex;
        align-items: stretch;
        flex-direction: column;
        height: 150px;
        justify-content: space-between;
        .createDate{
          color: grey;
          font-size: 12px;
        }
      }
    }
  }
  @component tab{
    position: relative;
    width: 100%;
  }
  @component tab-item{
    @descendent tag{
      margin-left: 2px;
      font-size: 12px;
    }
  }
  @component more{
    @modifier button{
      &.button{
        height: 45px;
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>
<style>
.entryList-table {
  margin: 10px auto;
  .handleAction {
    display: inline-block;
    padding: 0 12px;
    color: #fff;
    border: none;
    background-color: #4C93FD;
    line-height: 150%;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;
    min-width: 80px;
    cursor: pointer;
    margin: 6px 0;
    vertical-align: middle;
    &:hover {
      color: #fff!important;
      background-color: #2475ef;
    }
  }
}
.el-table__header-wrapper thead div {
  background-color: rgb(248, 248, 248);
  color: #1f2d3d;
  font-weight: normal;
}
.el-table th {
  background-color: rgb(248, 248, 248);
}
.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #f8f8f8;
}
</style>
<style scoped>
  .btn{
    margin: 10px auto;
  }
  .tag{
    font-size: 8px;
    color: #fff;
    background-color: #FF8400;
    border-radius: 2px;
    padding: 2px 2px;
  }
</style>
