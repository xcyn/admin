<template>
  <!--默认-->
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-renderer-dialog"
    append-to-body
    fullscreen
    @close="closeDialog"
  >
    <ibps-data-template-render
      ref="dataTemplate"
      :data="dataTemplate"
      :dynamic-params="dynamicParams"
      :template-form-data="templateFormData"
      :preview="preview"
      multiple
      @close="closeDialog"
    />
  </el-dialog>
</template>
<script>
import TypeMixin from '../mixins/types'
import Vue from 'vue'
Vue.component('IbpsDataTemplateRender', () => import('@/business/platform/data/templaterender/index.vue'))

export default {
  mixins: [TypeMixin],
  props: {
    templateFormData: { // 代码生成后，保存的表单定义数据
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    data: {
      type: Object
    },
    dynamicParams: {
      type: Object
    },
    preview: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      dataTemplate: {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
        val && this.getFormData()
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.dataTemplate = null
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      // if (this.$refs['dataTemplate']) {
      // this.$refs['dataTemplate']?this.$refs['dataTemplate'].resetSearchForm():null
      // }
      this.$emit('close', false)
    },
    getFormData() {
      this.initData(JSON.parse(JSON.stringify(this.data)))
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
    @media print {
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
