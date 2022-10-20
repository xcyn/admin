import layoutHeaderAside from '@/layout/header-aside'
import menuUtil from '@/utils/menu'
import { isHttp } from '@/utils/url'
// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)
const meta = { auth: true }
/**
 * 动态布局
 */
function getLayout() {
  return layoutHeaderAside
}
/**
 * 错误页面
 */
const errorPage = {
  path: '*',
  redirect: '/404',
  hidden: true
}
const errorUrl = '/system/error/404'

const idKey = menuUtil.ID_KEY
const labelKey = menuUtil.LABEL_KEY
const nameKey = menuUtil.NAME_KEY
const iconKey = menuUtil.ICON_KEY
const parentIdKey = menuUtil.PARENT_KEY
const childrenKey = menuUtil.CHILD_KEY
const urlKey = menuUtil.URL_KEY
// const displayInMenuKey = menuUtil.DISPLAY_IN_MENU_KEY // 是否显示菜单

const layoutKey = 'layout'
const defaultRouterAlias = '/router-alias/'

// 异步挂载的路由
// 动态需要根据权限加载的路由表 该路由表通过后台获取
export function generateRoutes(menus) {
  const asyncRouterMap = []
  for (const menu of menus) {
    asyncRouterMap.push(generateTopRoute(menu))
  }
  asyncRouterMap.push(errorPage)
  return asyncRouterMap
}

/**
 * 构建第一级路由
 * @param {*} menu
 */
function generateTopRoute(menu) {
  const router = {
    id: menu[idKey],
    parentId: menu[parentIdKey],
    path: '/' + menu[nameKey],
    alias: defaultRouterAlias + menu[nameKey],
    name: menu[nameKey],
    component: getLayout(menu[layoutKey]),
    // hidden: menu[displayInMenuKey] === 'N',
    meta: {
      title: menu[labelKey],
      icon: menu[iconKey] || 'file-o',
      name: menu[nameKey],
      defaultUrl: menu[urlKey],
      ...meta
    }
  }
  if (!router.children) {
    router.children = []
  }
  if (menu[childrenKey] && menu[childrenKey].length > 0) {
    const children = generateSubRoutes(menu[childrenKey])
    if (menu[urlKey]) { children.push(generateDefaultMenu(menu)) }
    router.children = children
  } else { // 添加顶部默认节点
    router.children.push(generateDefaultMenu(menu))
  }
  return router
}

function generateDefaultMenu(menu) {
  return {
    id: menu[idKey],
    parentId: menu[parentIdKey],
    path: 'index',
    name: menu[nameKey] + 'index',
    alias: defaultRouterAlias + menu[nameKey],
    component: getComputedUrl(menu[urlKey]),
    // hidden: menu[displayInMenuKey] === 'N',
    meta: {
      title: menu[labelKey],
      icon: menu[iconKey] || 'file-o',
      name: menu[nameKey],
      defaultUrl: menu[urlKey],
      ...meta
    }
  }
}
/**
 * 构建子路由
 * @param {*} menus
 */
function generateSubRoutes(menus) {
  const pool = []
  const push = function(menus, namePrefix = []) {
    menus.forEach(menu => {
      const router = {
        id: menu[idKey],
        parentId: menu[parentIdKey],
        path: [...namePrefix, menu[nameKey]].join('/'),
        name: [...namePrefix, menu[nameKey]].join('-'),
        alias: defaultRouterAlias + menu[nameKey],
        component: getComputedUrl(menu[urlKey]),
        // hidden: menu[displayInMenuKey] === 'N',
        meta: {
          title: menu[labelKey],
          icon: menu[iconKey] || 'file-o',
          name: menu[nameKey],
          props: urlParse(menu[urlKey]),
          defaultUrl: removeParams(menu[urlKey]),
          // defaultUrl: menu[urlKey],
          ...meta
        },
        /**
         * 项目定制 - 菜单可传递参数
         */
        props: urlParse(menu[urlKey])
      }

      if (menu[childrenKey] && menu[childrenKey].length > 0) {
        if (menu[urlKey]) {
          pool.push({
            ...router
          })
        }
        push(menu[childrenKey], [...namePrefix, menu[nameKey]])
      } else {
        pool.push({
          ...router
        })
      }
    })
  }
  push(menus)
  return pool
}


/**
 * 获取 组件url
 * @param {*} menu
 */
function getComputedUrl(url) {
  if (!url) return _import(errorUrl)
  try {
    if (isHttp(url)) {
      return _import('/system/iframe/index')
    } else if (url.indexOf('/d/') > -1) { // 数据模版
      return _import('/platform/data/dataTemplate/template-list')
    } else {
      // return _import(convertUrl(url)) || _import(errorUrl)
      return _import(removeParams(convertUrl(url))) || _import(errorUrl)
    }
  } catch (error) {
    // console.warn(error)
    return _import(errorUrl)
  }
}
/**
 * 转换url 避免多余‘/’
 * @param {*} url
 */
function convertUrl(url) {
  const newUrl = '/' + url
  return newUrl === '/' ? '/' : newUrl.replace(/\/\//g, '/').replace(/\/$/, '')
}
/**
 * url获取参数
 * @param {} str
 */
function urlParse(str) {
  if (!str) return
  const obj = {}
  if (str.indexOf('?') !== -1) {
    const str1 = str.split('?')[1].split('&')
    for (let i = 0; i < str1.length; i++) {
      const params = str1[i].split('=')
      obj[params[0]] = params[1]
    }
  }
  return obj
}

function removeParams(url) {
  if (url.indexOf('.rpx') !== -1) return url
  if (!url) return
  return url.indexOf('?') !== -1 ? url.split('?')[0] : url
}
