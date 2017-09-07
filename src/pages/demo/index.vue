<template lang="html">
  <div style="padding:10px">
    <!--
    SWITCH 开关
    * value v-model的值
    * disabled 禁止状态 默认false
    * width 自定义宽度
    * ontext 开的时候显示的文字
    * onValue 开的时候的值 默认：拒绝
    * onColor 开的时候的颜色 默认：允许
    * offColor 关的时候的颜色
    * offtext 关的时候显示的文字
    * offValue 关的时候的值
    * @change 点击后的回调
  -->
  <ts-switch v-model="switchs"></ts-switch>
  <ts-switch v-model="switchs" :width="120" onText="可以点击" offText="不可以点击"></ts-switch>
  <ts-switch v-model="switchq" onColor="#52d468" offColor="#d1d1d1" :offValue="34" :onValue="12" @change="handleChange"></ts-switch>
    <!--
     IMAGE
     canView 是否能预览
     disabledHover 鼠标移上会有放大效果 默认有
   -->
   <p>Image</p>
    <ts-image width="140" height="140" src="https://mmbiz.qpic.cn/mmbiz_jpg/pTxYQ3LrjJqNbeMibrE7H7o0HsVcndRiaPcNJZWTcCcVHZv9Rsza3hibiaib3qY7nWUJ0Aibnsib5Gicrtmy5IM6l6KnKA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1"></ts-image>
      <ts-image width="140" height="140"  :canView="false" disabledHover src="https://mmbiz.qpic.cn/mmbiz_jpg/pTxYQ3LrjJqNbeMibrE7H7o0HsVcndRiaPcNJZWTcCcVHZv9Rsza3hibiaib3qY7nWUJ0Aibnsib5Gicrtmy5IM6l6KnKA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1"></ts-image>
    <!--
    DATE
    value	String	today	要绑定的日期变量,值为空则日期面板初始化今天
    field	String	""	会给input标签添加name及id
    format	String	'yyyy-mm-dd'	日期格式
    forward	Boolean	false	向前看（只能选择今天及以后）
    backward	Boolean	false	时至今日（只能选择今天之前）
    noToday	Boolean	false	今天不行（不能选今天）
    placeholder	String	""	你懂的
    -->
    <p>date</p>
    <pre>{{date}}</pre>
    <ts-date-picker
      placeholder="选择日期"
      v-model="date"
      backward
    ></ts-date-picker>
    <!--
    BUTTON
    type :plain / primary / default / warning / cancel / text
    -->
    <p>button</p>
    <ts-button type="plain">幽灵按钮</ts-button>
    <ts-button type="primary">基本按钮</ts-button>
    <ts-button type="warning">警告按钮</ts-button>
    <ts-button type="cancel">禁用按钮</ts-button>
    <!-- ==========  -->
    <!--
    数字输入框：InputNumber
      min:最小值，
      max：最大值
      disabled：禁用
      step：步长
      @change 绑定值被改变时触发
   -->
    <br>
    <p>InputNumber</p>
    <pre>{{inputNumber}}</pre>
    <ts-input-num v-model="inputNumber" @change="handleNumberChange" :min="1" :max="20"></ts-input-num>
    <!-- ==========  -->
    <br>
    <p>Input</p>
    <small>单个输入框</small>
    <ts-input v-model="input"></ts-input>
    <small>文本域</small>
    <ts-input v-model="input" type="textarea"></ts-input>
    <small>带远程搜索的输入框</small>
    <ts-input v-model="input" fetchSearch></ts-input>
    <!--
    DIALOG
      title:Dialog 的标题,
      width:Dialog宽度
      @open：Dialog 关闭的回调
      @confirm:点击Dialog确认的时候
    -->
    <br>
    <ts-button type="text" @click="handleOpenDialog">打开对话框</ts-button>
    <ts-dialog title="提示的标题" v-model="dialog" width="30%" @close="handleClose" @confirm="handleConfirm" @cancel="handleCancel">
      这个是一个对话框
    </ts-dialog>
    <!--
    select选择器
    disabled:禁用
    data-val-name 选项值对应的key
    data-key-name 选项值
    options 选项列表
    @change
  -->
    <pre>{{selected}}</pre>
     <ts-select data-key-name="price" data-val-name="address" :options='list' v-model="selected" @change="handleSelectChange"></ts-select>
    <!-- ==========  -->
    <br>
    <p>checkbox</p>
    <!--
     checkbox
     label:选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效）
     disabled:按钮禁用
     @change 当绑定值变化时触发的事件
     @cancel 点击Dialog取消的时候
    -->
    <!-- 1.单个 -->
    <pre>{{checkbox.single}}</pre>
    <ts-checkbox @change="handleCbChange" v-model="checkbox.single" :label="checkbox.data.id">{{checkbox.data.val}}</ts-checkbox>
    <ts-checkbox v-model="checkbox.single" :label="checkbox.data.id" disabled>{{checkbox.data.val}}</ts-checkbox>
    <!-- 2.组 -->
    <pre>{{checkbox.group}}</pre>
    <ts-checkbox-group v-model="checkbox.group">
      <ts-checkbox :label="item.id" v-for="item in checkbox.groupData">{{item.val}}</ts-checkbox>
    </ts-checkbox-group>
    <br>
    <!-- ==========  -->
    <!--
     **ts-form
     model: 表单数据对象
     rules: 表单验证规则
     inline: 行内表单模式
     label-width: 表单域标签的宽度，所有的 form-item 都会继承 form 组件的 labelWidth 的值
     ===
     **ts-form-item
     prop: 在使用 validate、resetFields 方法的情况下，该属性是必填的
     label: 标签文本
    -->
    <ts-form :model="addForm" :rules="rules" ref="addForm" inline label-width="100px">
      <ts-form-item label="刘一飞地址" prop="address">
        <ts-input v-model="addForm.address"></ts-input>
      </ts-form-item>
      <ts-form-item label="刘一飞价格" prop="price">
        <ts-input v-model="addForm.price"></ts-input>
      </ts-form-item>
    </ts-form>
    <ts-button @click="submitForm('addForm')">提交</ts-button>
    <!--
     POPPER
      trigger：触发方式 —— "hover／click"
      placement :出现位置 —— 可选 top / right / left / bottom
    -->
    <ts-popover trigger="hover" :options="{placement: 'right'}">
      <div class="popper">
        这是一个popper
      </div>
      <h1 slot="reference">
        popper
      </h1>
    </ts-popover>
    <!-- ==========  -->
    <!--
    假表格
    -->
