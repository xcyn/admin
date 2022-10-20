import * as wotHttp from '@/api/cpApi/workOrder/woOrderType/index'
import * as wsoHttp from '@/api/cpApi/workOrder/woStdOrder/index'
import * as wtStdWorkticketAPI from '@/api/cpApi/twoTickets/wtStdWorkticket/index.js'
import * as dictHttp from '@/api/cpApi/dict/index'

// 获取工单类型
export async function getWoTypeList(obj) {
  let woOrderTypes = obj.$store.state.ibps.workOrder.woTypeNoArr
  if (woOrderTypes === undefined || woOrderTypes.length <= 0) {
    const param = { isRunByWo: '1', isOn: '1' }
    await wotHttp.getTypeList(param).then((ret) => {
      woOrderTypes = ret.data
      obj.$store.commit('ibps/workOrder/setWoTypeNoArr', ret.data)
    })
  }
  return woOrderTypes
}

// 获取标准工单信息
export async function getStdWoName(obj, stdWoId) {
  let woStdOrderInfos = obj.$store.state.ibps.workOrder.woStdWorderInfo
  let woStdOrderInfo = {
    stdWoId: stdWoId,
    stdWoName: ''
  }
  if (woStdOrderInfos === undefined || woStdOrderInfos.length <= 0) {
    if (stdWoId !== undefined && stdWoId != '' && stdWoId != null) {
      await wsoHttp.get({ stdWoId: stdWoId }).then((ret) => {
        if (ret.data != null) {
          woStdOrderInfo.stdWoName = ret.data.workContent
          woStdOrderInfos.push(woStdOrderInfo)
          obj.$store.commit('ibps/workOrder/setWoStdWorderInfo', woStdOrderInfos)
        }
      })
    }
    return woStdOrderInfo.stdWoName
  } else {
    let i = 0
    for (i = 0; i < woStdOrderInfos.length; i++) {
      if (woStdOrderInfos[i].stdWoId == stdWoId) {
        return woStdOrderInfos[i].stdWoName
      }
    }
    if (i >= 5) {
      woStdOrderInfos.splice(0, 1)
    }
    if (stdWoId !== undefined && stdWoId != '' && stdWoId != null) {
      await wsoHttp.get({ stdWoId: stdWoId }).then((ret) => {
        if (ret.data != null) {
          woStdOrderInfo.stdWoName = ret.data.workContent
          woStdOrderInfos.push(woStdOrderInfo)
          obj.$store.commit('ibps/workOrder/setWoStdWorderInfo', woStdOrderInfos)
        }
      })
    }
    return woStdOrderInfo.stdWoName
  }
}

// 获取标准工作票信息
export async function getStdWtName(obj, stdWtId) {
  let stdWoTicketInfo = obj.$store.state.ibps.workOrder.stdWoTicketInfo
  if ((stdWoTicketInfo !== undefined && stdWoTicketInfo.stdWtId !== undefined && stdWoTicketInfo.stdWtId !== obj.formData.stdWtId) ||
    stdWoTicketInfo === undefined || stdWoTicketInfo.stdWtId === undefined || stdWoTicketInfo.stdWtId === '') {
    stdWoTicketInfo = {
      stdWtId: stdWtId,
      stdWtName: ''
    }
    if (stdWtId !== undefined && stdWtId != '' && stdWtId != null) {
      await wtStdWorkticketAPI.detail({ stdWtId: stdWtId }).then(response => {
        stdWoTicketInfo.stdWtName = response?.data?.workContent || ''
        obj.$store.commit('ibps/workOrder/setStdWoTicketInfo', stdWoTicketInfo)
      })
    }
  }
  return stdWoTicketInfo.stdWtName
}

// 获取数据字典值
export async function getDictInfo(obj, key) {
  let dictInfoArr = obj.$store.state.ibps.workOrder.dictInfoArr
  let dictInfo = []
  if (dictInfoArr != undefined && dictInfoArr.length > 0) {
    for (var i = 0; i < dictInfoArr.length; i++) {
      if (key == dictInfoArr[i].key) {
        dictInfo = dictInfoArr[i].data
        return dictInfo
      }
    }
    if (dictInfo.length == 0) {
      await dictHttp.getDictByTypeKey({ typeKey: key }).then((ret) => {
        dictInfo = ret.data
        dictInfoArr.push({ key: key, data: dictInfo })
        obj.$store.commit('ibps/workOrder/setDictInfoArr', dictInfoArr)
      })
    }
  } else {
    dictInfoArr = []
    await dictHttp.getDictByTypeKey({ typeKey: key }).then((ret) => {
      dictInfo = ret.data
      dictInfoArr.push({ key: key, data: dictInfo })
      obj.$store.commit('ibps/workOrder/setDictInfoArr', dictInfoArr)
    })
  }
  return dictInfo
}

// 判断是否可操作
export function canHandle(state) {
  var flag = false
  switch (state) {
    case 'nd':
      flag = true
      break
    case 'qd':
      flag = true
      break
    case 'sh':
      flag = true
      break
    case 'zx':
      flag = false
      break
    case 'ys':
      flag = false
      break
    case 'gb':
      flag = false
      break
    case 'js':
      flag = false
      break
    default:
      flag = true
      break
  }
  return flag
}
