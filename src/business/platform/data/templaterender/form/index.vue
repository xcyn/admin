<template>
  <div
    v-loading.fullscreen.lock="loading"
    :element-loading-text="$t('common.loading')"
  >
    <!---在线表单--->
    <formrender
      v-if="formDef"
      ref="formrender"
      :form-def="formDef"
      :buttons="buttons"
      :data="formData"
      :params="formParams"
      :readonly="readonly"
      :button-priority="buttonPriority"
      :buttons-position="buttonsPosition"
      :mode="mode"
      :offset-top="offsetTop"
      :offset-bottom="offsetBottom"
      @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
      @load="handleLoad"
      @callback="callbackPage"
      @close="closeDialog"
    />

    <!-- 流程定义选择器 -->
    <bpm-def-dialog
      v-model="bpmDefValue"
      :visible="bpmDefDialogVisible"
      :form-key="formKey"
      :multiple="false"
      :is-data-template-use="true"
      @close="visible => bpmDefDialogVisible = visible"
      @action-event="handleDialogActionEvent"
    />

    <form-print-template
      :id="printTemplateId"
      :data="submitFormData"
      :pk="pkValue"
      :visible="formPrintTemplateDialogVisible"
      @close="visible => formPrintTemplateDialogVisible = visible"
    />
  </div>
</template>
<script>
import { getFormData } from '@/api/platform/form/formDef'
import FormUtils from '@/business/platform/form/utils/formUtil'
import FormButton from './button'
import ActionMixin from '@/business/platform/form/formrender/button/action'
import BpmDefDialog from '@/business/platform/bpmn/definition/dialog'

import Formrender from '@/business/platform/form/formrender/index.vue'
import FormPrintTemplate from '@/business/platform/form/form-print/template'

