<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    title="选择表模版"
    class="dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    选择表模版
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      dialogLoading: false,
      toolbars: [
        { key: 'prv', label: '上一步' },
        { key: 'save', label: '下一步' },
        { key: 'cancel' }
      ]
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
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },

    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {

    }
  }
}
</script>
