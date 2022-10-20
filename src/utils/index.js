import store from '@/store'

// 时间转换
export function resolvingDate (param) {
  const d = new Date(param)
  const month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
  const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  const sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
  const times = d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec
  return times
}

// 当前日期
export function currentDate () {
  const d = new Date()
  let year = d.getFullYear()
  let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
  let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  return [year, month, day].join('-')
}

export function closeTab (pageName) {
  // 清理页面缓存,重新刷新
  if (pageName !== undefined) {
    store.commit('ibps/page/keepAliveRemove', pageName)
  }

  store.dispatch('ibps/page/close', { pageSelect: store.state.ibps.page.current })
}

/**
 * 关闭页签
 * @param {Object} tagName 可传空
 * @param {Object} newObj {path:'/cycd/sbqxlcgl/qxlb'}
 * @auth liulei
 * @date 2021-12-02
 */
 export function closeTabCallBack(curObj, tagName, newObj) {
  const stateObj = curObj.$store.state
  const cur = tagName || curObj.$store.state.ibps.page.current;
  const index = stateObj.ibps.page.opened.findIndex(page => page.fullPath === cur)
  if (index >= 0) {
    // 如果这个页面是缓存的页面 将其在缓存设置中删除
    curObj.$store.commit('keepAliveRemove', stateObj.ibps.page.opened[index].name)
    // 更新数据 删除关闭的页面
    stateObj.ibps.page.opened.splice(index, 1)
  }
  // 持久化
  curObj.$store.dispatch('openIbpsdb')
  if (null != newObj) curObj.$router.push(newObj);
}

// 获取当前登录所有信息
// 获取当前登录所有信息
export function getLoginInfo (obj) {
  var returnMap = {}
  var loginObj = {}
  try {
    if (obj != null) {
      loginObj = obj.$store.state.ibps.user.info
    } else {
      loginObj = store.getters.userInfo
    }
    if (loginObj != null) {
      returnMap['employee'] = loginObj.employee // 员工信息
      returnMap['user'] = loginObj.user // 用户信息
      returnMap['org'] = loginObj.org ? loginObj.org : { id: '', name: '' } // 机构信息
      returnMap['positions'] = loginObj.positions // 岗位信息
      returnMap['mainPosition'] = loginObj.mainPosition // 主岗信息
      returnMap['role'] = loginObj.positions // 角色信息
      returnMap['company'] = loginObj.company ? loginObj.company : { companyId: '', companyName: '' } // 公司信息
    }
  } catch (e) {
    console.info(e)
    alert('用户信息获取异常！')
  }
  return returnMap
}

// 获取用户公司信息
export function getDepName () {
  let dep = {
    id: '',
    name: ''
  }
  const userDep = JSON.parse(localStorage.getItem('userinfo'))
  if (userDep.orgName) {
    dep.name = userDep.orgName.split('.')[0]
    const depInfo = JSON.parse(localStorage.getItem('depInfo'))
    if (depInfo) {
      depInfo.map(item => {
        if (item.name == dep.name) {
          dep = item
          return false
        }
      })
    }
  }
  return dep
}

/**
 * 获取公司相关信息
 */
export function getCompanyDeptInfo () {
  const returnMap = {
    compInfo: { id: '', name: '' },
    deptInfo: { id: '', name: '' }
  }
  const comp = JSON.parse(window.localStorage.getItem('depInfo'))[0] // 登录时获取的公司数据
  if (JSON.parse(window.localStorage.getItem('companyInfo'))) {
    const { ID_, NAME_ } = JSON.parse(window.localStorage.getItem('companyInfo'))
    if (comp.id != ID_) { // 说明该员工不存在分公司
      returnMap.compInfo.id = ID_
      returnMap.compInfo.name = NAME_
    }
  } else {
    const depInfo = getLoginInfo()['org']
    returnMap.compInfo.id = comp['id']
    returnMap.compInfo.name = comp['name']
    returnMap.deptInfo.id = depInfo['id']
    returnMap.deptInfo.name = depInfo['name']
  }
  return returnMap
}

// 生成随机字符串
export function randomString (e) {
  e = e || 32
  var t = 'ABCDEFGHJKMNPQRSTWXYZ2345678'
  var a = t.length
  var n = ''
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
  return n
}

export function getImage (type, data) {
  var bytes = new Uint8Array(data)
  var len = bytes.byteLength
  var binary = ''
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:${type};base64,` + window.btoa(binary)
}

export function downLoadFile (data, fileType, name) {
  const a = document.createElement('a')
  const blob = new Blob([data], { type: fileType })
  const objectUrl = URL.createObjectURL(blob)
  a.setAttribute('href', objectUrl)
  a.setAttribute('download', name)
  a.click()
}

export function export2Excel (columns, list, fileName) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('@/components/cpComponents/excel/Export2Excel')
    const tHeader = []
    const filterVal = []
    console.log(columns)
    if (!columns) {
      return
    }
    columns.forEach(item => {
      tHeader.push(item.title)
      filterVal.push(item.key)
    })
    const data = list.map(v => filterVal.map(j => v[j]))
    export_json_to_excel(tHeader, data, fileName || '数据列表')
  })
}

// 公司编码
export function orgNo () {
  return getDepName().alias ? getDepName().alias : 'YJSL'
}
export default {
  closeTab
}
