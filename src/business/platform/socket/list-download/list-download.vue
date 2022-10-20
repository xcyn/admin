<template>
  <div :class="classes" @click="handelFileClick">
    <div class="ibps-list-link">
      <list-download-item :badge-name="badgeName" :hidden-handle="hiddenHandle" :title="title" :label="label" :extra="extra" :href="linkUrl">
        <slot slot="icon" name="icon" />
        <slot slot="default" />
        <slot slot="extra" name="extra" />
        <slot slot="createTime" name="createTime" />
        <slot slot="handle" name="handle" />
        <slot slot="lastDownloadTime" name="lastDownloadTime" />
        <slot slot="sendTime" name="sendTime" />
        <slot slot="receiveTime" name="receiveTime" />
        <slot slot="label" name="label" />
      </list-download-item>
    </div>
  </div>
</template>
<script>
import ListDownloadItem from './list-download-item.vue'
import mixinsLink from './mixins/link'
const prefixCls = 'ibps-list'
export default {
  name: 'IbpsListDownload',
  components: {
    ListDownloadItem
  },
  mixins: [mixinsLink],
  // inject: ['listGroup'],
  props: {
    badgeName: String,
    name: {
      type: [String, Number]
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
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    divided: {
      type: Boolean,
      default: true
    },
    hiddenHandle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-selected`]: this.selected,
          [`${prefixCls}-with-link`]: this.to,
          [`${prefixCls}-divided`]: this.divided
        }
      ]
    }
  },
  methods: {
    handleClickItem(event, newWindow) {
      this.listGroup.handleClick(this.name)
      this.handleCheckClick(event, newWindow)
    },
    handelFileClick() {
      this.$emit('click', this.extra)
    }
  }
}
</script>
