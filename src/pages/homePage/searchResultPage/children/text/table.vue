<template>
    <div>
        <el-table class="entryList-table" :data="SearchCompany.list"  border>
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
        <ts-pagination type="page" :total="SearchCompany.totalNum" class="textSearch-pagination"
                       :current="SearchCompany.pageNO" @change="handleChangeCompanyNum"
                       :pageSize="SearchCompany.pageSize">
        </ts-pagination>
    </div>
</template>

<script>
  import {searchCompany} from '@/common/api/api';
  import DICT from '@/common/dict';

  export default {
    data () {
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
      $route (to) {
        this.CompanySearchParams.pageNo = 1;
        this.CompanySearchParams.companyname = to.query.search;
      },
      params (val) {
        this.CompanySearchParams.companyname = val;
      },
      CompanySearchParams: {
        async handler (val) {
          this.SearchCompany = (await searchCompany(val)).data.data;
        },
        deep: true
      },
      SearchCompany: {
        handler (val) {
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
      handleGotoShop (item) {
        this.goto(`http://${item.indexName}.lacewang.cn`);
      },
      handleChangeCompanyNum (number) {
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

    .entryList-table {
        margin: 10px auto;
    }
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
<style>
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

