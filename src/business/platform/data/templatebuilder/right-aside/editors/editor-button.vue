<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    label-width="120px"
    size="mini"
    @submit.native.prevent
  >
    <el-form-item label="按钮名称" required prop="label">
      <el-input v-model="formData.label" placeholder="按钮名称" />
    </el-form-item>
    <el-form-item
      v-if="formData"
      label="按钮编码"
      prop="code"
      required
    >
      <el-input v-model="formData.code" :disabled="formData.button_type !== 'custom' && formData.button_type !== 'sefStartFlow' && formData.button_type !== 'customDetail'" placeholder="按钮编码" />
    </el-form-item>
    <el-form-item label="权限" prop="rights">
      <rights-selector v-model="formData.rights" @remove="removeRight" />
    </el-form-item>
    <el-form-item v-if="type==='function'" label="按钮位置" prop="position">
      <el-radio-group v-model="formData.position">
        <el-radio-button
          v-for="t in positionType"
          :key="t.value"
          :label="t.value"
        >{{ t.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="type==='edit'">
      <template slot="label">
        明细页隐藏<ibps-help content="表单明细页是否隐藏该按钮" />
      </template>
      <el-switch
        v-model="formData.enabledDetail"
        :active-value="'Y'"
        :inactive-value="'N'"
        active-text="显示"
        inactive-text="隐藏"
      />
    </el-form-item>
    <el-form-item label="按钮颜色" prop="style">
      <el-select v-model="formData.style" placeholder="按钮颜色">
        <el-option
          v-for="item in colorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <el-link :underline="false" :type="item.value " class="ibps-fl">{{ item.label }}</el-link>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="按钮图标" prop="icon">
      <ibps-icon-select v-model="formData.icon" icon="el-icon-search" />
    </el-form-item>
    <el-form-item v-if="formData && formData.button_type === 'export'" label="导出字段" prop="icon">
      <el-button size="small" type="primary" @click="handleExportFields">设置导出字段</el-button>
    </el-form-item>

    <el-form-item v-if="formData && formData.button_type === 'sefStartFlow'" prop="deflow">
      <label slot="label">
        绑定流程
        <el-tooltip class="item" effect="light" placement="bottom">
          <div slot="content" style="line-height:1.5;">
            先在模板属性绑定表单，此流程定义数据才有！
          </div>
          <i class="ibps-icon-help" />：
        </el-tooltip>
      </label>
      <bpm-def-selector
        v-model="formData.deflow"
        value-key="defKey"
        :form-key="formKey"
        :is-data-template-use="true"
      />
    </el-form-item>

    <el-form-item v-if="formData && formData.button_type === 'customDetail'" prop="detailFormKey">
      <label slot="label">
        绑定详情表单
      </label>
      <form-def-selector
        v-model="formData.detailFormKey"
        rights-type="data"
        type="dataTemplate"
        :toolbar="formToolbar"
        form-type="detail"
        value-key="key"
      />
    </el-form-item>

    <el-form-item v-if="formData && formData.button_type === 'custom'" prop="formKey">
      <label slot="label">
        绑定表单
      </label>
      <form-def-selector
        v-model="formData.formKey"
        rights-type="data"
        type="dataTemplate"
        :toolbar="formToolbar"
        value-key="key"
        data-type="dataRange"
        :data-range="['form','combination']"
      />
    </el-form-item>
    <export-column
      :visible="exportFieldDialogVisible"
      :data="template"
      @callback="handleExportColumn"
      @close="(visible)=>exportFieldDialogVisible=visible"
    />
  </el-form>
</template>
<script>
import { validateRequired, validateKey } from '@/utils/validate'
import { hasPermission } from '@/business/platform/data/constants/buttons'
import BpmDefSelector from '@/business/platform/bpmn/definition/selector'
import RightsSelector from '@/business/platform/rights/config/selector'
import FormDefSelector from '@/business/platform/form/form-def/selector'
import { colorOptions } from '@/business/platform/form/constants/fieldOptions'

import ExportColumn from '../components/export-column'

export default {
  components: {
    RightsSelector,
    BpmDefSelector,
    FormDefSelector,
    ExportColumn
  },
  props: {
    data: {
      type: Object
    },
    template: {
      type: Object
    },
    formKey: String,
    type: {
      type: String,
      default: 'function'
    },
    buttonCodes: {
      type: Array
    }
  },
  data() {
    return {
      colorOptions,
      exportFieldDialogVisible: false,
      formName: 'form',
      formData: {
        style: 'primary'
      },
      rules: {
        label: [{ required: true, message: this.$t('validate.required') }]
      },
      formToolbar: [{
        key: 'rechoose',
        type: 'primary',
        label: '重选'
      }, {
        key: 'remove',
        type: 'danger',
        label: '删除'
      }]
    }
  },
  computed: {
    positionType() {
      const positionType = []
      positionType.push({
        value: 'all',
        label: '所有'
      })
      const buttonType = this.formData.button_type || ''
      if (hasPermission(buttonType, 'toolbar') && this.type === 'function') {
        positionType.push({
          value: 'toolbar',
          label: '仅顶部'
        })
      }

      if (hasPermission(buttonType, 'manage') && this.type === 'function') {
        positionType.push({
          value: 'manage',
          label: '仅管理列'
        })
      }
      if (hasPermission(buttonType, 'search') && this.type === 'function') {
        positionType.push({
          value: 'search',
          label: '仅查询列'
        })
      }

      if (hasPermission(buttonType, 'edit') && this.type === 'edit') {
        positionType.push({
          value: 'edit',
          label: '仅编辑'
        })
      }

      return positionType
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.formData = val
          // 默认设置
          if (this.formData.button_type === 'close' && this.type === 'edit' && !this.formData.enabledDetail) {
            this.$set(this.formData, 'enabledDetail', 'Y')
          }
          const codes = this.buttonCodes || []
          if (this.allowMultiple(this.formData.button_type)) {
            this.rules['code'] = [
              { required: true, message: this.$t('validate.required') },
              { validator: validateRequired, message: this.$t('validate.required') },
              { validator: validateKey },
              { validator: (rule, value, callback) => {
                if (codes.indexOf(value) > -1) {
                  callback(new Error('重复的按钮编码值,请重新输入'))
                  return
                }
                callback()
              } }
            ]
            this.formValidate()
          } else {
            this.rules['code'] = null
          }
          if (this.formData.button_type === 'customDetail') {
            this.rules['detailFormKey'] = [
              { required: true, message: this.$t('validate.required') }
            ]
          }
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.colors = null
    this.formData = null
    this.rules = null
  },
  methods: {
    allowMultiple(type) {
      return type === 'custom' || type === 'sefStartFlow' || type === 'customDetail'
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    // 获取表单数据
    getFormData(callback) {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          callback(this.formData)
        } else {
          callback()
        }
      })
    },
    handleExportFields() {
      this.exportFieldDialogVisible = true
    },
    handleExportColumn(data) {
      this.handleData('export_columns', data)
    },
    handleData(key, value) {
      this.$emit('callback', key, value)
    },
    removeRight(index, item, items) {
      const obj = {}
      if (item.type === 'all') {
        this.formData.rights.splice(index, 1, { type: 'none' })
      }
      if (item.type === 'all' || item.type === 'none') return
      const rightsIdArr = item.rightsId.split(',')
      const rightsNameArr = item.rightsName.split(',')
      rightsIdArr.splice(index, 1)
      rightsNameArr.splice(index, 1)
      obj.type = item.type
      obj.rightsId = rightsIdArr.join(',')
      obj.rightsName = rightsNameArr.join(',')
      this.formData.rights.forEach((r, i) => {
        if (r.type === obj.type) {
          this.formData.rights.splice(i, 1, obj)
        }
      })
    }
  }
}
</script>
