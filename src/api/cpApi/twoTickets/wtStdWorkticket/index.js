/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtStdWorkticketAPI from '@/api/cpApi/twoTickets/wtStdWorkticket/index.js';
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
		url   : TWOTICKETS_URL() + `/api/wt-std-workticket/add`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function deleteGet(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-std-workticket/deleteGet`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-workticket/detail`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-workticket/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getById(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-std-workticket/getById`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function page(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-std-workticket/page`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-workticket/saveOrUpdate`,
		data,
	})
}
