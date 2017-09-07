<template lang="html">
  <ts-section  v-loading.body="loading" element-loading-text="正在上传中">
    <div slot="title">
      {{$route.query.name}}
    </div>
    <div slot="menu">
      <label v-if="picNum>0">
          <i class="icon-fangda material-add--icon"></i>
          <ts-aliupload fileType="2" @begin="handleUploadPhoto" id="addMaterial" multiple @doUpload="uploadImg"></ts-aliupload>
      </label>
      <ts-button :type="Edit.status?'cancel':'primary'" :class="Edit.status?'':'button-blue'" @click="Edit.status=!Edit.status">{{Edit.text}}</ts-button>
    </div>
    <p class="material-empty" v-if="getalbumPicsList<=0">该文件夹暂无花型图片，点击页面右上角&nbsp;<i class="icon-fangda"></i>&nbsp;添加本地花型图片</p>
    <!-- checkbox-group控制 -->
    <ts-checkbox-group v-model="chooseImg.list" class="material-img">
      <span v-for="item in albumPicsList.list" class="material-img-wrapper">
        <div class="material-img-container">
          <!-- 多选  -->
          <ts-checkbox v-show="Edit.status" :label="item.id" class="material-img-checkbox">{{item.text}}</ts-checkbox>
          <!-- 图片 -->
          <ts-image type="local" :src="item.picUrl" width="160" height="160" :key="item.id"></ts-image>
          <!-- “入仓”提示 -->
          <span class="material-img-tip" v-show="!Edit.status" @click="handleGotoWarehouseAdd(item)">
            <i class="logo icon-dangkou"></i>
              入仓
          </span>
        </div>
        <span class="material-img-title">{{item.picName}}</span>
      </span>
    </ts-checkbox-group>
    <div slot="footer" class="material-footer">
      <ts-button type="primary" :disabled="chooseImg.status" v-if="Edit.status"  @click="handleShowDialog">删除</ts-button>
      <ts-checkbox @change='handleChooseAll' v-if="Edit.status" v-model="checkAll" style="margin-left:10px">全选</ts-checkbox>
      <ts-pagination
      class="material-footer--pagation"
      @change="handleChangeCurrent"
      @page-size-change="handleChangePageSize"
      :current="albumPicsList.pageNO"
      :total="albumPicsList.totalPage">
      </ts-pagination>
    </div>
    <!--  对话框 -->
    <ts-dialog v-model="ConfirmDialog.show" width="30%" title="提示" @confirm="handleDelAlbumPic" @cancel="handleCancelDelMaterial" class="material-dialog">
      <p class="material-dialog--title">确认将选中花型素材删除？</p>
      <p><ts-radio @change.native="handleNoShowDialog"  type="origin" v-model="ConfirmDialog.noShowDialog" label="0"><span class="material-dialog--tip">不再提示<i>(素材相关数据删除后无法恢复)</i></span></ts-radio></p>
    </ts-dialog>
  </ts-section>
</template>

