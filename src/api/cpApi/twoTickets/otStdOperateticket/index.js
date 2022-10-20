/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as otStdOperateticketApi from '@/api/cpApi/twoTickets/otStdOperateticket/index.js';
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
		url   : TWOTICKETS_URL() + `/api/ot-std-operateticket/add`,
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
		url   : TWOTICKETS_URL() + `/api/ot-std-operateticket/delete`,
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
		url   : TWOTICKETS_URL() + `/api/ot-std-operateticket/detail`,
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
		url   : TWOTICKETS_URL() + `/api/ot-std-operateticket/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function generateOperateTicket(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateticket/generateOperateTicket`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function list(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateticket/list`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function page(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateticket/page`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function queryAll(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateticket/queryAll`,
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
		url   : TWOTICKETS_URL() + `/api/ot-std-operateticket/save`,
		data,
	})
}
