<template>
    <div class="authCompany">
        <div class="authCompanyList">
          <template v-for="item in dictTree">
            <div class="title"><span>{{item.label}}</span></div>
            <!--列表数据大于4条才开始滑动-->
            <div :class="{'animated-left': list[item.k].length > 4}" v-if="!item.showPage">
              <auth-company-item :list="list[item.k]"></auth-company-item>
            </div>

            <div v-else>
              <auth-company-item :list="pageList" :wrap="true"></auth-company-item>
            </div>

            <!--<ts-pagination type="page" :total="NewEntryStore.totalNum" :current="NewEntryStore.pageNO" :pageSize="NewEntryStore.pageSize" class="entryList-pagination page" @change="handleChangePage"></ts-pagination>-->


            <div class="seeMore" v-if="list[item.k].length > 4" @click="seeMore(item)">
              <img src="/static/images/see_more.png" v-if="!item.showPage" alt="">
              <img src="/static/images/up_arrow.png"  v-else alt="">
               <p>{{!item.showPage ? '查看更多' : '收起'}}</p>
            </div>


          </template>
        </div>
    </div>
</template>

<script>
  import {findCompanyMain} from '@/common/api/api';
  import {
    mapGetters
  } from 'vuex';
  import AuthCompanyItem from "./authCompanyItem";
  export default {
    components: {AuthCompanyItem},
    name: "auth-company",
    data () {
      return {
        list: {
          fabric: [],
          bigBorder: [],
          smallBorder: [],
          eyelash: []
        },
        params: {
          mainType: '100010',
          pageNo: 1,
          pageSize: 20
        },
        dictTree: [
          {label: '面料', value: '100010', k: 'fabric', showPage: false},
          {label: '大边', value: '100011', k: 'bigBorder', showPage: false},
          {label: '小边', value: '100012', k: 'smallBorder', showPage: false},
          {label: '睫毛', value: '100013', k: 'eyelash', showPage: false},
        ],
        pageList: [] // 展示点击查看更多时的公司列表
      };
    },
    computed: {
      // ...mapGetters(['dicTree'])
    },
    methods: {
      seeMore (item) {
        // 点击当前的按钮取反，其他的全部置为false
        this.dictTree.map(dict => {
          if (dict.value === item.value) {
            dict.showPage = !dict.showPage;
          } else {
            dict.showPage = false;
          }
        });

        this.getPageListData(Object.assign({},{mainType: item.value, pageNo: 1, pageSize: 8}));
      },
      async getPageListData (params) {
        this.pageList = (await findCompanyMain(params)).data.data;
      },
      async getData (params) {
        let type = {
          '100010': 'fabric', //面料
          '100011': 'bigBorder', //大边
          '100012': 'smallBorder', //小边
          '100013': 'eyelash' // 睫毛
        };
        let {data: {data}} = await findCompanyMain(params);
        this.list[type[params.mainType]] = data;

        // test
        // if (params.mainType === '100012' || params.mainType === '100013') {
        //   this.list[type[params.mainType]] =  this.list[type[params.mainType]].concat(this.list[type[params.mainType]]);
        // }

        if (this.list[type[params.mainType]].length > 4) { //当数据大于4条时才会出现滑动
          this.list[type[params.mainType]] = this.addVirtualData(this.list[type[params.mainType]]); // 不足数据时添加重复数据滚动
        }
      },
      // 递归添加数据
      addVirtualData (data) {
        if (data.length < 24) {
          data = data.concat(data.slice(0, 20));
          return this.addVirtualData(data);
        } else {
          data = data.slice(0, 24); // 当数据长度大于24时，只截取前面24条数据
          return data;
        }
      }
    },
    mounted () {
      this.getData(Object.assign({}, this.params, {mainType: '100010'}));
      this.getData(Object.assign({}, this.params, {mainType: '100011'}));
      this.getData(Object.assign({}, this.params, {mainType: '100012'}));
      this.getData(Object.assign({}, this.params, {mainType: '100013'}));
    }
  };
</script>

<style scoped lang="scss">
.authCompany{
  margin-top: 10px;
  .authCompanyList{
    .title{
      margin: 4px;
      span{
        border-left: 4px solid #20a0ff;
        padding-left: 8px;
        font-size: 16px;
      }
    }
    .seeMore{
      margin-top: 10px;
      text-align: center;
      color: #20a0ff;
      cursor: pointer;
      font-size: 12px;
      img{
        width: 20px;
      }
    }
  }
  @keyframes roll-left {
    0% {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
    }
    100% {
      transform: translate(-6000px, 0);
      -webkit-transform: translate(-6000px, 0);
    }
  }
  .animated-left {
    -webkit-animation: 60s roll-left linear infinite;
    animation: 60s roll-left linear infinite;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    &:hover {
      -webkit-animation-play-state: paused;
      animation-play-state: paused;
    }
  }
}
</style>
