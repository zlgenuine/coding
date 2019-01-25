<template>
<div>
  <div class="search-wrapper all">
    <slot name="select"></slot>
    <!-- 标签 -->
    <ts-tag shape="square" type="transparent" closable v-if="Pic.show" @close="handleDelPic">
      <div class="search-mask">
        <img :src="Pic.url" width="20" height="20">
        <p @click="handleSearchFromEdit(Pic.url)"><i class="icon-bianji"></i></p>
      </div>
    </ts-tag>
    <!--搜索框-->
    <p class="search-tab" v-if="showTab">
      <span v-for="item in options" :class="{'selected': item.isSelected}" @click="tabSwitch(item)">{{item.name}}</span>
    </p>
    <input type="text" class="search-input" :placeholder="inputPlaceHolder" v-model="Search.val" @focus="handleDelPic" :disabled="search.handleStatus" @keyup.enter="handleSearchText">
    <i class="icon-sousuo search-upload--icon" v-show="!Pic.isUploaded" @click="handleSearchText" v-if="!search.handleStatus"></i>
    <span class="search-close" v-show="Pic.isUploaded" @click="Pic.isUploaded = false">&times;</span>
    <ts-button type="primary" @click="handleUpload" class="search-button" v-show="!Pic.isUploaded" :disabled="search.handleStatus">
      <i class="icon-xiangji"></i>传图搜花
    </ts-button>
  </div>
  <!-- 上传花型  -->
  <div class="search-editPic onepx" v-show="Pic.isUploaded">
    <p class="search-editPic-title">
      <span>搜索历史</span>
      <label style="position:relative">
        <a class="search-editPic-upload--button" @click="handleUpload">
          <i class="icon-shangchuan"></i>
          本地上传
        </a>
      </label>
      <input ref="input" type="file" accept="image/png,image/jpeg" @change="uploadImg" v-show="false">
    </p>
    <ts-grid :data="showPics" emptyText="暂无搜索记录">
      <ts-grid-item style="width:115px" v-for="product in showPics" :key="product" @click="handleChoosePic(product)">
        <ts-image width="60" height="60" :canView="false" disabledHover :src="product">
        </ts-image>
      </ts-grid-item>
    </ts-grid>
    <div class="search-editPic-menu">
      <ts-button type="primary" @click="handleClearHistory">清空记录</ts-button>
      <ts-button type="cancel" @click="Pic.isUploaded=!Pic.isUploaded">关闭</ts-button>
    </div>
  </div>
  <!-- 正在处理 -->

  <!--搜索时显示广告位-->
  <!--v-show="showAdv"-->
  <div class="search_adv_mask" @click="test" ref="mask" v-show="showAdv"></div>

  <!--v-show="search.handleStatus&&!Pic.isUploaded"-->
  <!--v-show="showLoadingStatus"-->
  <div class="search-editPic onepx" v-show="showLoadingStatus">


    <!--<ts-button type="cancel" size="small" class="upload-tip&#45;&#45;button button" @click="handleCanceSearch">取消搜索</ts-button>-->
    <!--<p v-if="!overtime.status" class="upload-tip"> 正在处理中，请稍候...</p>-->
    <!--<ts-progress v-if="!overtime.status" :percentage="search.progress"></ts-progress>-->


    <div class="search_bar_wrap">
      <div style="position: absolute; top: 0; right: 0">
        <ts-button type="cancel" size="small" class="upload-tip&#45;&#45;button button" @click="handleCanceSearch">取消搜索</ts-button>
      </div>

      <ts-progress v-if="!overtime.status" :percentage="search.progress"></ts-progress>
      <p class="search_ing_text">正在百万数据库中为您匹配花型...</p>
    </div>

    <div  v-show="showAdv">
      <div class="search_adv">
        <span class="adv_tip">为您推荐<i></i></span>
        <span class="close_adv" @click="closeAdv">关闭广告<img src="/static/images/close.png"/></span>
        <div class="adv_img_wrap">
          <div class="adv_img" v-for="item in advList">
              <img  :src="item.picUrl" @click="jumpWebsite(item)" />
          </div>
        </div>
      </div>
    </div>


    <p v-if="overtime.status" class="upload-tip">请重新上传图片再次搜索</p>


  </div>
  <div class="search-editPic onepx" v-show="overtime.status">
    <p class="upload-tip">非常抱歉，未能找到结果，请稍后再试</p>
  </div>
  <!-- 裁剪图片 -->
  <cropper-dialog :dialog="Cropper" :imageUrl="Pic.url" @check="handleLookProduct" @change="handleGetResult">
  </cropper-dialog>
