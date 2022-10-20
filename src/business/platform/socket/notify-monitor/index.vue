<template>
  <div>
    <script
      ref="script"
      type="text/plain"
    />
  </div>
</template>

<script>
import { BASE_WEBSOCKET_API } from '@/api/baseUrl'
import { enabled } from '@/api/platform/socket/socket'
import { getToken } from '@/api/platform/socket/push'
import { downloadUrl } from '@/api/platform/file/attachment'
import WS_SDK from '@/components/ibps-websocket/ws_sdk'
export default {
  name: 'IbpsNotifyMonitor',
  data() {
    return {
      ws: {}
    }
  },
  created() {
    enabled().then((enabledRes) => {
      this.initWS(enabledRes.data)
    }).catch((e) => {
      this.initWS(false)
    })
  },
  beforeDestroy() {
    this.ws = null
  },
  methods: {
    initWS(enabled) {
      if (enabled === false) return
      getToken({ userId: this.$store.getters.userId }).then((res) => {
        this.ws = new WS_SDK(
          BASE_WEBSOCKET_API() + '/' + res.data,
          (message) => {
            this.$store.dispatch('ibps/message/set', true).then(() => {
              console.info('收到一条推送')
            })
            const expandMap = message.getExpandMap()
            let messageBody = ''
            let dangerouslyUseHTMLStringValue = false
            if (message.getMsgtype() === 'file') {
              const url = downloadUrl({
                attachmentId: expandMap.get('storageId')
              })
              messageBody = `<a href="${url}">${message.getMsgbody()}</a>`
              dangerouslyUseHTMLStringValue = true
            } else {
              messageBody = message.getMsgbody() || ''
            }
            this.$notify({
              title: expandMap.get('title') || '提示',
              dangerouslyUseHTMLString: dangerouslyUseHTMLStringValue,
              message: messageBody,
              type: expandMap.get('style') || 'success',
              position: expandMap.get('position') || 'bottom-right',
              duration: expandMap.get('duration') || 5 * 1000
            })
          },
          true,
          enabled/* 请求platform/v3/socket/enabled */)
      })
    }
  }
}
</script>
