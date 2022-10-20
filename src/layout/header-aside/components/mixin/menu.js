import menuUtil from '@/utils/menu'

export default {
  methods: {
    /**
     *  顶部菜单点击
     * @param {*} index
     * @param {*} indexPath
     */
    async handleHeaderMenuSelect(index, indexPath) {
      this.$store.dispatch('ibps/menu/activeHeaderSet', { activeHeader: index, vm: this })
      // 启用点击头部菜单默认选中处理
      if (process.env.VUE_APP_MODULE_HEADER_ENABLED === 'open') {
        // 设置处理
        this.getSelectMenu(index)
      }
    },
    /**
     * 其他菜单点击
     * @param {*} index
     * @param {*} indexPath
     */
    handleMenuSelect(index, indexPath) {
      menuUtil.open(this, index)
    },
    /**
     * 根据header id 获取对应的菜单选中路径
     * @param header
     */
    getSelectMenu(header) {
      var defaultOpendsPathArr = []
      switch (header) {
        // 两票管理
        case process.env.VUE_APP_MODULE_LPGL_HEADER:
          defaultOpendsPathArr.push(process.env.VUE_APP_MODULE_LPGL_PATH)
          // 设置指定的展开菜单 index(path)
          this.$store.commit('ibps/menu/menusSelectSet', defaultOpendsPathArr)
          this.$router.push(process.env.VUE_APP_MODULE_LPGL_OPEN)
          break
        case process.env.VUE_APP_MODULE_SBGL_HEADER:
          // 设备管理
          defaultOpendsPathArr.push(process.env.VUE_APP_MODULE_SBGL_PATH)
          // 设置指定的展开菜单 index(path)
          this.$store.commit('ibps/menu/menusSelectSet', defaultOpendsPathArr)
          this.$router.push(process.env.VUE_APP_MODULE_SBGL_OPEN)
          break
        case process.env.VUE_APP_MODULE_XDJGL_HEADER:
          // 巡点检系统
          defaultOpendsPathArr.push(process.env.VUE_APP_MODULE_XDJGL_PATH)
          // 设置指定的展开菜单 index(path)
          this.$store.commit('ibps/menu/menusSelectSet', defaultOpendsPathArr)
          this.$router.push(process.env.VUE_APP_MODULE_XDJGL_OPEN)
          break
        // 缺陷管理
        case process.env.VUE_APP_MODULE_QXGL_HEADER:
          defaultOpendsPathArr.push(process.env.VUE_APP_MODULE_QXGL_PATH)
          // 设置指定的展开菜单 index(path)
          this.$store.commit('ibps/menu/menusSelectSet', defaultOpendsPathArr)
          this.$router.push(process.env.VUE_APP_MODULE_QXGL_OPEN)
          break
        // 用户管理
        case process.env.VUE_APP_MODULE_YHGL_HEADER:
          defaultOpendsPathArr.push(process.env.VUE_APP_MODULE_YHGL_PATH)
          // 设置指定的展开菜单 index(path)
          this.$store.commit('ibps/menu/menusSelectSet', defaultOpendsPathArr)
          this.$router.push(process.env.VUE_APP_MODULE_YHGL_OPEN)
          break
        /* case '965978723499114496':
          defaultOpendsPathArr.push('/jjjs/hcfx')
          // 设置指定的展开菜单 index(path)
          this.$store.commit('ibps/menu/menusSelectSet', defaultOpendsPathArr)
          this.$router.push('/jjjs/hcfx')
          break
        case '951788277394833408':
          defaultOpendsPathArr.push('/ssjs/sphxtjs')
          // 设置指定的展开菜单 index(path)
          this.$store.commit('ibps/menu/menusSelectSet', defaultOpendsPathArr)
          this.$router.push('/ssjs/sphxtjs')
          break */
      }
      setTimeout(function() {
        top.selectModule = true
      })
    }
  }
}