</div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import CropperDialog from './searchImgDialog.vue';
import {goto} from '@/common/js/utils.js';
import {searchCount, sysAd} from '@/common/api/api';
export default {
  data() {
    return {
      overtime: {
        status: false,
        interval: null
      },
      Search: {
        picList: [],
        val: ''
      },
      options: [{
          name: '花型',
          value: 1,
          isSelected: true
        },
        {
          name: '设备',
          value: 2,
          isSelected: false
        }
      ],
      searchClass: '',
      // 双向绑定 => 与searchImgDialog中 dialog.show对应
      Cropper: {
        show: false
      },
      Pic: {
        isUploaded: false,
        show: false,
        isEdit: false,
        url: ''
      },
      advList: [],
      showAdv: false,
      t: false
    };
  },
  mounted () {
    if (this.token) {
      this.getAdvList();
    }
  },
  created() {
    // this.freezeDom(this.t);
    this.Search.val = this.$route.query.search;
    if (this.$route.query.searchClass) {
      this.searchClass = this.$route.query.searchClass;
    }
    if (localStorage.getItem('historyItems')) {
      this.Search.picList = localStorage.getItem('historyItems').split('|');
      // 监听localStorage.historyItem的变化
      window.addEventListener('storage', () => {
        this.Search.picList = localStorage.getItem('historyItems').split('|');
      }, false);
    }
  },
  props: {
    globalLook: {
      type: Boolean,
      default: true
    },
    globalSearch: {
      type: Boolean,
      default: true
    },
    inputPlaceHolder: {
      type: String,
      default: '可输入厂名或编号查找'
    },
    showTab: {
      type: Boolean,
      default: true
    }
  },
  beforeDestroy() {
    this.$store.commit('SET_PROGRESS', 1);
    this.handleCanceSearch();
  },
  watch: {
    $route(to, from) {
      if (to.query.search) {
        this.Search.val = to.query.search;
      }
      if (to.query.searchClass) {
        this.searchClass = to.query.searchClass;
      }
    },
    Pic: {
      handler(val) {
        val.show = !!val.url;
      },
      deep: true
    },
    searchClass(val) {
      if (val === 1) {
        this.inputPlaceHolder = '可输入厂名或编号查找';
        this.options.forEach(item => {
          item.isSelected = false;
        });
        this.options[0].isSelected = true;
      }
      if (val === 2) {
        this.inputPlaceHolder = '可输入设备型号进行查找';
        this.options.forEach(item => {
          item.isSelected = false;
        });
        this.options[1].isSelected = true;
      }
    },
    showLoadingStatus (val) {
      this.showAdv = val;
      // this.test(val);
      this.$refs.mask.click();
    }
  },
  computed: {
    ...mapGetters(['dicTree', 'search', 'userInfo', 'isMemeber']),
    // 显示5张最近记录
    showPics() {
      return this.Search.picList.length >= 5 ? this.Search.picList.splice(0, 5) : this.Search.picList;
    },
    showLoadingStatus () {
      return this.search.handleStatus&& !this.Pic.isUploaded;
    },
    token () {
      return this.$store.state.token.token;
    },
  },
  components: {
    CropperDialog
  },
  methods: {
    test () {
      this.freezeDom(this.showAdv);
    },
    //获取广告列表
    async getAdvList () {
      let {data: {data}} =  await sysAd({posId: 2});
      this.advList = data.sysAdList;
    },
    // 关闭广告遮罩层
    closeAdv () {
      this.showAdv = false;
      this.$refs.mask.click();
    },
    // 点击广告跳转
    jumpWebsite (item) {
      if (item.days > 0) { //广告未过期时跳转到对应商家网店，否则跳转到购买广告页面
        goto(`http://${item.details}.lacewang.cn`);
      } else {
        goto(`/personal/loadingAdv`);
      }
    },
    // 搜索类型切换
    tabSwitch(item) {
      this.searchClass = item.value;
    },
    handleSearchProduct() {
      this.Pic.isUploaded = true;
      // this.Search.val = '';
      // this.handleCanceSearch();
    },
    handleSearchFromEdit(url) {
      this.handleChoosePic(url);
      this.handleCanceSearch();
    },
    // 取消搜索
    handleCanceSearch() {
      this.$store.commit('SET_HANDLE_STATUS', false);
      this.$store.commit('SET_PROGRESS', 1);
      this.$store.commit('CLEAR_INTERVAL');
      this.overtime.status = false;
      clearTimeout(this.overtime.interval);
      this.overtime.interval = null;
    },
    // 裁剪---选择分类的时候
    async handleLookProduct(item) {
      this.handleCanceSearch();
      // 把base64设置到local
      try {
        this.historyItems.set(this.Pic.url);
      } catch (e) {
        this.historyItems.clear();
      }
      if (this.globalLook && this.globalSearch) {
        await this.$store.dispatch('getSearchEncoded', {
          category: item.category,
          encoded: item.encoded,
          isOpen: item.isOpen,
          searchType: 300
        });
      } else {
        this.$emit('check', item);
      }
      if (this.search.access) {
        this.overtime.interval = setTimeout(() => {
          this.$store.commit('SET_HANDLE_STATUS', false);
          this.$store.commit('CLEAR_INTERVAL', false);
          this.overtime.status = true;
        }, 60 * 1000);
      }
    },
    // 隐藏上传file控件
    async handleUpload() {
      // 判断登陆用户是否是会员，不是会员则弹出
      if (!this.isMemeber) {
        let {data: {data}} = await searchCount();
        if (data === undefined) return;
        console.log(data);
        this.$messagebox.confirm(`今日剩余${data}次搜花权限`,'开通会员尊享无限次次精准搜花', {
          confirmButtonText: '开通会员',
          cancelButtonText: '稍后再说',
        }).then(action => {
          goto(`/renew?companyId=${this.userInfo.companyId}`);
          return ;
        }).catch(e => {
          if (data > 0) { // 搜索次数大于0时有下一步操作
            this.$refs.input.click();
            this.Search.val = '';
            this.handleCanceSearch();
          } else {
            console.log('没有搜索次数');
          }
        });

      } else {
        this.$refs.input.click();
        this.Search.val = '';
        this.handleCanceSearch();
      }
    },
    // 上传图片
    uploadImg(e) {
      var file = this.$refs.input.files[0];
      if (file.size <= 10 * 1024 * 1024) {
        var reader = new FileReader();
        reader.onload = () => {
          var url = reader.result;
          this.handleChoosePic(url);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      } else {
        this.$toast('请上传一张小于10MB的图片');
      }
    },
    // 历史记录中选择
    handleChoosePic(imgUrl) {
      this.Search.picList.unshift(imgUrl);
      // 裁剪对话框打开
      this.Cropper.show = true;
      this.Pic.url = imgUrl;
      this.Pic.isUploaded = false;
    },
    // 删除图片
    handleDelPic(e) {
      this.Pic.url = '';
      this.Pic.isUploaded = false;
    },
    // 清除历史记录
    handleClearHistory() {
      this.Search.picList = [];
      this.historyItems.clear();
    },
    handleGetResult(val) {
      console.log(val, 'val');
      this.handleCanceSearch();
      if (this.globalLook && this.globalSearch) {
        this.$router.push({
          path: '/search/image',
          query: {
            imgId: val
          }
        });
      } else {
        this.$emit('change', val);
      }
    },
    // 搜索
    handleSearchText() {
      if (this.Search.val) {
        let value = this.Search.val.trim();
        this.$emit('search', value);
        if (this.searchClass === 2) {
          if (this.globalLook) {
            this.$router.push({
              path: '/search/equipment',
              query: {
                search: value,
                searchClass: 2
              }
            });
          }
          return;
        }
        if (this.globalLook) {
          this.$router.push({
            path: '/search/text',
            query: {
              search: value,
              searchType: 2
            }
          });
        } else {
          this.$emit('search-text', value);
        }
      }
    },

    // 当显示加载广告遮罩层时禁止页面滑动
    freezeDom (flag) {
      console.log('页面冻结' + flag);
      this.$nextTick(() => {
        document.getElementsByTagName("body")[0].style.overflow = flag ? 'hidden' : 'auto';
      });
    }
  }
};
</script>
<style scoped>
@component-namespace search {
  @component wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border: 2px solid #4c93fd;
    .search-input {
      margin: 0;
    }
  }
  @component tab {
    position: absolute;
    top: -25px;
    color: #4C93FD;
    font-size: 12px;
    span {
      float: left;
      padding: 5px 12px 0;
      cursor: pointer;
    }
    .selected {
      background: #4C93FD;
      color: #fff;
    }
  }
  @component input {
    height: 32px;
    border: none;
    outline: none;
    flex: 1;
    padding: 0 4px;
    box-sizing: border-box;
    font-size: 14px;
  }
  @component close {
    font-weight: 400;
    padding-right: 9px;
    transform: scale(1.5);
    line-height: 1;
    cursor: pointer;
    color: #4c93fd;
    &:hover {
      color: #1c76fa;
    }
  }
  @component editPic {
    padding: 10px;
    /*position: absolute * 0 * 0;*/
    background: #fff;
    z-index: 10;
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    @descendent menu {
      text-align: right;
      margin-top: 10px;
    }
    @modifier menu {
      text-align: center;
      clear: both;
      padding-top: 16px;
      button {
        margin: 0 4px;
      }
    }
    @descendent upload {
      @modifier button {
        height: 32px;
        line-height: 32px;
        border: none;
        display: inline-block;
        background-color: #fff;
      }
    }
    @descendent title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 6px;
      margin-bottom: 6px;
    }
  }
  @component mask {
    position: relative;
    p {
      position: absolute 0 0 0 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: none;
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &:hover {
      p {
        display: block;
      }
    }
  }
  @component button {
    height: 34px;
    font-size: 18px;
   /* word-spacing: 14px;*/
    position: absolute;
    bottom: 0;
    height: 36px;
    margin: 0;
  }
}

