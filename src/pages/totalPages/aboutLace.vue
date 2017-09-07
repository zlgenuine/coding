<template lang="html">
  <div class="aboutLace-wrapper">
    <v-header>
			<search></search>
		</v-header>
		<v-nav></v-nav>
    <div class="aboutLace-nav">
      <router-link to="homePage">首页</router-link> > 蕾丝产业
    </div>
  <ts-title-block>
    <span class="aboutLace-title-block">
     <span>蕾丝产业</span>
     <span class="aboutLace-title-block--text">lace industry</span>
    </span>
  </ts-title-block>
  <div class="aboutLace-content">
    <div class="aboutLace-content-left">
      <img src="/static/images/about_lace.png" alt="">
    </div>
    <div class="aboutLace-content-right">
      <p class="orange">《蕾丝产业》2017年10月期刊，火热招商中</p>
      <div class="aboutLace-content-right--intro">
          <p>《蕾丝产业》是全国唯一的蕾丝产业专属期刊。是一个集平面媒体、互联网媒体和移动新媒体等多种传播方式的全媒体平台。</p>
          <p>期刊从创办至今，已推出8期季刊，总发行量达五万多册，推广在蕾丝产业链上的各个领域，促进行业数十亿交易额的达成。</p>
          <p>现已招商4家：远东，宏鑫，悦鑫，盛旺，剩余席位10家。</p>
      </div>
      <p>推 广 指 数：<i class="icon-yishoucang"></i><i class="icon-yishoucang"></i><i class="icon-yishoucang"></i><i class="icon-yishoucang"></i><i class="icon-yishoucang"></i></p>
      <p>性价比指数：<i class="icon-yishoucang"></i><i class="icon-yishoucang"></i><i class="icon-yishoucang"></i><i class="icon-yishoucang"></i><i class="icon-yishoucang"></i></p>
      <p>推 广 对 象:  蕾丝产业中下游  （档口,服装厂,设计师）</p>
      <p>推 广 方 式：扫街式地推</p>
      <p>推 广 时 长：2017年下半年</p>
      <p>推 广 痕 迹：蕾丝中下游产业集群，广州中大，虎门，汕头谷饶、浙江柯桥、义乌等。
主流国际展会，包含深圳原创设计面辅料展，上海国际面辅料展，越南国际纺织面料展等。</p>
      <p class="orange">招 商 热 线：18965916557</p>
    </div>
  </div>
  </div>
</template>

<script>
import { header, nav, search } from '@/components';
export default {
  components: {
    'vHeader': header,
    'vNav': nav,
    search
  }
};
</script>

<style lang="css" scoped>
@component-namespace aboutLace{
  @component wrapper{
    background: #fff;
  }
  @component content{
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px;
    @descendent left{
    }
    @descendent right{
      max-width: 600px;
      padding-left: 30px;
      line-height: 2;
      @modifier intro{
        p{
          margin-top: 8px;
          &:last-child{
            margin-bottom:20px;
          }
        }
      }
    }
  }
  @component nav{
      margin: 20px;
      color: #999999;
      font-size: 15px;
  }
  @component title-block{
    font-size: 18px;
    display: inline-block;
    line-height: 1;
    vertical-align: bottom;
    @modifier text{
      text-transform: uppercase;
      font-size: 14px;
      display: block;
      font-weight: 100;
      padding-top: 2px;
    }
  }
}
.orange{
  color: orange;
}
i[class*='icon-']{
  padding-right: 6px;
}
</style>
