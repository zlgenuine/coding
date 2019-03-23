<template>
    <div class="supplier">
      <el-dialog
        title="供应资料"
        width="30%"
        :before-close="handleClose"
        :visible.sync="supplierDialog">
          <div class="content">
            <div class="left">
              <!--<div class="treeHeader" :class="{'el-icon-caret-right':!show,'el-icon-caret-bottom':show}" @click="show=!show">供应资料</div>-->
              <!--<ul :class="{'open':show}" v-if="show">-->
                <!--<li>供应商名称编号</li>-->
                <!--<li>供应商名称编号</li>-->
                <!--<li>供应商名称编号</li>-->
              <!--</ul>-->
              <div class="leftTitle">{{listData.productNo}}的供应资料</div>
              <el-tree :data="supplierData.data" :props="defaultProps" class="title" @node-click="handleNodeClick" :highlight-current=show></el-tree>
            </div>
            <div class="right">
                <div class="title">供应花型资料</div>
              <ts-form :model="data" :rules="rules" ref="addPatternForm" label-width="80px" label-position="left">
                <ts-form-item label="花型编号：" prop="productNo">
                  <ts-input class="add-input" v-model="data.productNo" :maxlength="10"
                            size="small" placeholder="请输入花型编号"></ts-input>
                </ts-form-item>
                <ts-form-item label="成 分：" prop="ingredientList">
                  <!--<ts-radio-group bordered v-model="data.ingredient">-->
                    <!--<div class="add-radio" v-for="item in ingredientList">-->
                      <!--<ts-radio :label="item.ingredientName" :key="item.id">-->
                                  <!--<span @keydown="handlePreventInput">-->
                                      <!--{{item.ingredientName}}-->
                                  <!--</span>-->
                      <!--</ts-radio>-->
                    <!--</div>-->
                  <!--</ts-radio-group>-->
                  <el-checkbox-group v-model="data.ingredientList"  size="small">
                    <el-checkbox-button v-for="item in ingredientList" :label="item.id" :key="item.id">{{item.ingredientName}}</el-checkbox-button>
                  </el-checkbox-group>
                </ts-form-item>
                <ts-form-item label="幅宽：" prop="width">
                  <ts-input v-model="data.width" :maxlength='10' placeholder="请输入幅宽">
                    <span slot="append">CM</span>
                  </ts-input>
                </ts-form-item>
                <ts-form-item label="花高：" prop="height">
                  <ts-input v-model="data.height" :maxlength='10' placeholder="请输入花高">
                    <span slot="append">CM</span>
                  </ts-input>
                </ts-form-item>
                <ts-form-item label="价格：" prop="price">
                  <ts-input v-model="data.price" style="width:50%" :maxlength='9'
                            placeholder="请输入单价"></ts-input>
                  <ts-select style="width:49%" data-key-name="name" data-val-name="dicValue"
                             placeholder="选择单位" :options='CopyDICTUnit'
                             v-model="priceUnit"></ts-select>
                </ts-form-item>
                <ts-form-item label="供应商：" prop="supplier">
                  <ts-input class="add-input" v-model="data.supplier" :maxlength="10"
                            size="small" placeholder="请输入供应商"></ts-input>
                </ts-form-item>
                <ts-form-item label="联系方式：" prop="contact">
                  <ts-input class="add-input" v-model="data.contact" :maxlength="10"
                            size="small" placeholder="请输入联系方式"></ts-input>
                </ts-form-item>
                <ts-form-item label="备注：" prop="remark">
                  <ts-input class="add-input" v-model="data.remark" type="textarea"
                            size="small" placeholder="请输入备注"></ts-input>
                </ts-form-item>
              </ts-form>
              <div class="btn">
                <ts-button type="primary" @click="add">新增</ts-button>
                <ts-button type="primary" @click="save('addPatternForm')">保存</ts-button>
                <ts-button type="primary" @click="del" >删除</ts-button>
              </div>
            </div>
          </div>
      </el-dialog>
    </div>
</template>

