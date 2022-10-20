import { businessRequest } from '@/plugins/axios/index.js'
import { SHIFTDUTY_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/rule/getList',
    params: param
  })
}

// 根据ruleId查询排班规则相关信息
export function selectRuleInfoById (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/rule/selectRuleInfoById',
    params: { 'ruleId': param }
  })
}

// 获取值次
export function getTeamList (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/team/getTeamList',
    params: param
  })
}

// 获取班次
export function getShiftList (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/shift/getShiftList',
    params: param
  })
}

// 保存排班规则表单信息
export function saveShiftInfo (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + '/api/rule/addRuleInfo',
    data: param
  })
}

// 保存排班规则表单信息
export function modifyRuleInfo (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + '/api/rule/modifyRuleInfo',
    data: param
  })
}

// 批量删除
export function deleteIds (formData) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/rule/batchDeleteByIds',
    method: 'post',
    data: formData
  })
}

// 查询规则是否被排班计划引用
export function getIsCite (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/rule/getIsCite',
    params: param
  })
}

// 修改值班人员
export function updateStaff (param) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/rule/updateStaff',
    method: 'post',
    data: param
  })
}
