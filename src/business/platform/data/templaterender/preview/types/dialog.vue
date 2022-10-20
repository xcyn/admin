<template>
  <!--自定义对话框-->
  <ibps-selector-dialog
    :visible="dialogVisible"
    :value="selectedValue"
    :title="title"
    :width="width"
    :height="height"
    :margin-top="marginTop"
    :multiple="multiple"
    :label-key="showLabel"
    :default-button="false"
    :buttons="actions"
    class="preview-type-dialog"
    @input="handleSelectChange"
    @remove-select="setSelectRow"
    @close="closeDialog"
  >
    <template #default>
      <ibps-data-template-render
        v-if="dialogVisible"
        ref="dataTemplate"
        :value="selectedValue"
        :data="dataTemplate"
        :dynamic-params="dynamicParams"
        :template-form-data="templateFormData"
        :multiple="multiple"
        :height="dialogHeight"
        :preview="preview"
        :access-control="false"
        @close="closeDialog"
        @selected="handleSelectChange"
      />
    </template>
  </ibps-selector-dialog>
</template>
<script>
import TypeMixin from '../mixins/types'
import { buildLabelTitle } from '../../utils'
import eventsUtil from '@/utils/eventsUtil'// 自定义脚本

import IbpsSelectorDialog from '@/components/ibps-selector/dialog'
import Vue from 'vue'
Vue.component('IbpsDataTemplateRender', () => import('@/business/platform/data/templaterender/index.vue'))

export default {
  components: {
    IbpsSelectorDialog
  },
  mixins: [TypeMixin],
  props: {
    templateFormData: { // 代码生成后，保存的表单定义数据
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    dynamicParams: {
      type: Object
    },
    value: {
      type: [Object, Array]
    },
    title: String,
    width: {
      type: [String, Number],
      default: '80%'
    },
    height: {
      type: [String, Number],
      default: '80%'
    },
    marginConfig: { // Dialog CSS 中的 margin-top 值
      type: String,
      default: '5vh'
    },
    dialogHeight: {
      type: [String, Number],
      default: 400
    },
    multiple: {
      type: Boolean,
      default: false
    },
    toolbars: {
      type: Array
    },
    labelKey: {
      type: [String, Function]
    },
    isRunScript: {
      type: Boolean,
      default: true
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      selectedValue: this.multiple ? [] : {},
      dataTemplate: {},
      initialization: false,
      showLabel: this.labelKey,
      eventsUtil: {}
    }
  },
  computed: {
    marginTop() {
      if (this.height === '100%' || this.height === 100) {
        return '0'
      } else {
        return this.marginConfig
      }
    },
    actions() {
      return this.getActions()
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
        if (val) {
          this.initUI()
          this.getFormData()
        }
      },
      immediate: true
    },
    value(val) {
      this.selectedValue = val
    },
    selectedValue: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('update:value', val)
        }
      },
      deep: true
    },
    labelKey: {
      handler: function(val, oldVal) {
        if (val) {
          this.showLabel = val
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.selectedValue = null
    this.dataTemplate = null
    eventsUtil.cleanEventsByName(this.eventsUtil._eventsUtilsID)
    this.eventsUtil = null
  },
  methods: {
    getActions() {
      if (this.$utils.isEmpty(this.toolbars)) {
        return []
      }
      const actions = []
      this.toolbars.forEach((btn, i) => {
        const key = btn.key
        let disabled = false
        let hidden = false

        hidden = this.onLoadActions(key, btn, 'hidden', hidden)
        disabled = this.onLoadActions(key, btn, 'disabled', disabled)
        const button = {
          key: key,
          label: btn.label,
          icon: btn.icon,
          type: btn.type,
          disabled: disabled,
          hidden: hidden,
          action: () => {
            // 前置事件
            if (this.isRunScript) {
              this.beforeSubmit(key, this.selectedValue, (result) => {
                if (result) {
                  return btn.action.apply(this, [btn])
                }
              })
              return
            }
            return btn.action.apply(this, [btn])
          }
        }
        actions.push(button)
      })
      return actions
    },
    getFormData() {
      this.initData(JSON.parse(JSON.stringify(this.data)))
    },
    handleSelectChange(val, dataTemplate) {
      if (this.dataTemplate.type !== 'dialog' && !this.dataTemplate.templates[0].result_columns) {
        this.$message({
          message: '请检查是否设置返回字段！',
          type: 'warning'
        })
        return
      } else if (dataTemplate) {
        if (!dataTemplate.templates[0].result_columns) {
          this.$message({
            message: '请检查是否设置返回字段！',
            type: 'warning'
          })
          return
        } else {
          this.showLabel = buildLabelTitle(dataTemplate)
        }
      }
      this.selectedValue = val
    },
    setSelectRow() {
      this.$refs['dataTemplate'].setSelectRow()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$emit('update:value', {})
    },

    clearSelection() {
      this.$refs['dataTemplate'].clearSelection()
    },
    initUI() {
      this.initialization = false
      if (!this.initialization) {
        if (this.isRunScript && this.data.dialogs && this.data.dialogs.attrs && this.data.dialogs.attrs.script) {
          this.eventsUtil = eventsUtil._initEvents(this.data.dialogs.attrs.script, 'dialog_' + this.data.key, true)
          setTimeout(() => {
            this.loadScript()
          }, 10)
        }
        this.initialization = true
      }
    },
    // 处理脚本
    hasScript() {
      return this.isRunScript
    },
    // 加载脚本
    loadScript() {
      if (!this.hasScript()) {
        return
      }
      eventsUtil._eventCall(this.eventsUtil, 'onLoad', this)
    },
    // 前置脚本
    beforeSubmit(action, data, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      eventsUtil._eventCall(this.eventsUtil, 'beforeSubmit', this, action, data, callback)
    },
    // 加载按钮事件
    onLoadActions: function(key, button, type, defaultVal) {
      const buttonActionResult = eventsUtil._eventCall(this.eventsUtil, 'onLoadActions', this, key, button, type)
      if (typeof (buttonActionResult) !== 'undefined' && buttonActionResult) {
        return true
      }
      return defaultVal
    }

  }
}
</script>
<style lang="scss">
.preview-type-dialog{
  // .el-dialog__body{
    // height:  calc(80vh - 110px) !important;
  // }
  .el-dialog__body> div:nth-of-type(2){
    position:relative
  }
}
</style>
