<template>
  <div v-if="loading">
    <!--默认-->
    <template-default
      v-if="type==='default'"
      :visible="dialogVisible"
      :data="dataTemplate"
      :dynamic-params="dynamicParams"
      :template-form-data="templateFormData"
      :preview="preview"
      @close="closeDialog"
    />
    <!--对话框-->
    <template-dialog
      v-else-if="type==='dialog'"
      ref="dataTemplate"
      :visible="dialogVisible"
      :title="title"
      :value.sync="selectedValue"
      :template-form-data="templateFormData"
      :data="dataTemplate"
      :is-run-script="isRunScript"
      :dynamic-params="dynamicParams"
      :multiple="multiple"
      :width="width"
      :height="height"
      :margin-config="marginTop"
      :dialog-height="dialogHeight"
      :label-key="labelKey"
      :toolbars="toolbars"
      :preview="preview"
      @close="closeDialog"
    />
    <!--值来源-->
    <template-value-source
      v-else-if="type==='valueSource'"
      :visible="dialogVisible"
      :data="dataTemplate"
      :dynamic-params="dynamicParams"
      @close="closeDialog"
    />
  </div>
</template>
<script>
import ButtonsConstants from '@/business/platform/data/constants/buttons'
import TemplateDefault from './types/default'
import TemplateDialog from './types/dialog'
import TemplateValueSource from './types/value-source'

export default {
  components: {
    TemplateDefault,
    TemplateDialog,
    TemplateValueSource
  },
  props: {
    templateFormData: { // 代码生成后，保存的表单定义数据
      type: Object
    },
    isRunScript: { // 不需调用脚本时得配置
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, Object]
    },
    multiple: {
      type: Boolean,
      default: true
    },
    dynamicParams: {
      type: Object
    },
    data: {
      type: Object
    },
    labelKey: {
      type: [String, Function]
    },
    preview: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: this.visible,
      dataTemplate: {},
      type: 'default',
      title: '',
      width: null,
      height: null,
      marginTop: '5vh',
      dialogHeight: null,
      toolbars: [],
      selectedValue: this.multiple ? [] : {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    },
    data: {
      handler: function(val, oldVal) {
        this.initDataTemplate(val)
        this.dataTemplate = val
      },
      deep: true,
      immediate: true
    },
    value: {
      handler(val, oldVal) {
        this.selectedValue = this.$utils.isNotEmpty(val) ? JSON.parse(JSON.stringify(val)) : val
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.dataTemplate = null
    this.toolbars = null
    this.selectedValue = null
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    initDataTemplate(dataTemplate) {
      if (!dataTemplate) return
      this.loading = false
      try {
        this.type = dataTemplate.type
        this.title = dataTemplate.name
        if (this.type === 'dialog') {
          const dialogs = dataTemplate.dialogs
          const width = parseInt(dialogs.attrs ? dialogs.attrs.width || '80' : '80')
          const height = parseInt(dialogs.attrs ? (dialogs.attrs.height || '80') : '80')
          this.width = width <= 100 ? `${width}%` : `${width}px`
          this.height = height <= 100 ? `${height}%` : `${height}px`
          this.marginTop = dialogs.attrs.marginTop + 'vh'
          const h = height <= 100 ? document.body.clientHeight * (height / 100) : height
          this.dialogHeight = h
          // const h = height <= 100 ? document.body.clientHeight : height
          // const vh = height === 100 ? 0 : (document.body.clientHeight / 100 * 7)
          // this.dialogHeight = h - 130 - (this.multiple ? 60 : 40) - vh
          this.toolbars = this.handleToolbars(dialogs.buttons ? dialogs.buttons.dialog_buttons : [])
        }
        this.loading = true
      } catch (error) {
        this.loading = true
      }
    },
    handleToolbars(buttons) {
      const toolbars = []
      buttons.forEach(button => {
        const buttonType = button.button_type
        const defaultButton = ButtonsConstants[buttonType] || {}
        toolbars.push({
          key: buttonType,
          label: button.label || defaultButton.label,
          type: button.style || defaultButton.type,
          icon: 'ibps-icon-' + (button.icon || defaultButton.icon),
          action: () => {
            if (buttonType === 'ok') {
              if (this.$utils.isEmpty(this.selectedValue)) {
                this.$message.closeAll()
                this.$message.warning('请选择记录！')
                return
              }
            } else if (buttonType === 'clean' || buttonType === 'cleanClose') {
              this.$refs['dataTemplate'].clearSelection()
            }
            this.handleActionEvent(buttonType)
          }
        })
      })
      return toolbars
    },
    handleActionEvent(key) {
      if (key === 'clean' || key === 'cleanClose') {
        this.selectedValue = this.multiple ? [] : {}
        this.setSelectRow()
      }
      this.$emit('action-event', key, JSON.parse(JSON.stringify(this.selectedValue)))
    },
    setSelectRow() {
      if (this.$refs['dataTemplate'] && this.$refs['dataTemplate'].setSelectRow) {
        this.$refs['dataTemplate'].setSelectRow()
      }
    }

  }
}
</script>
<style lang="scss" >
  .data-template-renderer-dialog{
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
  }
</style>
