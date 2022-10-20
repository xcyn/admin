<template>
  <data-template-render-preview
    :visible="dialogVisible"
    :data="dataTemplate"
    :dynamic-params="dynamicParams"
    :template-form-data="templateFormData"
    @close="handleClose"
    @action-event="handleActionEvent"
  />
</template>
<script>
import { getByKey } from '@/api/platform/data/dataTemplate'
import DataTemplateRenderPreview from './index'
export default {
  components: {
    DataTemplateRenderPreview
  },
  props: {
    templateFormData: { // 代码生成后，保存的表单定义数据
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    },
    templateKey: {
      type: String
    },
    dynamicParams: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataTemplate: {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        if (val) {
          this.loadData()
        } else {
          this.dataTemplate = {}
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.dataTemplate = null
  },
  methods: {
    loadData() {
      this.dataTemplate = {}
      getByKey({
        dataTemplateKey: this.templateKey
      }).then(response => {
        // 从后台获取数据
        this.dataTemplate = this.$utils.parseData(response.data)
        this.dialogVisible = true
      }).catch(() => {
      })
    },
    handleClose(visible) {
      this.$emit('close', visible)
    },
    handleActionEvent(key, data) {
      this.$emit('action-event', key, data)
    }
  }
}
</script>
