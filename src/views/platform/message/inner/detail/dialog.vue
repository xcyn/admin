
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :class="[inside?'inside-dialog':'inner-dialog']"
    append-to-body
    top="5vh"
    width="65%"
    @open="getFormData"
    @close="closeDialog"
  >
    <inner-message
      :id="id"
      ref="innerMessage"
      :inside="inside"
      :readonly="readonly"
      @callback="handleCallback"
    />
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import InnerMessage from './index'
export default {
  components: {
    InnerMessage
  },
  props: {
    inside: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      toolbars: [
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
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 回复
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.$nextTick(() => {
        this.$refs.innerMessage.getFormData()
        this.handleCallback(true)
      })
    },
    handleCallback(res) {
      this.$emit('callback', res)
    }
  }
}
</script>
<style lang="scss">
.inner-dialog{
  .el-dialog__body{
    padding: 20px 20px;
    height: calc(80vh - 110px) !important;
  }
  .list{
  .el-form-item__content{
    margin-left: 0px!important;
      .el-table--border{
        height: 300px !important;
      }
    }
  }
  .ibps-container-crud__header{
    display: none;
  }
}
.inside-dialog{
  .el-dialog__body{
    padding: 20px 20px;
    height: calc(50vh - 110px) !important;
  }
}
</style>
