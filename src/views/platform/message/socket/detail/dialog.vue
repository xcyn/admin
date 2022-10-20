
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :class="[inside?'inside-dialog':'socket-dialog']"
    append-to-body
    top="5vh"
    width="65%"
    @open="getFormData"
    @close="closeDialog"
  >
    <template v-if="showMessage">
      <socket-message
        :id="id"
        ref="socketMessage"
        :inside="inside"
        :socket-type="socketType"
        :readonly="readonly"
        @callback="handleCallback"
      />
    </template>
    <template v-else>
      <socket-file
        :id="id"
        ref="socketFile"
        :inside="inside"
        :socket-type="socketType"
        :readonly="readonly"
        @download="download"
        @callback="handleCallback"
      />
    </template>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import SocketMessage from './index'
import SocketFile from './fileDetail'
export default {
  components: {
    SocketMessage,
    SocketFile
  },
  props: {
    socketType: {
      type: String
    },
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
  computed: {
    showMessage() {
      return this.socketType === 'sent' || this.socketType === 'receive'
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
    download(data) {
      this.$emit('download', data)
    },
    handleActionEvent({ key }) {
      switch (key) {
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
    /**
     * 获取表单数据
     */
    getFormData() {
      this.$nextTick(() => {
        if (this.showMessage) {
          this.$refs.socketMessage.getFormData()
        } else {
          this.$refs.socketFile.getFormData()
        }
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
.socket-dialog{
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