<!--  1.有标题头-->
<br>
<p>ts-menu</p>
<ts-menu :prop="list">
  <ts-menu-table v-for="item in list">
    <div slot="header-left">
      最左边
    </div>
    <div slot="header-right">
      最右边
    </div>
    <ts-menu-table-item width="660" style="padding:0">
      <ts-row v-for="i in item.products">
        <ts-col :span="12" style="text-align:left">
          <ts-image width="80" height="80" :src="i.src"></ts-image>
          {{i.id}}
        </ts-col>
        <ts-col :span="6">{{i.price}}</ts-col>
        <ts-col :span="6">{{i.name}}</ts-col>
      </ts-row>
    </ts-menu-table-item>
    <ts-menu-table-item>{{item.address}}</ts-menu-table-item>
    <ts-menu-table-item>{{item.price}}</ts-menu-table-item>
  </ts-menu-table>
</ts-menu>
<br>
<!--  2.有标题头-->
    <ts-menu-table :header="false">
      <ts-menu-table-item width="330">商品</ts-menu-table-item>
      <ts-menu-table-item width="164">大货参考价</ts-menu-table-item>
      <ts-menu-table-item width="166">数量</ts-menu-table-item>
      <ts-menu-table-item>状态</ts-menu-table-item>
      <ts-menu-table-item>商品总价</ts-menu-table-item>
    </ts-menu-table>
    <ts-menu :prop="list">
      <ts-menu-table :header="false" content v-for="item in list">
        <ts-menu-table-item width="660" style="padding:0">
          <ts-row v-for="i in item.products">
            <ts-col :span="12" style="text-align:left">
              <ts-image width="80" height="80" :src="i.src"></ts-image>
              {{i.id}}
            </ts-col>
            <ts-col :span="6">{{i.name}}</ts-col>
            <ts-col :span="6">{{i.price}}</ts-col>
          </ts-row>
        </ts-menu-table-item>
        <ts-menu-table-item>{{item.address}}</ts-menu-table-item>
        <ts-menu-table-item>{{item.price}}</ts-menu-table-item>
      </ts-menu-table>
    </ts-menu>
    <br>
    <p>布局Layout——栅格系统 => 平分24分</p>
    <!-- ==========  -->

    <!--
    布局Layout——栅格系统 => 平分24分
    ts-col======> span：栅格占据的列数
    ts-row======> gutter : 栅格间隔
   -->
   <ts-row>
     <ts-col :span="24">24</ts-col>
   </ts-row>
   <ts-row>
     <ts-col :span="12">12</ts-col>
     <ts-col :span="12">12</ts-col>
   </ts-row>
   <ts-row>
     <ts-col :span="8">8</ts-col>
     <ts-col :span="8">8</ts-col>
     <ts-col :span="8">8</ts-col>
   </ts-row>
   <ts-row :gutter="20">
     <ts-col :span="8">8</ts-col>
     <ts-col :span="8">8</ts-col>
     <ts-col :span="8">8</ts-col>
   </ts-row>
   <br>
   <p>navbar</p>
   <pre>{{navbarSelected}}</pre>
   <!--
   Navbar
   bordered ：带边框
   @change 切换触发的事件
   -->
   <ts-navbar v-model="navbarSelected" bordered @change="handleNavbar">
     <ts-tab-item id="1">订单信息</ts-tab-item>
     <ts-tab-item id="2">订单追踪</ts-tab-item>
   </ts-navbar>
   <ts-tab-container v-model="navbarSelected" bordered>
     <ts-tab-container-item id="1">
       这是个订单信息
     </ts-tab-container-item>
     <ts-tab-container-item id="2">
       这是个订单追踪
     </ts-tab-container-item>
   </ts-tab-container>
  </div>

