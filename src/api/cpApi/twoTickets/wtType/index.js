/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtTypeAPI from '@/api/cpApi/twoTickets/wtType/index.js';
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
		url   : TWOTICKETS_URL() + `/api/wt-type/add`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function addAll(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-type/addAll`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type/deleteGet`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type/detail`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function wtTypeNo(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-type/wtTypeNo`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function editAll(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-type/editAll`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getWtTypeById(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-type/getWtTypeById`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getWtTypeByNo(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-type/getWtTypeByNo`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type/list`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type/page`,
		params,
	})
}
