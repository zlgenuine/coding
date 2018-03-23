<template>
    <div class="">
        <ts-table class="entryList-table" :data="SearchCompany.list">
            <ts-column slot data-key="companyName" width="150px" align="center" name="公司名称"></ts-column>
            <ts-column slot data-key="USERATYPE" width="100px" align="center" name="公司类型"></ts-column>
            <ts-column slot data-key="phone" align="center" name="联系电话" width="130px"></ts-column>
            <ts-column slot data-key="address" align="center" name="地址"></ts-column>
            <ts-column slot align="center" class="text-table--button" name="操作"
                       action="{'text':'进入官网','func':'handleGotoShop'}"></ts-column>
        </ts-table>
        <ts-pagination type="page" :total="SearchCompany.totalNum" class="textSearch-pagination"
                       :current="SearchCompany.pageNO" @change="handleChangeCompanyNum"
                       :pageSize="SearchCompany.pageSize"></ts-pagination>
    </div>
</template>

<script>
import {
  searchCompany
} from '@/common/api/api';
import DICT from '@/common/dict';
export default {
  data() {
    return {
      DICT: {
        userType: DICT.userType
      },
      CompanySearchParams: {
        pageSize: 10,
        companyname: '',
        companyType: 1,
        pageNo: 1
      },
      SearchCompany: {}
    };
  },
  props: ['params'],
  watch: {
    $route(to) {
      this.CompanySearchParams.pageNo = 1;
      this.CompanySearchParams.companyname = to.query.search;
    },
    params(val) {
      this.CompanySearchParams.companyname = val;
    },
    CompanySearchParams: {
      async handler(val) {
        this.SearchCompany = (await searchCompany(val)).data.data;
      },
      deep: true
    },
    SearchCompany: {
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
    handleGotoShop(item) {
      this.goto(`http://${item.indexName}.lacewang.cn`);
    },
    handleChangeCompanyNum(number) {
      this.CompanySearchParams.pageNo = number;
    }
  }
};
</script>
<style scoped>
.textSearch-pagination {
  display: table;
  margin: 7px auto;
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
    line-height: 34px;
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
</style>
