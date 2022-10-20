/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as otTypeApi from '@/api/cpApi/twoTickets/otType/index.js';
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
		url   : TWOTICKETS_URL() + `/api/ot-type/add`,
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
		url   : TWOTICKETS_URL() + `/api/ot-type/delete`,
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
		url   : TWOTICKETS_URL() + `/api/ot-type/detail`,
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
		url   : TWOTICKETS_URL() + `/api/ot-type/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function list(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-type/list`,
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
		url   : TWOTICKETS_URL() + `/api/ot-type/page`,
		params,
	})
}

/**
* 操作票类型列表
* 
* @param {*} param 
* @returns 
*/
export function getList(param) {
   return businessRequest({
	   url: TWOTICKETS_URL() + `/api/ot-type/getList`,
	   method: 'post',
	   data: param
   })
}
