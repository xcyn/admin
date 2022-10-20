/**
 * 菜单处理帮助类
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import setting from '@/setting.js'
import Utils from '@/utils/util'
import { transformUrl, isHttp } from '@/utils/url'
// 常量
const menuUtil = {
  ID_KEY: 'id',
  PARENT_KEY: 'parentId',
  CHILD_KEY: 'children',
  LEVEL_KEY: 'level',
  NAME_KEY: 'alias',
  LABEL_KEY: 'name',
  PATH_KEY: 'path',
  OPEN_KEY: 'open', // 打开新窗口
  ICON_KEY: 'icon',
  URL_KEY: 'defaultUrl',
  DISPLAY_IN_MENU_KEY: 'displayInMenu',

  /**
 * 转换成树结构
 * @param {*} sNodes
 */
  transformToTreeAndLevelFormat: function(sNodes) {
    if (sNodes == null || sNodes === undefined || sNodes.length === 0) {
      return []
    }
    const node = menuUtil.transformToTreeFormat(sNodes)
    // 设置层级
    for (let i = 0; i < node.length; i++) {
      menuUtil.setSonNodeLevel(null, node[i])
    }
    return node
  },

  /**
 * 转换成数组结构
 * @param {*} sNodes
 */
  transformToTreeFormat: function(sNodes) {
    let i, l
    if (!this.ID_KEY || this.ID_KEY === '' || !sNodes) { return [] }
    if (sNodes instanceof Array) {
      const r = []
      const tmpMap = []
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i][this.ID_KEY]] = sNodes[i]
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        if (tmpMap[sNodes[i][this.PARENT_KEY]] &&
        sNodes[i][this.ID_KEY] !== sNodes[i][this.PARENT_KEY]) {
          if (!tmpMap[sNodes[i][this.PARENT_KEY]][this.CHILD_KEY]) {
            tmpMap[sNodes[i][this.PARENT_KEY]][this.CHILD_KEY] = []
          }
          tmpMap[sNodes[i][this.PARENT_KEY]][this.CHILD_KEY].push(sNodes[i])
        } else {
          r.push(sNodes[i])
        }
      }
      return r
    } else {
      return [sNodes]
    }
  },

  /**
 * 设置儿子节点等级
 * @param {*} parentNode
 * @param {*} node
 */
  setSonNodeLevel: function(parentNode, node) {
    if (!node) return
    node[this.LEVEL_KEY] = parentNode ? parentNode[this.LEVEL_KEY] + 1 : 0
    const nodeUrl = node[this.URL_KEY]
    node[this.PATH_KEY] = node[this.OPEN_KEY] && isHttp(nodeUrl) ? nodeUrl : (parentNode ? parentNode[this.PATH_KEY] : '') + '/' + node[this.NAME_KEY]
    if (!node[this.CHILD_KEY]) { return }
    for (let i = 0, l = node[this.CHILD_KEY].length; i < l; i++) {
      if (node[this.CHILD_KEY][i]) { menuUtil.setSonNodeLevel(node, node[this.CHILD_KEY][i]) }
    }
  },

  // ===============导航菜单处理================================
  /**
   * 过滤菜单的数据
   * @param {*} data
   */
  filterMenu(data) {
    return data.filter(d => {
      return d.resourceType === 'dir' || d.resourceType === 'menu'
    })
  },
  /**
    * 过滤菜单的显示的菜单数据
   * @param {*} data
   */
  getDisplayMenus(data) {
    const filterMenu = data.filter(d => {
      return d[this.DISPLAY_IN_MENU_KEY] === 'Y'
    })
    return this.transformToTreeAndLevelFormat(JSON.parse(JSON.stringify(filterMenu)))
  },
  /**
 * 获取导航菜单
 * @param {*} menuList
 */
  getHeaderMenus: function(menuList) {
    const headerMenus = []
    for (const menu of menuList) {
      if (menu[this.DISPLAY_IN_MENU_KEY] === 'N') {
        continue
      }
      const m = JSON.parse(JSON.stringify(menu))
      m.children = null
      headerMenus.push(m)
    }
    return headerMenus
  },
  /**
 * 获取当前激活的导航菜单
 * @param {*} navMenus
 */
  getActiveHeaderMenu: function(headerMenus, activeHeader) {
  // 首先取缓存
    if (activeHeader === 0 || activeHeader == null) {
      activeHeader = headerMenus[0].id
    }
    return activeHeader
  },
  /**
 * 获取当前激活的侧边栏
 * @param {*} menuList
 * @param {*} activeHeader
 */
  getAsideMenus: function(menuList, activeHeader) {
    const asideMenus = []
    if (menuList && menuList.length >= 0) {
      for (const menu of menuList) {
        if (menu.id === activeHeader) {
          return menu.children || []
        }
      }
    }
    if (asideMenus.length <= 0 && menuList && menuList.length > 0) {
      return menuList[0].children
    }
    return asideMenus
  },
  getPermissions: function(menuList) {
    const permissions = {}
    if (!menuList || menuList.length <= 0) {
      return permissions
    }
    const key = this.NAME_KEY
    menuList.forEach(menu => {
      permissions[menu[key]] = true
    })
    return permissions
  },
  openHeader: function(vm, menu) {
    const url = menu[this.URL_KEY]
    if (url === undefined || url === '') {
      vm.$message.closeAll()
      vm.$message.warning('临时菜单')
      return
    }
    const target = setting.menu.openTarget
    if (target !== '_tab' && isHttp(url)) {
      Utils.open(transformUrl(url), target === '_blank' ? target : url)
    } else {
      const name = menu[this.NAME_KEY]
      vm.$router.push({
        path: '/router-alias/' + name
      })
    }
  },
  open: function(vm, url) {
    const target = setting.menu.openTarget
    if (/^ibps-menu-empty-\d+$/.test(url) || url === undefined) {
      vm.$message.closeAll()
      vm.$message.warning('临时菜单')
    } else {
      if (isHttp(url)) {
        Utils.open(transformUrl(url), target === '_blank' ? target : url)
      } else {
        vm.$router.push({
          path: url
        })
      }
    }
  }
}

export default menuUtil
