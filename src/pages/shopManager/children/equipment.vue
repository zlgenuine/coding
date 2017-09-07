<template lang="html">
  <div class="equipment">
    <ts-section>
      <div slot="menu">
          <ts-button @click="handleAdd('addForm')" type="primary">添加设备</ts-button>
      </div>
      <!--  -->
      <div v-if="!hasEquipment" class="equipment-notice">
        <p>您还未添加公司设备信息，点击右上角按钮可添加设备信息</p>
        <p>温馨提示：您添加的设备信息将同步至平台厂家设备库</p>
      </div>
      <div v-else class="equipment-list">
        <ts-table :data="Equipment.list">
          <ts-column slot data-key="machineType" width="40%" align="center" name="设备疏节"></ts-column>
          <ts-column slot data-key="machineNo" width="40%" align="center" name="设备针数"></ts-column>
          <ts-column slot  align="center"  name="操作" action="[{'text':'修改','func':'hanleEdit'},{'text':'删除','func':'handleDel'}]"></ts-column>
        </ts-table>
        <div slot="footer" class="equipment-list-footer">
          一共有{{Equipment.totalNum}}台设备
          <ts-pagination
          class="equipment-list-footer--pagation"
          @change="handleChangeCurrent"
          @page-size-change="handleChangePageSize"
          :current="Equipment.pageNO"
          :total="Equipment.totalPage">
          </ts-pagination>
        </div>
      </div>
    </ts-section>
    <!-- 对话框 -->
    <ts-dialog v-model="Dialog.add" title="添加公司车间设备信息" width="30%" @confirm="hanleVisitStore" @close="handleReset('addForm')">
      <ts-form :model="addForm" :rules="rules" ref="addForm" inline label-width="100px">
        <ts-form-item label="设备疏节" prop="machineType">
          <ts-input v-model="addForm.machineType"></ts-input>
        </ts-form-item>
        <ts-form-item label="设备针数" prop="machineNo">
          <ts-input v-model="addForm.machineNo"></ts-input>
        </ts-form-item>
      </ts-form>
        <div class="equipment-dialog--footer">
          <ts-button @click="handleSave('addForm')" type="primary">保存</ts-button>
          <ts-button @click="handleSaveAndAdd('addForm')" type="primary" v-if="Dialog.status==='create'">保存并继续添加</ts-button>
        </div>
        <div slot="footer"></div>
    </ts-dialog>
  </div>
</template>

<script>
import {
  deleteDevice,
  addDevice,
  getOwnDeviceList,
  updateDevice
} from '@/common/api/api';
export default {
  data() {
    return {
      // 请求参数
      Params: {
        pageNo: 0,
        pageSize: 10
      },
      addForm: {
        machineNo: '',
        machineType: ''
      },
      rules: {
        machineNo: {
          message: '请输入设备针数',
          required: true
        },
        machineType: {
          message: '请输入设备疏节',
          required: true
        }
      },
      // list
      Equipment: {},
      Dialog: {
        status: 'create',
        add: false
      }
    };
  },
  created() {
    this.Params.pageNo = 1;
  },
  watch: {
    Params: {
      async handler(val) {
        this.Equipment = (await (getOwnDeviceList(val))).data.data;
      },
      deep: true
    },
    Equipment: {
      handler(val) {
        if (!val.list.length && this.Params.pageNo >= 0) {
          this.Params.pageNo--;
        }
      },
      deep: true
    }
  },
  computed: {
    hasEquipment() {
      if (this.Equipment.list) {
        return this.Equipment.list.length > 0;
      }
    }
  },
  methods: {
    // 打开添加对话框
    handleAdd(addForm) {
      this.Dialog.status = 'create';
      this.Dialog.add = true;
      if (this.$refs[addForm]) {
        this.addForm = {
          machineNo: '',
          machineType: ''
        };
      }
    },
    // 修改
    hanleEdit(item) {
      this.Dialog.add = true;
      this.Dialog.status = 'edit';
      this.addForm = JSON.parse(JSON.stringify(item));
    },
    handleDel(item) {
      this.$messagebox.confirm('确认要删除该设备吗？').then(async() => {
        await deleteDevice({
          ids: [item.id]
        });
        this.Equipment = (await (getOwnDeviceList(this.Params))).data.data;
      });
    },
    submitForm(formName, callback) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          callback();
        } else {
          return false;
        }
      });
    },
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
    handleSave(formName) {
      this.submitForm(formName, async() => {
        let res = this.Dialog.status === 'create' ? await addDevice(this.addForm) : await updateDevice(this.addForm = Object.assign({}, this.addForm, {
          id: this.addForm.id
        }));
        if (!res.data.code) {
          this.Dialog.add = false;
          this.Equipment = (await (getOwnDeviceList(this.Params))).data.data;
        }
      });
    },
    handleSaveAndAdd(formName) {
      this.submitForm(formName, async() => {
        let res = await addDevice(this.addForm);
        if (!res.data.code) {
          this.$refs[formName].resetFields();
          this.Equipment = (await (getOwnDeviceList(this.Params))).data.data;
        }
      });
    },
    // ======
    // 分页处理
    async handleChangeCurrent(current) {
      this.Params.pageNo = current;
    },
    async handleChangePageSize(size) {
      this.Params.pageSize = size;
    }
    // =========
  }
};
</script>

<style lang="css" scoped>
@component-namespace equipment{
  @component list{
    @descendent footer{
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }
  }
  @component notice{
    text-align: center;
    line-height: 40px;
    p{
      &:nth-of-type(1){
        font-size: 18px;
        font-weight: 700;
      }
      &:nth-of-type(2){
        color:#999;
      }
    }
  }
  @component dialog{
    @modifier footer{
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