.icon-xiangji {
  font-size: 15px;
  padding: 0 8px;
  /*border-left: 1px solid #eaeaea;*/
  &:before {
    color: #fff;
    transition: .8s;
  }
}

.icon-sousuo {
  font-size: 18px;
  font-weight: 600;
  padding: 0 8px;
  cursor: pointer;
  &:before {
    color: #4c93fd;
    transition: .8s;
  }
  &:hover:before {
    color: #1c76fa;
  }
}

.upload-tip {
  line-height: 50px;
}

.upload-tip--button.button {
  position: absolute * 10px * *;
}
  .search_adv_mask{
    background-color: #fff;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9;
    left: 0;
    top: 140px;
    opacity: 0.9;
  }
  .search_bar_wrap{
    width: 100%;
    position: relative;
    z-index: 10;
    height: 130px;
    /*background-color: #fff;*/
    padding: 40px 0;
    box-sizing: border-box;
    .search_ing_text{
      font-size: 14px;
      text-align: center;
      margin: 10px 0;
    }
  }
  .search_adv{
    width: 100%;
    position: relative;
    z-index: 10;
    .adv_tip{
      font-size: 18px;
      font-weight: bold;
      color: #999999;
      position: relative;
      display: inline-block;
      i{
        width: 4px;
        height: 18px;
        background-color: #ff8400;
        display: inline-block;
        margin-left: 6px;
        position: relative;
        top: 2px;
      }
    }
    .close_adv{
      float: right;
      margin-right: 10px;
      color: #999999;
      cursor: pointer;
    }
    .adv_img_wrap{
       max-height: 550px;
       overflow: auto;
       width: 100%;
      .adv_img{
        margin-top: 14px;
       img{
          width: 100%;
        }
      }
    }
  }
</style>
<style lang="scss">
.search-wrapper.all {
    .ts-input--inner {
        border: none;
        font-size: 14px;
    }
}
</style>
