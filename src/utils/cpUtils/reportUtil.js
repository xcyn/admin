/**
 * 获取月份
 */
export function getMonths() {
  return [
    {
      value: 1,
      label: '1月'
    },
    {
      value: 2,
      label: '2月'
    },
    {
      value: 3,
      label: '3月'
    },
    {
      value: 4,
      label: '4月'
    },
    {
      value: 5,
      label: '5月'
    },
    {
      value: 6,
      label: '6月'
    },
    {
      value: 7,
      label: '7月'
    },
    {
      value: 8,
      label: '8月'
    },
    {
      value: 9,
      label: '9月'
    },
    {
      value: 10,
      label: '10月'
    },
    {
      value: 11,
      label: '11月'
    },
    {
      value: 12,
      label: '12月'
    }
  ]
}
/**
 * 获取季度
 */
export function getQuarters() {
  return [
    {
      value: 1,
      label: '1季度'
    },
    {
      value: 2,
      label: '2季度'
    },
    {
      value: 3,
      label: '3季度'
    },
    {
      value: 4,
      label: '4季度'
    }
  ]
}

/**
 * 获取板块
 */
export function getPlates() {
  return [
    {
      value: 'hd',
      label: '火电'
    },
    {
      value: 'fd',
      label: '风电'
    },
    {
      value: 'gf',
      label: '光伏'
    },
    {
      value: 'gr',
      label: '供热'
    }
  ]
}

/**
 * 获取当前菜单信息
 */
export function getCurrentPageInfo(obj) {
  let pageInfo = obj.$route.meta
  return pageInfo
}

/**
 * 报表地址
 */
export function reportUrl(fileName, reportType) {
  let url = process.env.VUE_APP_BASE_REPORT_API
  if (reportType !== undefined && reportType != null && reportType !== '') {
    switch (reportType) {
      case 'preview':
        url = url + '/reportJsp/showReport.jsp?rpx='
        if (fileName !== undefined && fileName != null && fileName !== '') {
          url = url + fileName
        }
        break
      case 'previewGroup':
        url = url + '/reportJsp/showReportGroup.jsp?rpg='
        if (fileName !== undefined && fileName != null && fileName !== '') {
          url = url + fileName
        }
        break
      case 'previewInput':
        url = url + '/reportJsp/previewInput.jsp?__sht='
        if (fileName !== undefined && fileName != null && fileName !== '') {
          url = url + fileName
        }
        break
      default:
        url = null
    }
  }
  return url
}

/**
 * 生成随机id
 */
export function guid(limit) {
  let num = '' // 定义用户编号
  limit = limit || 4
  limit = limit > 6 ? 6 : limit
  for (let i = 0; i < limit; i++) // 4位随机数，用以加在时间戳后面。
  {
    num += Math.floor(Math.random() * 10)
  }
  num = new Date().getTime() + num // 时间戳，用来生成用户编号。
  return num
}
