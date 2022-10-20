import { uniqueId } from 'lodash'
import setting from '@/setting.js'
import { isHttp } from '@/utils/url'

/**
 * 获取index
 * @param {*} menu
 * @param {*} type
 */
export function getIndex(menu, type) {
  let indexKey = 'id'
  if (type === 'header') {
    return menu[indexKey] || uniqueId('ibps-menu-empty-')
  }
  indexKey = 'path'
  const url = menu.defaultUrl
  const openTarget = setting.menu.openTarget
  if (openTarget !== '_tab' && isHttp(url)) {
    return url
  } else {
    return menu[indexKey] || uniqueId('ibps-menu-empty-')
  }
}

/**
 * @description 创建菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {String} type 菜单类型 header：顶部，aside：侧边
 */
export function elMenuItem(h, menu, type = 'aside', defaultActive) {
  let icon = null
  if (menu.icon) icon = <i class={ `ibps-icon ibps-icon-${menu.icon}` }/>
  else if (menu.iconSvg) icon = <ibps-icon-svg name={ menu.iconSvg }/>
  else icon = <i class='ibps-icon ibps-icon-file-o'/>

  const index = getIndex(menu, type)
  return <el-menu-item
    key={ index }
    index={ index }>
    { icon }
    <span slot='title'>{ menu.name || this.$t('layout.header-aside.menu-item.label-default')}</span>
  </el-menu-item>
}

/**
 * @description 创建子菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {String} type 菜单类型 header：顶部，aside：侧边
 */
export function elSubmenu(h, menu, type = 'aside', defaultActive) {
  let icon = null
  if (menu.icon) icon = <i slot='title' class={ `ibps-icon ibps-icon-${menu.icon}` }/>
  else if (menu.iconSvg) icon = <ibps-icon-svg slot='title' name={ menu.iconSvg }/>
  else icon = <i slot='title' class='ibps-icon ibps-icon-folder-o'/>

  const index = getIndex(menu, type)
  return <el-submenu
    key={ index }
    index={ index }
    class={defaultActive === index ? 'is-active' : ''}>
    { icon }
    <span slot='title'>{menu.name || this.$t('layout.header-aside.menu-item.label-default') }</span>
    { menu.children.map(child => createMenu.call(this, h, child, type)) }
  </el-submenu>
}

/**
 * @description 在组件中调用此方法渲染菜单项目
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {String} type 菜单类型 header：顶部，aside：侧边
 */
export function createMenu(h, menu, type = 'aside', defaultActive) {
  if (menu.children === undefined || menu.children === null) return elMenuItem.call(this, h, menu, type, defaultActive)
  return elSubmenu.call(this, h, menu, type, defaultActive)
}

