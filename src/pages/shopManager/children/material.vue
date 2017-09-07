<template>
<ts-section>
  <div slot="title">
    中转仓管理<span class="pot-warning" @click="Material.tip=!Material.tip">!</span>
  </div>
  <div slot="menu">
    <ts-button type="primary" @click="handleNewFolderDialog" v-if="Folder.num>0">新建文件夹</ts-button>
  </div>
  <div v-if="getMaterialList">
    <!-- :data="Material.list" -->
    <ts-grid>
      <ts-grid-item class="material-folder-item" v-for="(product,index) in Folder.list" :key="product">
        <div class="">
          <span class="icon-wenjianjia material-folder--icon">
                <span class="path1 icon-wenjianjia"></span><span class="path2 icon-wenjianjia"></span>
          </span>
          <p class="material-folder-name">{{product.folderName}}</p>
        </div>
        <div class="material-folder-item--menu">
          <ts-button type="primary" class="material-folder-item--button" size="large" @click="handleGotoMaterial(product)">批量上花</ts-button>
          <div class="material-folder-item--text">
            <span @click.stop="handleEditFoloer(product)">修改</span>
            <span @click.stop="handleDelFoloer(product,index)">删除</span>
          </div>
        </div>
      </ts-grid-item>
    </ts-grid>
  </div>
  <div v-else>
    <!-- 顶部tip -->
    <div class="material-tip">
      <p class="material-tip-title">中转仓功能简介：</p>
      <p class="material-tip-content">中转仓是平台推出的线上花型素材管理工具，支持本地花型图片批量上传至对应新建或现有花型素材文件夹，文件夹可自定义名称及花型公共属性的添加，它是您的线上花型管理贴心小管家！</p>
    </div>
    <!-- 空 -->
    <div class="material-empty">
      <p>您的中转仓无文件夹，赶紧新建花型文件夹吧</p>
      <br/>
      <ts-button type="plain" class="material-folder--button" @click="handleNewFolderDialog"><span class="plus">+</span>新建花型文件夹</ts-button>
    </div>
  </div>
  <!-- 对话框----功能说明  -->
  <ts-dialog v-model="Material.tip" title="中转仓功能说明" type="alert" width="40%" alertText="我知道了" @confirm="Material.tip=false">
    <article class="message-phone-dialog">
      中转仓是平台推出的线上花型素材管理工具，支持本地花型图片批量上传至对应新建或现有花型素材文件夹，文件夹可自定义名称及花型公共属性的添加，它是您的线上花型管理贴心小管家！
    </article>
  </ts-dialog>
  <ts-dialog v-model="Material.folder" title="添加中转仓文件夹属性" width="40%" @close="handleCancelFolder" @cancel="handleCancelFolder" @confirm="handleNewFolder('folderForm')">
    <ts-form :model="folderForm" ref="folderForm" :rules="rules" label-width="100px" label-position="left">
      <ts-form-item label="文件夹" prop="folder">
        <ts-input v-model="folderForm.folder" placeholder="建议文件夹名称能体现花型特性，如“压纱板胚布现货库存料”"></ts-input>
      </ts-form-item>
    </ts-form>
  </ts-dialog>
</ts-section>
</template>

