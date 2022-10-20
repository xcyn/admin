/**
 * 按钮
 */
const buttons = {
  'search': {
    label: '搜索',
    type: 'primary',
    icon: 'search',
    scope: ['toolbar', 'search']
  },
  'resetSearch': {
    label: '重置',
    type: 'danger',
    icon: 'undo',
    scope: ['toolbar', 'search']
  },
  'moreSearch': {
    label: '更多',
    type: 'primary',
    icon: 'ellipsis-h',
    scope: ['toolbar', 'search']
  },
  'add': {
    label: '添加',
    type: 'primary',
    icon: 'add',
    scope: ['toolbar', 'contextmenu'],
    contextmenu: 'all'
  },
  'remove': {
    label: '删除',
    type: 'primary',
    icon: 'remove',
    scope: ['toolbar', 'manage'],
    contextmenu: 'sub'
  },
  'edit': {
    label: '编辑',
    type: 'primary',
    icon: 'edit',
    scope: ['toolbar', 'manage'],
    contextmenu: 'sub'
  },
  'detail': {
    label: '明细',
    type: 'primary',
    icon: 'detail',
    scope: ['toolbar', 'manage'],
    contextmenu: 'sub'
  },
  'logicDeleted': {
    label: '逻辑删除',
    type: 'primary',
    icon: 'remove',
    scope: ['toolbar', 'manage'],
    contextmenu: 'sub'
  },
  'batchModify': {
    label: '批量修改',
    type: 'primary',
    icon: 'check-square-o',
    scope: ['toolbar']
  },
  'import': {
    label: '导入',
    type: 'primary',
    icon: 'import',
    scope: ['toolbar']
  },
  'export': {
    label: '导出',
    type: 'primary',
    icon: 'export',
    scope: ['toolbar'],
    menus: [{
      label: '导出所有',
      key: 'exportAll'
    }, {
      label: '导出选中',
      key: 'exportSelected'
    }, {
      label: '导出当前页',
      key: 'exportCurPage'
    }, {
      label: '根据查询结果导出',
      key: 'exportQuery'
    }]
  },
  'close': {
    label: '关闭',
    type: 'default',
    icon: 'close',
    scope: ['edit', 'detail', 'customDetail']
  },
  'save': {
    label: '保存',
    type: 'primary',
    icon: 'save',
    scope: ['edit']
  },
  'print': {
    label: '打印',
    type: 'primary',
    icon: 'print',
    scope: ['toolbar', 'manage', 'edit', 'detail', 'customDetail']
  },
  'custom': {
    label: '自定义',
    type: 'primary',
    icon: 'cog',
    scope: ['toolbar', 'manage', 'edit', 'detail', 'customDetail', 'dialog']
  },
  'ok': {
    label: '确定',
    type: 'primary',
    icon: 'ok',
    scope: ['dialog']
  },
  'confirm': {
    label: '确定',
    type: 'primary',
    icon: 'ok',
    scope: ['dialog']
  },
  'clean': {
    label: '清空',
    type: 'info',
    icon: 'clean',
    scope: ['dialog']
  },
  'cleanClose': {
    label: '清空并关闭',
    type: 'warning',
    icon: 'times-circle-o',
    scope: ['dialog']
  },
  'cancel': {
    label: '取消',
    type: 'default',
    icon: 'cancel',
    scope: ['dialog']
  },
  'refresh': {
    label: '刷新',
    type: 'primary',
    icon: 'refresh',
    scope: ['toolbar']
  },
  'expand': {
    label: '展开',
    type: 'primary',
    icon: 'expand',
    scope: ['toolbar']
  },
  'compress': {
    label: '收缩',
    type: 'primary',
    icon: 'compress',
    scope: ['toolbar']
  },
  'more': {
    label: '更多',
    type: 'primary',
    icon: 'list-alt',
    scope: ['toolbar']
  },
  'collapse': {
    label: '收缩',
    icon: 'angle-up',
    scope: ['toolbar']
  },
  'expansion': {
    label: '展开',
    icon: 'angle-down',
    scope: ['toolbar']
  },
  'sefStartFlow': {
    label: '启动自定义流程',
    icon: 'cog',
    scope: ['toolbar', 'manage', 'edit']
  },
  'customDetail': {
    label: '自定义明细',
    type: 'primary',
    icon: 'detail',
    scope: ['toolbar', 'manage'],
    contextmenu: 'sub'
  }

}

export default buttons

function hasButtonPermission(type, action) {
  var positions = buttons[type] ? buttons[type]['scope'] : null
  if (!positions) { return false }
  return positions.indexOf(action) > -1
}
/**
* 是否有权限
 */
export const hasPermission = hasButtonPermission
/*
 * 是否有按钮
 */
export const hasButton = function(type, action, position) {
  var hasPermission = hasButtonPermission(type, action)
  if (!hasPermission) { return false }// 没有权限
  if (!position || position === 'all' || position === action) { return true }
  return false
}

/**
* 是否有右键菜单权限
*/
export const hasContextmenuButton = function(type, action, p) {
  var hasPermission = hasButtonPermission(type, action)
  if (!hasPermission) { return false }// 没有权限
  var contextmenu = buttons[type]['contextmenu']
  if (contextmenu === 'all' || contextmenu === p) { return true }
  return false
}

/**
 * 是否有搜索权限
 * @param {*} type
 */
export const hasSearchPermission = function(type) {
  return hasButtonPermission(type, 'search')
}