</template>

<script>
export default {
  data() {
    return {
      switchs: true,
      switchq: 34,
      date: '2016-12-12',
      input: '',
      navbarSelected: '1',
      addForm: {
        address: '',
        price: ''
      },
      rules: {
        address: [{
          required: true,
          message: '刘一飞要输入地址信息'
        }],
        price: [{
          pattern: /^[0-9]*[1-9][0-9]*$/,
          message: '刘一飞要输入地址信息'
        }]
      },
      selected: '1',
      inputNumber: 3,
      list: [{
        price: 100001,
        address: '南沙1',
        products: [{
          id: 101,
          name: '商品1',
          price: '100'
        }, {
          id: 102,
          name: 'store2',
          price: '200'
        }]
      }, {
        price: 100002,
        address: '南沙2',
        products: [{
          id: 101,
          name: '商品1',
          price: '100'
        }, {
          id: 102,
          name: 'store2',
          price: '200'
        }]
      }],
      dialog: false,
      checkbox: {
        single: false,
        group: [],
        data: {
          id: 1,
          val: '刘一飞'
        },
        groupData: [{
          id: 1,
          val: '刘一飞'
        }, {
          id: 2,
          val: '刘二飞'
        }]
      }
    };
  },
  methods: {
    // SWITCH 开关
    handleChange(e) {
      console.log(e);
    },
    /**
     * 对话框
     */
    handleOpenDialog() {
      this.dialog = true;
    },
    // Dialog 关闭的回调 => 当dialog为false的时候，和点击外部自动隐藏的时候
    handleClose() {
      this.dialog = false;
      alert('Dialog 关闭的回调 ');
    },
    // 点击Dialog确认的时候
    handleConfirm() {
      this.dialog = false;
      alert('点击Dialog确认的时候');
    },
    // 点击Dialog取消的时候
    handleCancel() {
      this.dialog = false;
      alert('点击Dialog取消的时候');
    },
    /**
     * checkbox
     */
    // 当绑定值变化时触发的事件
    handleCbChange(e) {
      console.log(e);
    },
    /**
     * InputNumber
     */
    // InputNumber绑定值被改变时触发
    handleNumberChange(e) {
      console.log(e);
    },
    /**
     * Select
     */
    handleSelectChange(e) {
      console.log(e);
    },
    /**
     * Form
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /**
     * Navbar
     */
    handleNavbar(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="css">
</style>
