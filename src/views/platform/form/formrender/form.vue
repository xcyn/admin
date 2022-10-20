<template>
  <ibps-form-formrender
    v-if="formDef"
    ref="formrender"
    :form-def="formDef"
    :buttons="buttons"
    :data="formData"
    :params="formParams"
    :readonly="readonly"
    @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
    @callback="callback"
    @close="closeDialog"
  />
</template>
<script>
import { getFormData } from '@/api/platform/form/formDef'

export default {
  components: {
    'ibps-form-formrender': () => import('@/business/platform/form/formrender/index.vue')
  },
  data: function() {
    return {
      init: false,
      templateKey: '',
      formKey: '',
      pkValue: '',
      readonly: false,
      defaultData: {},
      toolbars: []
    }
  },
  watch: {
    // 路由加载
    '$route.query': {
      handler(val, oldVal) {
        const data = this.$route.query
        if (this.$utils.isNotEmpty(data)) {
          this.loadFormData(data)
        }
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('message', this.messageEvent)
    window.parent.postMessage({ type: 'init', data: 'isReady' }, '*')
  },
  beforeDestroy() {
    window.removeEventListener('message', this.messageEvent)
  },
  methods: {
    messageEvent(e) {
      try {
        const data = this.$utils.parseJSON(e.data)
        if (data.type === 'init') {
          return
        }
        if (this.$utils.isNotEmpty(data)) {
          this.loadFormData(data)
        }
      } catch (err) {
        console.error(err)
      }
    },
    loadFormData(data) {
      getFormData({
        formKey: data.formKey,
        pk: data.pkValue,
        rightsScope: data.rightsScope
      }).then(response => {
        const result = response.data
        let responses = {}
        if (this.$utils.isNotEmpty(this.defaultData)) {
          responses = this.defaultData
        } else {
          responses = result.boData ? JSON.parse(result.boData) : {}
        }

        this.formData = {
          // 表单数据
          responses: responses,
          // 表单权限
          permissions: this.$utils.parseData(result.permissions) || {}
        }
        // 从后台获取表单定义数据
        this.formDef = this.$utils.parseData(result.form) || {}
      }).catch(() => {
      })
    },
    emitEventHandler(actionKey, args) {
      this.$emit('action-event', actionKey, args)
    },
    callback(data) {
      this.$emit('callback', data)
    },
    closeDialog(data) {
      this.$emit('close', data)
    },
    handleCallback(data) {
      // 如果iframe 回调
      if (parent) {
        window.parent.postMessage({ type: 'calback', data: data }, '*')
      }
      this.$emit('callback', data)
    }
  }
}
</script>