export default {
  components: {
    Formrender,
    BpmDefDialog,
    FormPrintTemplate
  },
  mixins: [ActionMixin],
  props: {
    templateFormData: { // 代码生成后，保存的表单定义数据
      type: Object
    },
    buttonsPosition: { // 全局按钮位置
      type: String
    },
    templateKey: { // 模版Key
      type: String
    },
    formKey: { // 表单key
      type: String
    },
    printTemplateId: {
      type: String
    },
    pkValue: { // 主键
      type: [String, Number]
    },
    rightsScope: {
      type: String,
      default: 'data'
    },
    buttonPriority: { // 按钮优先级
      type: String,
      default: 'outside'
    },
    toolbars: { // 工具栏
      type: Array
    },
    readonly: {
      type: Boolean,
      default: false
    },
    defaultData: { // 默认数据
      type: Object
    },
    mode: { // 表单模式,default：缺省模式
      type: String
    },
    offsetTop: Number,
    offsetBottom: Number
  },
  data() {
    return {
      loading: false,

      bpmDefValue: {},
      bpmDefDialogVisible: false,

      formPrintTemplateDialogVisible: false,

      formDef: null,
      formData: {},
      formParams: {}, // 扩展参数
      buttons: [],
      boCode: '',
      version: 0,
      submitFormData: {}// 提交的表单
    }
  },
  watch: {
    pkValue: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.formDef = null
        }
      },
      immediate: true
    },
    toolbars: {
      handler: function(val, oldVal) {
        this.buttons = this.getButtons(this.toolbars, {})
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.bpmDefValue = null
    this.formDef = null
    this.formData = null
    this.formParams = null
    this.buttons = null
    this.submitFormData = null
  },
  methods: {
    async loadFormData() {
      this.loading = true

      // 判断是否已传入表单配置
      if (this.$utils.isNotEmpty(this.templateFormData)) {
        let responses = {}
        if (this.$utils.isNotEmpty(this.defaultData)) {
          responses = this.defaultData
        }
        if (this.$utils.isNotEmpty(this.pkValue)) {
          await getFormData({
            templateKey: this.templateKey || '',
            formKey: this.formKey,
            pk: this.pkValue,
            rightsScope: this.rightsScope,
            needFormDefData: false
          }).then(response => {
            const data = response.data
            if (this.$utils.isNotEmpty(this.defaultData)) {
              responses = this.defaultData
            } else {
              responses = data.boData ? JSON.parse(data.boData) : {}
            }
          }).catch(() => {})
        }
        this.formData = {
          // 表单数据
          responses: responses,
          // 表单权限
          permissions: this.$utils.parseData(this.templateFormData.permissions) || {}
        }
        // 从后台获取表单定义数据
        this.formDef = this.$utils.parseData(this.templateFormData.form) || {}
        this.boCode = this.formDef.code
        // 版本号
        this.version = this.templateFormData.version

        // 表单意见
        this.formParams.formOpinionData = FormUtils.initFormOpinionData(this.templateFormData.attributes || {})
        // 流程关联数据
        this.formParams.bpmLinkData = FormUtils.getBpmLinkData(this.templateFormData.attributes)

        // 业务主键
        this.formParams.bizKey = this.pkValue
        // 是否编辑
        this.formParams.isEdit = this.$utils.isNotEmpty(this.pkValue)
        this.loading = false
        return
      }

      getFormData({
        templateKey: this.templateKey || '',
        formKey: this.formKey,
        pk: this.pkValue,
        rightsScope: this.rightsScope
      }).then(response => {
        const data = response.data
        let responses = {}
        if (this.$utils.isNotEmpty(this.defaultData)) {
          responses = this.defaultData
        } else {
          responses = data.boData ? this.$utils.parseJSON(data.boData) : {}
        }

        this.formData = {
          // 表单数据
          responses: responses,
          // 表单权限
          permissions: this.$utils.parseData(data.permissions) || {}
        }
        // 从后台获取表单定义数据
        this.formDef = this.$utils.parseData(data.form) || {}
        this.boCode = this.formDef.code
        // 版本号
        this.version = data.version

        // 表单意见
        this.formParams.formOpinionData = FormUtils.initFormOpinionData(data.attributes || {})
        // 流程关联数据
        this.formParams.bpmLinkData = FormUtils.getBpmLinkData(data.attributes)

        // 业务主键
        this.formParams.bizKey = this.pkValue
        // 是否编辑
        this.formParams.isEdit = this.$utils.isNotEmpty(this.pkValue)
      }).catch(() => {
        this.loading = false
      })
    },
    handleLoad() {
      setTimeout(() => {
        this.loading = false
      }, 20)
    },
    getButtons(buttons, params) {
      if (this.$utils.isEmpty(buttons)) { return null }
      const btn = new FormButton({
        buttons: buttons,
        params: params
      })
      return btn.response_buttons
    },
    getFormData() {
      return this.$refs.formrender.getFormData()
    },
    getFormEL() {
      return this.$refs.formrender
    },
    resize() {
      return this.getFormEL().resize()
    },
    // 后置事件
    afterScript(key, params, callback) {
      if (!(this.getFormEL() && this.getFormEL().afterScript)) {
        const flag = true
        callback(flag)
        return
      }
      return this.getFormEL().afterScript(key, params, callback)
    },
    /**
     * 回调上个页面
     */
    callbackPage() {
      this.closeDialog()
      this.$emit('callback', true)
    },
    // 关闭当前窗口
    closeDialog() {
      this.formDef = null
      this.$emit('close', false)
    },
    // 验证表单
    validate(callback) {
      if (!this.$refs.formrender.validate) {
        const flag = true
        callback(flag)
        return
      }
      this.$refs.formrender.validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    formSubmitVerify(callback) {
      return this.$refs.formrender.formSubmitVerify(callback)
    },
    formErrorToast() {
      return this.$refs.formrender.formErrorToast()
    }
  }
}
</script>
<style lang="scss">
   .data-template-form-renderer-dialog{
    .el-dialog__header{
      padding: 0;
      border-bottom:0;
    }
    .el-dialog__body {
      padding: 0;
    }
     .el-dialog__headerbtn{
      z-index: 9999;
    }
    @media print {
      .dynamic-form{
        margin-top:0 !important;
      }
      .el-dialog__headerbtn {
        display: none !important;
      }
      .hidden-print{
        padding: 0;
        margin:  0;
      }
    }
  }
</style>
