/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtWorkTicketAPI from '@/api/cpApi/twoTickets/wtWorkTicket/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from '@/plugins/axios/index.js'
import { EQUIPMENT_URL, TWOTICKETS_URL } from '@/api/baseUrl'
/**
 * 注释
 * @author mbb
 */
export function add(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/add`,
    data,
  })
}
/**
 *
 * @author mbb
 */
export function countWtType(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/countWtType`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function deleteBOByWtId(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/deleteBOByWtId`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function deleteGet(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/deleteGet`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function detail(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/detail`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function edit(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/edit`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function generateNo(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/generateNo`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function generateStd(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/generateStd`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function generateWorkStd(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/generateWorkStd`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function generateWorkNo(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/generateWorkNo`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function getById(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/getById`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function getWithLink(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/getWithLink`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function listByDO(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/listByDO`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function list_app(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/list_app`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function page(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/page`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function page_app(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/page_app`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function page_link(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/page_link`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function page_shiftduty(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/page_shiftduty`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function resetNull(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/resetNull`,
    params,
  })
}
/**
 * 注释
 * @author mbb
 */
export function saveOrUpdate(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/saveOrUpdate`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function saveOrUpdateIO(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/saveOrUpdateIO`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function search_app(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/search_app`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function statistics(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/statistics`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function checkManagerHasTickets(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/checkManagerHasTickets`,
    params,
  })
}
/**
 * 通过id查询区域iot设备
 * @param {*} param
 */
export function getIsCamerasDoorsByAreaId(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/getIsCamerasDoorsByAreaId?areaId=${param}`,
  })
}
/**
 * 工作票导出
 */
export function exportExcel(param) {
  return businessRequest({
    url: TWOTICKETS_URL() + `/api/wt-work-ticket/exportExcel`,
    method: 'post',
    data: param,
  })
}
