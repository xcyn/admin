import { businessRequest } from '@/plugins/axios';
import { SHIFTDUTY_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/splan/getList',
    params: param
  });
}

//批量删除
export function deleteIds (formData) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/splan/batchDeleteByIds',
    method: 'post',
    data: formData
  });
}

// 获取表格信息
export function getscheduRules (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/splan/getscheduRules',
    params: param
  });
}

//添加
export function addscheduRules (param) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/splan/add',
    method: 'post',
    data: param
  });
}

//通过ID查询数据
export function getBySplanId (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/splan/queryById',
    params: param
  });
}

//查询修改内容是否可以修改
export function getIsUpdate (param) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/splan/getIsUpdate',
    method: 'post',
    data: param
  });
}

//修改
export function editscheduRules (param) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/splan/edit',
    method: 'post',
    data: param
  });
}

//查询排班计划是否关联值班日志
export function getIsCite (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/splan/getIsCite`,
    params: param
  });
}
//删除
export function deletescheduRules (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/splan/delete`,
    params: param
  });
}

//查询该计划下面是否已经生成完整的排班表数据
export function getIsExceedData (param) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/splan/getIsExceedData',
    method: 'get',
    params: param
  });
}

//查询选择时间段下面是否有排班表数据
export function getScheduleIs (param) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/splan/getScheduleIs',
    method: 'get',
    params: param
  });
}

//生成排班表
export function generate (param) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/splan/generate',
    method: 'get',
    params: param
  });
}

// 生成预览临时信息
export function getTemporary (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/splan/getTemporary',
    params: param
  });
}

// 获取预览信息
export function getScheduleList (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + '/api/splan/getScheduleList',
    params: param
  });
}

// 查询保存数据的部门和类型是否有重复
export function getIsExist (param) {
  return businessRequest({
    url: SHIFTDUTY_URL() + '/api/splan/getIsExist',
    method: 'post',
    data: param
  });
}
