import { on, off } from 'element-ui/lib/utils/dom'
/**
 * 高度修复
 */
export default {
  mounted() {
    this.height = this.fixHeight()
    on(document.body, 'resize', this.handleResize)
  },
  beforeDestroy() {
    off(document.body, 'resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.height = this.fixHeight()
    },
    fixHeight() {
      const parentEl = this.$parent.$el
      const parentHeight = parentEl.offsetHeight
      // header 高度
      const header = parentEl.getElementsByClassName('ibps-theme-header')
      let headerHeight = 0
      if (header && header[0]) {
        headerHeight = header[0].offsetHeight || 60
      }
      // tab 高度
      const tabs = parentEl.getElementsByClassName('ibps-multiple-page-control-group')
      let tabHeight = 0
      if (tabs && tabs[0]) {
        tabHeight = 40
      }
      return parentHeight - headerHeight - tabHeight
    }
  }
}
