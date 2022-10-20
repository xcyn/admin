<template>
  <div class="ibps-list-item">
    <div class="ibps-list-icon">
      <el-badge :is-dot="extra[badgeName] === 'N'" class="item">
        <slot name="icon" />
      </el-badge>
    </div>
    <div class="ibps-list-main">
      <div class="ibps-list-download-title"><slot name="title">{{ title }}</slot></div>
      <div class="ibps-list-download-label"><slot name="label">{{ label }}</slot></div>
      <div v-if="$slots.createTime" class="ibps-list-tip"><slot name="label">创建时间: {{ extra.createTime || '--' }}</slot></div>
      <div v-if="$slots.lastDownloadTime" class="ibps-list-tip"><slot name="lastDownloadTime">上次下载时间: {{ extra.lastDownloadTime || '--' }}</slot></div>
      <div v-if="$slots.sendTime" class="ibps-list-tip"><slot name="sendTime">发送时间: {{ extra.sendTime || '--' }}</slot></div>
      <div v-if="$slots.receiveTime" class="ibps-list-tip"><slot name="receiveTime">接收时间: {{ extra.receiveTime || '--' }}</slot></div>
      <div v-if="!hiddenHandle" class="ibps-list-tip">
        <slot name="handle">
          <el-link style="margin-right:10px;" @click="download(extra)">点击下载</el-link>
          <el-link @click="preview(extra)">预览</el-link>
        </slot>
      </div>
    </div>
    <ibps-file-viewer
      :visible.sync="dialogVisible"
      :title="title"
      :url="url"
      :file-ext="extra.type"
      @close="()=>{dialogVisible = false}"
    />
  </div>
</template>
<script>
import { markDownloaded } from '@/api/platform/socket/file'
import { previewFile, download } from '@/api/platform/file/attachment'
import IbpsFileViewer from '@/components/ibps-file-viewer'
import ActionUtils from '@/utils/action'

export default {
  components: {
    IbpsFileViewer
  },
  props: {
    badgeName: {
      type: String,
      default: 'isDownload'
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    extra: {
      type: Object
    },
    href: {
      type: String,
      default: ''
    },
    hiddenHandle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      url: ''
    }
  },
  methods: {
    preview(extra) {
      this.url = previewFile(extra.storageId)
      this.dialogVisible = true
      // this.markDownloaded(extra, true)
    },
    download(fileItem) {
      const vm = this
      const loadingInstance = this.$loading({
        lock: true,
        text: '下载中..'
      })
      download({
        attachmentId: fileItem.storageId
      }).then(response => {
        loadingInstance.close()
        if (!response) {
          return
        }
        ActionUtils.exportFile(
          response.data,
          fileItem.name + (this.$utils.isNotEmpty(fileItem.type) ? '.' + fileItem.type : '')
        )
        vm.markDownloaded(fileItem)
      }).catch(() => {
        loadingInstance.close()
      })
    },
    /**
     * 设置文件为已下载
     * @param fileItem
     */
    markDownloaded(fileItem, isPreview) {
      const vm = this
      markDownloaded({ fileId: fileItem.id }).then(() => {
        vm.$store.dispatch('ibps/message/set', true).then(() => {
          console.info('推送消息个数更新')
        })
        if (!isPreview) {
          this.$notify({
            title: '提示',
            message: '下载成功',
            type: 'success',
            position: 'top-left',
            duration: 3 * 1000
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
