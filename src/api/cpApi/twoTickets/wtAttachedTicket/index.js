/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtAttachedTicketAPI from '@/api/cpApi/twoTickets/wtAttachedTicket/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from '@/plugins/axios/index.js'
import { TWOTICKETS_URL } from '@/api/baseUrl'
/**
 * 注释
 * @author mbb
 */
export function add(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/add`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function deleteGet(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/deleteGet`,
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
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/detail`,
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
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/edit`,
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
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/generateNo`,
    params,
  })
}
/**
 * 注释
 * @author zhangcongjie
 */
export function generateStd(params) {
  return businessRequest({
    method: 'get',
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/generateStd`,
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
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/getById`,
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
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/listByDO`,
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
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/list_app`,
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
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/page`,
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
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/page_app`,
    data,
  })
}
/**
 * 注释
 * @author mbb
 */
export function saveOrUpdate(data) {
  return businessRequest({
    method: 'post',
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/saveOrUpdate`,
    data,
  })
}
/**
 * 工作票附票导出
 */
export function exportExcel(param) {
  return businessRequest({
    url: TWOTICKETS_URL() + `/api/wt-attached-ticket/exportExcel`,
    method: 'post',
    data: param,
  })
}
