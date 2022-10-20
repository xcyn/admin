<template>
  <component
    :is="templateType"
    v-if="template"
    ref="dataTemplate"
    :value="value"
    :access-control="accessControl"
    :self-adaption="selfAdaption"
    :template-type-name="templateType"
    :template="template"
    :data-template="dataTemplate"
    :template-form-data="templateFormData"
    :dynamic-params="dynamicParams"
    :params="params"
    :multiple="multiple"
    :height="height"
    :control-height="controlHeight"
    :fields="fields"
    :preview="preview"
    v-on="$listeners"
  />
</template>
<script>
import DataTemplate from './templates'

import Vue from 'vue'
Vue.component('IbpsDataTemplateFormrender', () => import('@/business/platform/form/formrender/index.vue'))

export default {
  components: DataTemplate,
  props: {
    value: [String, Number, Array, Object],
    data: {
      type: Object
    },
    templateFormData: { // 代码生成后，保存的表单定义数据
      type: Object
    },
    dynamicParams: {
      type: Object
    },
    params: {
      type: Object
    },
    multiple: {
      type: Boolean,
      default: true
    },
    controlHeight: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
    },
    preview: {
      type: Boolean,
      default: false
    },
    /**
     * 是否受权限控制
     */
    accessControl: {
      type: Boolean,
      default: true
    },
    // 高度自适应
    selfAdaption: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: false,
      dataTemplate: {}
    }
  },
  computed: {
    templateType() {
      if (this.$utils.isEmpty(this.dataTemplate)) {
        return
      }
      let key = ''
      if (this.dataTemplate.type === 'valueSource') {
        key = 'value-source'
      } else {
        if (this.dataTemplate.showType === 'compose') {
          if (this.dataTemplate.composeType === 'treeList' || this.dataTemplate.composeType === 'listTree') {
            key = 'treeList'
          } else {
            key = this.dataTemplate.composeType
          }
        } else {
          key = this.dataTemplate.showType
        }
      }
      if (this.$utils.isEmpty(key)) { return }
      return 'ibps-data-template-' + key
    },
    template() {
      if (this.$utils.isEmpty(this.dataTemplate)) {
        return {}
      }
      const templates = this.dataTemplate.templates || []
      if (this.dataTemplate.showType === 'compose' && this.dataTemplate.composeType !== 'treeForm') {
        return templates
      } else {
        return templates.length > 0 ? templates[0] : {}
      }
    },
    fields() {
      if (this.$utils.isEmpty(this.dataTemplate)) {
        return {}
      }
      const fields = {}
      if (this.dataTemplate.datasets && this.dataTemplate.datasets.length > 0) {
        this.dataTemplate.datasets.forEach(dataset => {
          if (dataset.parentId !== '0') {
            fields[dataset.name] = dataset
          }
        })
      }
      return fields
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.dataTemplate = JSON.parse(JSON.stringify(val))
        }
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    this.dataTemplate = null
  },
  methods: {
    getRefs() {
      return this.$refs['dataTemplate']
    },
    // 清空选择
    clearSelection() {
      if (this.getRefs() && this.getRefs().clearSelection) {
        this.getRefs().clearSelection()
      }
    },
    resetSearchForm() {
      if (this.getRefs() && this.getRefs().resetSearchForm) {
        this.getRefs().resetSearchForm()
      }
    },
    setSelectRow() {
      if (this.getRefs() && this.getRefs().setSelectRow) {
        this.getRefs().setSelectRow()
      }
    },
    getFormData() {
      return this.getRefs().listData
    }
  }
}
</script>
