<template>
<div class="company">
  <div class="company-header">
    <i class="arrow"></i>
    <i class="arrow-bg"></i>
    <span>
				优质厂家
			</span>
    <span class="fr" style="font-size: 14px; cursor: pointer;" @click="goEntry">
				查看更多
				<i class="icon-gengduo"></i>
			</span>
  </div>
  <div class="company-body clearfix">
    <div class="company-body-left fl">
      <img src="/static/images/lace.jpg">
    </div>
    <div class="company-body-right fl">
      <div class="wrapper">
        <ts-carousel height="523px" autoplay-speed="6000" dots="none" autoplay arrow="always" easing='linear'>
          <ts-carousel-item v-for="(company,index) in companys" :key="index">
            <ts-grid>
              <ts-grid-item style="width:289px;height:160px" v-for="(item,index) in company" @click="handleViewProduct(item)" :key="index">
                <ts-image width="258" height="130" :canView="false" disabledHover :src="item.pic"></ts-image>
                <!--<img width="258" height="130" :src="item.pic"/>-->
              </ts-grid-item>
            </ts-grid>
          </ts-carousel-item>
        </ts-carousel>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  qualityCompanyList1
} from '@/common/api/api';
export default {
  data() {
    return {
      titleText: {
        title: '入驻信息',
        extend: '更多惊喜',
        type: 'entry'
      },
      CompanyListParam: {
        pageNo: 1,
        pageSize: 50
      },
      companys: []
    };
  },
  async created() {
    let data = (await qualityCompanyList1(this.CompanyListParam)).data.data.list;
    let result = [];
    for (var i = 0, len = data.length; i < len; i += 9) {
      result.push(data.slice(i, i + 9));
    };
    this.companys = result;
  },
  methods: {
    handleViewProduct(company) {
      this.goto(`http://${company.indexName}.lacewang.cn`);
      // this.goto(`/shop/${company.companyId}`);
    },
    // 更多
    goEntry() {
      this.$router.push({
        path: '/entryListPage'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.company {
    width: 100%;
    background: #fff;
    &-header {
        position: relative;
        padding: 0 30px;
        height: 46px;
        background: #4c93fd;
        color: #FFF;
        font-size: 18px;
        line-height: 52px;
        .arrow {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-top: 27px solid #f2f2f2;
            border-right: 27px solid transparent;
        }
        .arrow-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 30px;
            height: 30px;
            background: url("/static/images/assets/icon/arrow.png");
        }
        .icon-gengduo {
            &::before {
                color: #fff;
            }
        }
    }
    &-body {
        width: 100%;
        &-left {
            padding: 0 20px;
            width: 268px;
            img {
                margin-top: 30px;
            }
        }
        &-right {
            width: calc(100% - 328px);
            .wrapper {
                margin-top: 24px;
                padding: 1px 0 0 1px;
            }
        }
    }
}
</style>
