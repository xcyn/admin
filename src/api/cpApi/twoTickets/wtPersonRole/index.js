/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtPersonRoleAPI from '@/api/cpApi/twoTickets/wtPersonRole/index.js';
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
		url   : TWOTICKETS_URL() + `/api/wt-person-role/add`,
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
		url   : TWOTICKETS_URL() + `/api/wt-person-role/deleteGet`,
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
		url   : TWOTICKETS_URL() + `/api/wt-person-role/detail`,
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
		url   : TWOTICKETS_URL() + `/api/wt-person-role/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getByUserId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-person-role/getByUserId`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listByDO(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-person-role/listByDO`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function page(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-person-role/page`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function sync(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-person-role/sync`,
		data,
	})
}
