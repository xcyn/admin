<template>
  <div style="height: 100%">
    <iframe
      v-if="type === 'fixed'"
      :src="$utils.isNotEmpty(dynamicData)?dynamicData:''"
      :height="'100%'"
      :width="'100%'"
      frameborder="0"
    />
    <template v-else-if="type === 'form' || type === 'detail'">
      <ibps-link-form
        :config="config"
        :default-data="defaultData"
        :dynamic-params="dynamicParams"
        :pk-value="pkValue"
        :readonly="type === 'detail'"
        mode="default"
        :style="{
          width:width+'px',
          overflow: 'hidden'
        }"
      />
    </template>
    <template v-else-if="type === 'dataTemplate'">
      <ibps-link-data-template
        :config="config"
        :dynamic-data="dynamicData"
        :dynamic-params="dynamicParams"
        :title-height="10"
      />
    </template>
  </div>
</template>
<script>
import IbpsLinkForm from '@/components/ibps-link/components/form'
import IbpsLinkDataTemplate from '@/components/ibps-link/components/data-template'
import I18n from '@/utils/i18n'

export default {
  components: {
    IbpsLinkForm,
    IbpsLinkDataTemplate
  },
  data() {
    return {
      width: document.body.clientWidth,
      itemId: '',
      config: {},
      dynamicData: {},
      pkValue: '',
      defaultData: {},
      dynamicParams: {}
    }
  },
  computed: {
    type() {
      if (this.$utils.isEmpty(this.config)) return ''
      return this.config.type || ''
    },
    dataType() {
      if (this.$utils.isEmpty(this.config)) return 'add'
      return this.config.dataType || 'add'
    }
  },
  mounted() {
    this.itemId = this.$route.query._itemId
    if (localStorage.getItem(this.itemId)) {
      const data = JSON.parse(localStorage.getItem(this.itemId))
      if (data.config) {
        this.config = data.config
        I18n.setTitle(this.config.title)
      }
      if (data.dynamicData) {
        if ((this.type === 'form' && this.dataType === 'add')) {
          this.defaultData = data.dynamicData || {}
        } else {
          this.pkValue = this.$utils.isNotEmpty(data.dynamicData) ? data.dynamicData || '' : ''
          this.dynamicData = this.$utils.isNotEmpty(data.dynamicData) ? data.dynamicData : null
        }
      }
      if (data.dynamicParams) {
        this.dynamicParams = data.dynamicParams
      }
    }
  },
  beforeDestroy() {
    // this.config = null
    // if (localStorage.getItem(this.itemId)) {
    //   localStorage.removeItem(this.itemId)
    // }
  }
}
</script>