<script>
  import {
    supplierDetail,
    supplierEdit,
    ingredientList,
    supplierDel,
    supplierAdd
  } from '@/common/api/api';
  import Toast from '@/components/common/toast/toast';
  export default {
    name: "supplier",
    props:{
      supplierDialog:{
        default:false,
        type:Boolean
      },
      listData:{
        type:Object
      },
      supplierData:{
        type:Boolean
      }
    },
    data(){
      return{
        data:{
          companyId: '',
          contact: '',
          createdate: '',
          height: '',
          ingredientList:[],
          ingredient: '',
          pageNo: '',
          pageSize: '',
          price: '',
          productId: '',
          productNo: '',
          remark: '',
          status: '',
          supplier: '',
          unit: '',
          width: '',
        },
        show:false,
        priceUnit:'',
        currentId:'',
        ingredientList:[],
        addPatternForm:{
          ingredient:'',
          produceCompanyName:''
        },
        CopyDICTUnit:['元/公斤','元/码','元/条'],
        rules:{
          supplier:[{
            required: true,
            message: '请输入供应商'
          }]
        }

      };
    },
    created(){
      ingredientList()
        .then(({data})=>{
          this.ingredientList=data.data;
          this.data.unit=400011;
        });
    },
    methods:{
      handleNodeClick(val) {
        if(this.currentId===val.id){
          return;
        }else{
          supplierDetail(val.id)
            .then(({data})=>{
              this.data=data.data;
              this.show=true;
              this.currentId=val.id;
            });
        }

      },
      handleClose(){
       this.$emit('closeDialog');
      },
      save(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data=Object.assign({},this.data);
            data.ingredient=data.ingredientList.join(',');
            if(this.data.id){
              supplierEdit(data)
                .then(({data})=>{
                });
            }else{
              data.productId=this.listData.id;
              supplierAdd(data)
                .then(({data})=>{
                  if(!data.code){
                    this.$emit('refreshList',true);
                    this.add();
                  }
                });
            };
          } else {
            return false;
          }
        });
      },
      add(){
        this.show=false;
        for(let key in this.data){
          if(key==='ingredientList'){
            this.$set(this.data,key,[]);
          }else{
            this.$set(this.data,key,'');
          }
        };
      },
      del(){
        if(this.data.id){
          supplierDel(this.data.id)
            .then(({data})=>{
              if(!data.code){
                this.$emit('refreshList');
                this.add();
              }
            });
        }else{
          Toast({type: 'error', message: '请选择供应商'});
        }
      }
    },
    watch:{
      'priceUnit'(val){
        let units=[{label:'元/公斤',id:400011},{label:'元/码',id:400010},{label:'元/条',id:400012}];
        for(let i of units){
          if(val===i.label){
            this.$set(this.data,'unit',i.id);
            break;
          };
        };
      },
      'data.unit'(val){
        if(val===400011){
          this.priceUnit='元/公斤';
        }else if(val===400010){
          this.priceUnit='元/码';
        }else if(val===400012){
          this.priceUnit='元/条';
        }else{
          this.priceUnit='元/公斤';
        }
      },
      supplierDialog(val){
        if(!val){
          this.add();
        }
      }
    }
  };
</script>

<style >
  .supplier .ts-radio{
    margin-right: 10px;
  }
 .supplier .el-dialog__header{
   padding:10px 20px;
   background-color: #efefef;
 }
 .supplier .el-dialog__body{
   padding: 10px 20px;
 }
 .supplier .content{
   white-space: nowrap;
 }
  .supplier .content>div{
    display: inline-block;
    vertical-align: top;
    height:600px;
    box-sizing: border-box;
  }
 .supplier .content .left{
   width: 38%;
   margin-right: 2%;
   border: 1px solid #20a0ff;
   padding: 15px;
 }
 .supplier .el-tree{
   border: none;
 }
 .supplier .left .leftTitle{
   color: #20a0ff;
   font-size: 16px;
 }
 .supplier .el-checkbox-button:first-child .el-checkbox-button__inner{
   border-radius: 0;
 }
 .supplier .el-checkbox-button:last-child .el-checkbox-button__inner{
   border-radius: 0;
 }
  .supplier .el-checkbox-button__inner{
    margin:0 20px 5px 0;
    border:1px solid #bfcbd9;
  }
 .supplier .title>.el-tree-node>.el-tree-node__content .el-tree-node__label{
   /*color: #20a0ff;*/
   font-size: 12px;
 }
  .supplier .el-checkbox-group{
    /*white-space: initial;*/
  }
 /*.supplier .title.el-tree--highlight-current>.el-tree-node.is-current>.el-tree-node__content{*/
   /*background-color: #fff;*/
 /*}*/
 /*.supplier .content .left ul{*/
   /*padding-left: 13px;*/
   /*height: 0;*/

 /*}*/
 /*.supplier .content .left ul.open{*/
   /*display: block;*/
   /*height: auto;*/
 /*}*/
 /*.supplier .content .left ul li{*/
   /*cursor: pointer;*/
   /*color: #000;*/
 /*}*/
 .supplier .content .right{
   position: relative;
   width: 60%;
   border: 1px solid #20a0ff;
   padding: 20px;
 }
  .supplier .treeHeader{
    color: #20a0ff;
    cursor: pointer;
  }
 .supplier .content .right .title{
   color: #20a0ff;
   font-weight: 700;
   position: absolute;
   padding: 0 20px;
   top:-10px ;
   left: 40px;
   background-color: #fff;
 }
 .supplier .content .right .add-radio{
   display: inline-block;
 }
 .supplier .ts-form-item--content{
   width:65%;
 }
 .supplier .ts-input{
   vertical-align: top;
   margin-top: 5px;

 }
 .supplier .ts-input--inner{
   height: 26px;
 }
 .supplier .ts-select-toggle{
   min-height: 26px;
   line-height: 26px;
   margin-top: 5px;
 }
  .supplier .btn{
    /*margin-top:55px;*/
    /*white-space: initial;*/
  }
 .supplier .ts-button--normal{
   margin: 0 10px;
 }
  .supplier .el-dialog--small{
    width: 879px;
  }
</style>
