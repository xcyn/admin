<template>
  <ibps-container type="full" class="relation-page">
    <el-row>
      <el-col v-if="isSuper" :span="24" class="relation-form">
        <el-form ref="form" :model="formData" :rules="rules" inline @submit.native.prevent>
          <el-form-item label="员工：" prop="userId">
            <ibps-employee-selector
              :value="userId"
              :class-name="'relation-employee-dialog'"
              @callback="handleInput"
            />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <div class="deatil">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="下属员工" name="superior">
              <under-list :id="userId" :external-grounp-id="groupId" :identity="RELATION_UNDER" :superior-data="superiorData" :valid="valid" />
            </el-tab-pane>
            <el-tab-pane label="上级领导" name="under">
              <superior-list :id="userId" ref="superior" :identity="RELATION_SUPERIOR" @callback-superior="callbackSuperior" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </ibps-container>
</template>
<script>

import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import SuperiorList from './superior-list'
import UnderList from './under-list'
import Identity from '@/constants/identity'
import { get } from '@/api/platform/org/employee'
export default {
  components: {
    SuperiorList,
    UnderList,
    IbpsEmployeeSelector
  },
  data() {
    return {
      RELATION_SUPERIOR: Identity.IBPS.ORG.RELATION_SUPERIOR,
      RELATION_UNDER: Identity.IBPS.ORG.RELATION_UNDER,
      activeName: 'superior',
      valid: true,
      userId: this.$store.getters.userId,
      formData: {
        userId: ''
      },
      isSuper: this.$store.getters.isSuper,
      superiorData: [],
      groupId: '',
      rules: {
        userId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'formData.userId': {
      handler: function(val, oldVal) {
        if (this.$utils.isEmpty(val)) {
          if (!this.$refs['form']) return
          this.submitForm('form')
        } else {
          if (this.$refs['form']) {
            this.$refs['form'].resetFields()
          }
          this.valid = true
        }
      },
      immediate: true
    },
    userId: {
      handler: function(val, oldVal) {
        this.formData.userId = val
      },
      immediate: true
    }
  },
  mounted() {
    this.$refs['superior'].loadData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.valid = valid
      })
    },
    handleClick(tab, event) {},
    callbackSuperior(data) {
      this.superiorData = data
    },
    handleInput(data) {
      this.userId = data.id
      if (this.$utils.isEmpty(data)) return
      get({
        employeeId: data.id
      }).then(response => {
        this.groupId = response.data.groupID
        // console.log(response.data, response.data.groupID, '~response.data.groupID')
      })
    }
  }
}
</script>
<style lang="scss">
.relation-employee-dialog{
  .el-dialog__body{
    height:  calc(70vh - 200px) !important;
  }
}
.relation-page{
   .ibps-container-full__body{
    padding: 0 !important;
  }
  .relation-form{
    margin-bottom: 0px;
    background: #f5f5f7;
    .el-form-item {
      margin-bottom: 15px;
      margin-left: 20px;
      margin-top: 10px;
    }
    .el-form-item__content{
      width: 250px;
    }
  }
  .deatil{
    padding: 0 5px;
    background: white;
  }
}
</style>
