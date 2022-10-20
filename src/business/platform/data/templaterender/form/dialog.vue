<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-form-renderer-dialog"
    fullscreen
    destroy-on-close
    append-to-body
    @open="loadFormData"
    @close="closeDialog"
  >
    <data-formrender
      ref="formrender"
      :template-key="templateKey"
      :form-key="formKey"
      :print-template-id="printTemplateId"
      :template-form-data="templateFormData"
      :pk-value="pkValue"
      :toolbars="toolbars"
      :button-priority="buttonPriority"
      :readonly="readonly"
      :default-data="defaultData"
      :buttons-position="buttonsPosition"
      @close="closeDialog"
      @callback="handleCallback"
    />
  </el-dialog>
</template>
<script>
import DataFormrender from './index'
export default {
  components: {
    DataFormrender
  },
  props: {
    templateFormData: { // 代码生成后，保存的表单定义数据
      type: Object
    },
    buttonsPosition: { // 全局按钮位置
      type: String
    },
    visible: {
      type: Boolean,
      default: false
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
    }
  },
  data() {
    return {
      dialogVisible: this.visible
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    loadFormData() {
      this.$nextTick(() => {
        this.$refs.formrender.loadFormData()
      })
    },
    handleCallback(data) {
      this.$emit('callback', data)
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
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