<script>
import {
  addOrUpdateTransfer,
  getTransferNum,
  deleteTransfer,
  getTransferList
} from '@/common/api/api';
export default {
  data() {
    return {
      Material: {
        tip: false,
        folder: false
      },
      Folder: {
        id: '',
        num: 1,
        list: []
      },
      status: 'add',
      folderForm: {
        folder: ''
      },
      rules: {
        folder: [{
          required: true,
          message: '请输入文件夹名称',
          trigger: 'blur'
        }, {
          min: 1,
          max: 30,
          message: '文件夹名称最多30个字'
        }]
      }
    };
  },
  computed: {
    getMaterialList() {
      return this.Folder.list.length > 0;
    }
  },
  created() {
    this.indexLoad();
  },
  methods: {
    async indexLoad() {
      this.Folder.num = (await getTransferNum()).data.data;
      this.Folder.list = (await getTransferList()).data.data;
    },
    // 跳转素材库页面
    handleGotoMaterial(item) {
      this.$router.push({
        params: {
          id: item.id
        },
        query: {
          name: item.folderName
        },
        name: 'material'
      });
    },
    // 新增文件夹
    handleNewFolderDialog() {
      this.Material.folder = true;
      this.status = 'add';
    },
    // 取消新增文件夹
    handleCancelFolder() {
      this.Material.folder = false;
      this.folderForm.folder = '';
    },
    // 编辑文件夹
    handleEditFoloer(item) {
      this.Material.folder = true;
      // 获取ID
      this.Folder.id = item.id;
      // 给输入框赋值
      this.folderForm.folder = item.folderName;
      this.status = 'edit';
    },
    // 删除文件夹
    handleDelFoloer(item, index) {
      this.$messagebox.confirm(`确认删除该文件夹？`).then(async(action) => {
        let res = await deleteTransfer({
          id: item.id
        });
        if (!res.data.code) {
          await this.indexLoad();
        }
      });
    },
    // 提交文件夹
    handleNewFolder(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          // 新建文件夹
          let res = await addOrUpdateTransfer({
            id: this.status === 'add' ? null : this.Folder.id,
            folderName: this.folderForm.folder
          });
          if (!res.data.code) {
            await this.handleCancelFolder();
            // 检验还有多少文件夹数量
            await this.indexLoad();
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="css" scoped>
@component-namespace material{
  @component empty{
    display: table;
    margin: 50px auto;
    color: #666;
    text-align: center;
  }
@component folder{
  @modifier icon{
    font-size: 76px;
  }
  @modifier button{
    font-size: 20px;
    height: 41px;
    padding: 0 25px;
    color:#666;
    border-radius: 4px;
    span.plus{
      font-size: 28px;
      line-height: 1;
      padding-right: 5px;
    }
  }
  @descendent name{
    @utils-ellipsis 2;
  }
  @descendent item{
    width: 178px;
    position: relative;
    transition: .8s;
    &:hover{
      .material-folder-item--menu{
        display:block;
      }
    }
    @modifier text{
      display: table;
      position: absolute * 0 0 0;
      table-layout: fixed;
      width: 100%;
      margin: 0 auto;
        span{
          background: rgba(0,0,0,0.5);
          color: #fff;
          display: table-cell;
          width: 50%;
          position: relative;
          height: 30px;
          vertical-align: middle;
          cursor: pointer;
          transition: .8s;
          &:first-child:after{
            content:'';
            position:absolute 0 0 * *;
            height: 100%;
            width: 1px;
            background: #b0b0b0;
          }
          &:hover{
            background: rgba(0,0,0,0.9);
          }
        }
    }
    @modifier button{
      width: 80%;
      position: absolute 50% * * 50%;
      transform: translate(-50%,-50%);
    }
    @modifier menu{
      display: none;
      position: absolute 0 0 0 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.45);
      p{
        margin: 10px auto;
      }
    }
    &:active,&:focus{
      background:rgba(76,147,253,0.15);
    }
  }
}
  @component tip{
    background: #FFF7E3;
    padding: 10px;
    border: 1px solid #f2d794;
    border-radius: 4px;
    @descendent title{
      color: #FF8400;
    }
    @descendent content{
      margin-left: 100px;
    }
  }
}
.pot-warning{
  color: #FF8400;
  position: relative;
  font-size: 14px;
  width: 21px;
  text-align: center;
  display: inline-block;
  vertical-align: 3px;
  cursor: pointer;
  margin-left:4px;
}
.pot-warning:after{
  content:' ';
  border: 1px solid;
  top:5px;
  height: 20px;
  left:0;
  right:0;
  bottom:0;
  border-radius: 50%;
  position: absolute;
  color:#FF8400;
}
</style>
