import { on, off } from 'element-ui/lib/utils/dom'
/**
 * 窗口高度修复
 */
export default {
  mounted() {
    this.ibpsDialogHeight = this.fixIbpsDialogHeight()
    on(document.body, 'resize', this.handleDialogHeightResize)
  },
  beforeDestroy() {
    off(document.body, 'resize', this.handleDialogHeightResize)
  },
  methods: {
    handleDialogHeightResize() {
      this.ibpsDialogHeight = this.fixIbpsDialogHeight()
    },
    fixIbpsDialogHeight() {
      const h = document.documentElement.clientHeight || document.body.clientHeight
      return h
    }
  }
}
