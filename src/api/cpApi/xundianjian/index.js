import { businessRequest } from '@/plugins/axios/index'
import { INSPECTION_URL } from '@/api/baseUrl'

/**
 * 查询待检任务(我的、部门的、公司的)
 * @param {*} userId
 * @param {*} orgId
 * @param {*} companyId
 * @param {*} type
 */
export function getWaitTaskList (userId, orgId, companyId, type) {
  return businessRequest({
    method: 'get',
    url: INSPECTION_URL() + '/api/xdjindex/getWaitTaskList',
    params: {
      userId: userId,
      orgId: orgId,
      companyId: companyId,
      type: type
    }
  })
}

/**
 * 查询异常检查项(我的、部门的、公司的)
 * @param {*} userId
 * @param {*} orgId
 * @param {*} companyId
 * @param {*} type
 */
export function getAbnormalTaskList (userId, orgId, companyId, type) {
  return businessRequest({
    method: 'get',
    url: INSPECTION_URL() + '/api/xdjindex/getAbnormalTaskList',
    params: {
      userId: userId,
      orgId: orgId,
      companyId: companyId,
      type: type
    }
  })
}

/**
 * 查询任务统计(我的、部门的、公司的)(任务数、完成数)
 * @param {*} userId
 * @param {*} orgId
 * @param {*} companyId
 * @param {*} type
 */
export function getTaskStat (param) {
  return businessRequest({
    method: 'post',
    url: INSPECTION_URL() + '/api/xdjindex/getTaskStat',
    data: param
  })
}

/**
 * 查询检查项漏检统计(我的、部门的、公司的)(总检查数、漏检查项数、漏检率)
 * @param {*} userId
 * @param {*} orgId
 * @param {*} companyId
 * @param {*} type
 */
export function getLeakStat (param) {
  return businessRequest({
    method: 'post',
    url: INSPECTION_URL() + '/api/xdjindex/getLeakStat',
    data: param
  })
}

/**
 * 领取任务
 * @param {*} taskId
 * @param {*} userId
 * @param {*} userName
 */
export function getGateTask (taskId, userId, userName) {
  return businessRequest({
    method: 'get',
    url: INSPECTION_URL() + '/api/xdjindex/getGateTask',
    params: {
      taskId: taskId,
      userId: userId,
      userName: userName
    }
  })
}

/**
 * 查询最新的报警信息
 * @param {*} taskId
 * @param {*} userId
 * @param {*} userName
 */
export function getNewAlarm (param) {
  return businessRequest({
    method: 'get',
    url: INSPECTION_URL() + `/api/xdjindex/getNewAlarm?userId=${param}`
  })
}

/**
 * 保存用户查看的报警记录
 * @param {*} taskId
 * @param {*} userId
 * @param {*} userName
 */
export function saveUserLookAlarm (userId, userName, thisTimeCountTimeSearch) {
  return businessRequest({
    method: 'get',
    url: INSPECTION_URL() + '/api/xdjindex/saveUserLookAlarm',
    params: {
      userId: userId,
      userName: userName,
      thisTimeCountTimeSearch: thisTimeCountTimeSearch
    }
  })
}

/**
 * 更新回填缺陷记录
 * @param {*} taskInspId
 * @param {*} dfNo
 */
export function saveTaskInspDfNo (taskInspId, dfNo, handlingMemo) {
  return businessRequest({
    method: 'get',
    url: INSPECTION_URL() + '/api/taskInspection/saveTaskInspDfNo',
    params: {
      taskInspId: taskInspId,
      dfNo: dfNo,
      handlingMemo: handlingMemo
    }
  })
}

/**
 * 获得路线列表
 * @param {*} param
 */
export function getMyLineList (companyId, userId) {
  return businessRequest({
    method: 'get',
    url: INSPECTION_URL() + '/api/xdjindex/getMyLineList',
    params: {
      companyId: companyId,
      userId: userId
    }
  })
}

/**
 * 生成临时巡检任务
 * @param {*} taskInspId
 * @param {*} dfNo
 */
export function taskIndexForTemp (lineId) {
  return businessRequest({
    method: 'get',
    url: INSPECTION_URL() + '/api/xdjindex/taskIndexForTemp',
    params: {
      lineId: lineId
    }
  })
}

/**
 * 我的任务
 * @param {*} userId
 * @param {*} startDate
 */
export function getMyTask (userId, startDate) {
  return businessRequest({
    method: 'get',
    url: INSPECTION_URL() + '/api/xdjindex/getMyTask',
    params: {
      userId: userId,
      startDate: startDate
    }
  })
}

/**
 * 点巡检任务统计
 * @param {*} param
 * @returns
 */
export function getTaskStatistics (param) {
  return businessRequest({
    method: 'post',
    url: INSPECTION_URL() + '/api/xdjindex/getTaskStatistics',
    data: param
  })
}

/**
 * 巡检总体情况
 * @param {*} param
 * @returns
 */
export function getInspSituation (param) {
  return businessRequest({
    method: 'post',
    url: INSPECTION_URL() + '/api/xdjindex/getInspSituation',
    data: param
  })
}

/**
 * 点检总体情况
 * @param {*} param
 * @returns
 */
export function getSpotCheckSituation (param) {
  return businessRequest({
    method: 'post',
    url: INSPECTION_URL() + '/api/xdjindex/getSpotCheckSituation',
    data: param
  })
}

/**
 * 异常情况趋势分析
 * @param {*} param
 * @returns
 */
export function getAbnormalSituation (param) {
  return businessRequest({
    method: 'post',
    url: INSPECTION_URL() + '/api/xdjindex/getAbnormalSituation',
    data: param
  })
}

/**
 * 任务完成时效
 * @param {*} param
 * @returns
 */
export function getTaskEfficiency (param) {
  return businessRequest({
    method: 'post',
    url: INSPECTION_URL() + '/api/xdjindex/getTaskEfficiency',
    data: param
  })
}

/**
 * 设备问题
 * @param {*} param
 * @returns
 */
export function getEquiProblem (param) {
  return businessRequest({
    method: 'post',
    url: INSPECTION_URL() + '/api/xdjindex/getEquiProblem',
    data: param
  })
}

//
// /**
//  * 设备问题
//  * @param {*} param
//  * @returns
//  */
// export function getEquiProblem (param) {
//   return businessRequest({
//     method: 'post',
//     url: INSPECTION_URL() + '/api/xdjindex/getEquiProblem',
//     data: param
//   })
// }
export function getTaskAbnormalDefect (param) {
  return businessRequest({
    method: 'post',
    url: INSPECTION_URL() + '/api/largeScreen/getTaskAbnormalDefect',
    data: param
  })
}
