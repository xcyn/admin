/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as otOperateTicketApi from '@/api/cpApi/twoTickets/otOperateTicket/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"

/**
 * 注释
 * @author mbb
 */
export function add(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/add`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function del(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/delete`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function detail(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/detail`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function edit(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function generateNo(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/generateNo`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function generateOperateNo(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/generateOperateNo`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function generateStdOperateTicket(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/generateStdOperateTicket`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function template(templateName){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/download/template/` + templateName,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listByDo(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/listByDo`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function page(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/page`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function page_shiftduty(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/page_shiftduty`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function queryAll(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/queryAll`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function queryFuzzy(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/queryFuzzy`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function save(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/save`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function saveOrUpdate(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/saveOrUpdate`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function statistics(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/statistics`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function workAnalyse(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-ticket/workAnalyse`,
		params,
	})
}

/**
* 操作票导出
*/
export function exportExcel(param) {
    return businessRequest({
      url: TWOTICKETS_URL() + `/api/ot-operate-ticket/exportExcel`,
      method: 'post',
      data: param
    })
}