<script>
import {
  deleteTransferPic,
  leadInTransferPic,
  getTransferPics,
  getTransferNum
} from '@/common/api/api';
export default {
  data() {
    return {
      loading: false,
      albumPicsList: {},
      // 图片数量
      picNum: '',
      // 传的参数
      Params: {
        pageNo: 1,
        pageSize: 10,
        id: ''
      },
      checkAll: '',
      // 图片的操作
      chooseImg: {
        list: [], // 选中的图片
        status: true // 能否删除的状态
      },
      // 对话框
      ConfirmDialog: {
        noShowDialog: false,
        show: false,
        id: []
      },
      // cookie
      Cookie: {
        key: 'showDelMaterialDialog',
        value: 1,
        day: 7
      },
      // 编辑状态
      Edit: {
        text: '编辑',
        status: false
      }
    };
  },
  watch: {
    Edit: {
      handler(val) {
        val.text = val.status ? '取消' : '编辑';
      },
      deep: true
    },
    albumPicsList: {
      handler(val) {
        if (val.list.length === 0 && this.Params.pageNo > 1) {
          this.Params.pageNo--;
        }
      },
      deep: true
    },
    // 参数
    Params: {
      async handler(val) {
        this.indexLoad();
      },
      deep: true
    },
    chooseImg: {
      handler(val) {
        val.status = val.list.length <= 0;
      },
      deep: true
    }
  },
  computed: {
    // 获取相册相片的数量
    getalbumPicsList() {
      if (this.albumPicsList.list) {
        return this.albumPicsList.list.length;
      }
    }
  },
  created() {
    // 获取ID
    this.Params.id = this.$route.params.id;
    // 默认创建一个cookie
    !this.cookie.get(this.Cookie.key) ? this.cookie.set(this.Cookie.key, this.Cookie.value, this.Cookie.day, '/') : '';
  },
  methods: {
    async indexLoad() {
      this.checkAll = false;
      this.chooseImg.list = [];
      // 获取相册数据
      this.albumPicsList = (await getTransferPics(this.Params)).data.data;
      // 校验数量
      this.picNum = (await getTransferNum({
        id: this.$route.params.id
      })).data.data;
    },
    handleUploadPhoto() {
      this.loading = true;
    },
    // 全选
    handleChooseAll(event) {
      this.chooseImg.list = event.target.checked ? this.albumPicsList.list.map(item => item.id) : [];
    },
    handleGotoWarehouseAdd(item) {
      let picInfo = Object.assign({}, item, {
        folder: this.$route.query.name
      });
      sessionStorage['warehouse-pic'] = JSON.stringify(picInfo);
      this.$router.push({
        path: '/warehouseManage/addwarehouse',
        query: {
          status: 'rucang'
        }
      });
    },
    // 分页处理
    // =========
    async handleChangeCurrent(current) {
      this.Params.pageNo = current;
    },
    async handleChangePageSize(size) {
      this.Params.pageSize = size;
    },
    // ========
    // 删除所选素材
    async handleDelAlbumPic() {
      await deleteTransferPic({
        ids: this.chooseImg.list.toString()
      });
      // 如果全选 就要回到上一页
      this.chooseImg.list = [];
      this.ConfirmDialog.show = false;
      this.indexLoad();
    },
    // 点击“删除”=>判断cookie是否显示
    async handleShowDialog() {
      if (this.cookie.get(this.Cookie.key) === '1') {
        this.ConfirmDialog.show = true;
      } else {
        this.handleDelAlbumPic();
      }
    },
    // 取消删除
    handleCancelDelMaterial() {
      this.ConfirmDialog.show = false;
      this.cookie.set(this.Cookie.key, this.Cookie.value, this.Cookie.day, '/');
    },
    // 设置cookie
    handleNoShowDialog(e) {
      this.cookie.set(this.Cookie.key, e, this.Cookie.day, '/');
    },
    async uploadImg(picObj) {
      this.Params.pageNo = 1;
      let arr = picObj.map(item => {
        return {
          picName: item.name,
          picUrl: item.storeAs
        };
      });
      await leadInTransferPic({
        id: this.$route.params.id,
        pics: arr
      });
      await this.indexLoad();
      this.loading = false;
    }
  }
};
</script>

<style lang="css" scoped>
:root{
  --material-img-tip-height: 28px;
  --material-img-tip-height: 28px;
  --material-img-tip-bg: rgba(0,0,0,0.4);
  --material-img-tip-text-color: #fff;
  --material-add-icon-hover-color: #4c93fd;
  --material-img-checkbox-position: 10px;
}
@component-namespace material{
  @component footer{
    display: flex;
    align-items: center;
    @modifier pagation{
      flex:1;
      text-align: right;
    }
  }
  @component add{
    @modifier icon{
      font-size: 30px;
    vertical-align: middle;
    cursor: pointer;
    margin: 4px;
    &:hover:before{
      color:var(--material-add-icon-hover-color);
    }
    }
  }
  @component dialog{
    p{
      text-align: center;
    }
    @modifier title{
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    @modifier tip{
      font-size: 14px;
      i{
        font-size: smaller;
        color: #3F3F3F;
      }
    }
  }
  @component empty{
    display: table;
    margin: 20px auto;
    color: #666;
  }
  @component img{
    display: flex;
    flex-wrap: wrap;
    @descendent wrapper{
      margin: 0 18px 18px 0;
      display: inline-block;
    }
    @descendent container{
      position: relative;
      &:hover{
        .material-img-tip{
          display:block;
        }
      }
    }
    @descendent checkbox{
      position: absolute var(--material-img-checkbox-position) * * var(--material-img-checkbox-position);
    }
    @descendent title{
      max-width: 150px;
      color: #666;
      font-size: 13px;
      margin: 0 auto;
      text-align: center;
      word-break: break-all;
      @utils-ellipsis 2;
    }
    @descendent tip{
      position: absolute * 0 0 0;
      display: inline-block;
      height: var(--material-img-tip-height);
      line-height: var(--material-img-tip-height);
      background: var(--material-img-tip-bg);
      color: var(--material-img-tip-text-color);
      display: none;
      cursor: pointer;
      text-align: center;
    }
  }
}
.icon-dangkou{
  &:before{
    color:#fff;
  }
}
</style>
