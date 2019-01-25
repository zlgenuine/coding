<template>
    <div class="authCompanyItem" :style="{'flex-wrap': wrap ? 'wrap' : ''}">
      <ts-grid-item class="authCompanyItem-company-item item" v-for="product in list" :key="product" @click="handleGotoShop(product)">
        <div class="authCompanyItem-company-item--img">
          <!--<ts-image width="110" height="110" :canView="false" disabledHover :src="product.companyHeadIcon">-->
          <!--</ts-image>-->
          <img :src="product.companyHeadIcon" style="width: 110px; height: 110px"/>
          <img src="/static/images/zuixin.png" class="zuixin"  v-if="product.isNew===1"  alt="">
        </div>
        <div class="authCompanyItem-company-item--right">
          <h4>{{product.companyName}}</h4>
          <p><i class="icon-dianhua"></i>&nbsp;{{product.phone}}</p>
          <p class="createDate">{{product.createDate | filterDate1('date')}}</p>
          <ts-button type="plain" class="authCompanyItem-company-item--button">进入官网</ts-button>
        </div>
      </ts-grid-item>
    </div>
</template>

<script>
  import {
    goto
  } from '@/common/js/utils.js';
  export default {
    name: "auth-company-item",
    props: ['list', 'wrap'],
    methods: {
      // 查看网店的首页
      handleGotoShop(item) {
        let url = 'http://' + item.indexName + '.lacewang.cn';
        this.goto(url);
      },
    }
  };
</script>
<style lang="css" scoped>
  .authCompanyItem{
    display: inline-flex;
  }
  @component-namespace authCompanyItem{
    @component company{
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
    .authCompanyItem-company-item.item{
      width: 292px;
    }
    .authCompanyItem-company-item--right{
      height: 110px;
      text-align: left;
      flex: 1;
      padding-left: 10px;
    }
  }
</style>


