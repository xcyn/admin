/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtTypeSafemeasureAPI from '@/api/cpApi/twoTickets/wtTypeSafemeasure/index.js';
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
		url   : TWOTICKETS_URL() + `/api/wt-type-safemeasure/add`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type-safemeasure/deleteGet`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type-safemeasure/detail`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type-safemeasure/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getByWtType(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-type-safemeasure/getByWtType`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getByWtTypeId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-type-safemeasure/getByWtTypeId`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type-safemeasure/page`,
		params,
	})
}
