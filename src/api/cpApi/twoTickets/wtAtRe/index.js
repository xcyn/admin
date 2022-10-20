/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtAtReAPI from '@/api/cpApi/twoTickets/wtAtRe/index.js';
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
		url   : TWOTICKETS_URL() + `/api/wt-at-re/add`,
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
		url   : TWOTICKETS_URL() + `/api/wt-at-re/deleteGet`,
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
		url   : TWOTICKETS_URL() + `/api/wt-at-re/detail`,
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
		url   : TWOTICKETS_URL() + `/api/wt-at-re/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getByWtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-at-re/getByWtId`,
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
		url   : TWOTICKETS_URL() + `/api/wt-at-re/list`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listAOVOByWtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-at-re/listAOVOByWtId`,
		params,
	})
}
