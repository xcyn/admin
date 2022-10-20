import { businessRequest } from '@/plugins/axios';
import { SHIFTDUTY_URL } from '@/api/baseUrl'

/**
 * 记事类型
 */
// 获取表格信息
export function getNoteType(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/noteType/getList`,
    params: param
  });
}

//保存操作
export function saveNoteType(param,cid) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/noteType/edit?companyId=`+cid,
    data: param
  });
}

/**
 *记事主题 
 */
// 获取表格信息
export function getNoteTopic(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/noteTopic/getList`,
    params: param
  });
}

//保存操作
export function saveNoteTopic(param,cid) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/noteTopic/edit?companyId=`+cid,
    data: param
  });
}

/**
 * 设备运行状态
 */
//获取表格信息
export function getEqstatusType(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/eqstatusType/getList`,
    params: param
  });
}

//保存操作
export function saveEqstatusType(param,cid) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/eqstatusType/edit?companyId=`+cid,
    data: param
  });
}

/**
 * 监护设备
 */
//获取表格信息
export function geteqList(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/eqList/getList`,
    params: param
  });
}
//添加
export function addeqList(param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/eqList/add`,
    data: param
  });
}
//通过id查询
export function getByeId(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/eqList/queryById`,
    params: param
  });
}
//编辑
export function editeqList(param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/eqList/edit`,
    data: param
  });
}
//删除
export function deleteeqList(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/eqList/delete`,
    params: param
  });
}


/**
 * 运行参数
 */
//获取表格信息
export function getparmList(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/parmList/getList`,
    params: param
  });
}
//添加
export function addparmList(param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/parmList/add`,
    data: param
  });
}
//通过id查询
export function getBypId(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/parmList/queryById`,
    params: param
  });
}
//编辑
export function editparmList(param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/parmList/edit`,
    data: param
  });
}
//删除
export function deleteparmList(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/parmList/delete`,
    params: param
  });
}

/**
 * 交接物品
 */
//获取表格信息
export function getarticleList(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/articleList/getList`,
    params: param
  });
}
//添加
export function addarticleList(param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/articleList/add`,
    data: param
  });
}
//通过id查询
export function getByaId(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/articleList/queryById`,
    params: param
  });
}
//编辑
export function editarticleList(param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/articleList/edit`,
    data: param
  });
}
//删除
export function deletearticleList(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/articleList/delete`,
    params: param
  });
}


/**
 * 台账类型
 */
//获取表格信息
export function getledgerType(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/ledgerType/getList`,
    params: param
  });
}

//保存操作
export function saveledgerType(param,cid) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+`/api/ledgerType/edit?companyId=`+cid,
    data: param
  });
}

