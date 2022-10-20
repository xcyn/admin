/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as otPersonRoleApi from '@/api/cpApi/twoTickets/otPersonRole/index.js';
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
		url   : TWOTICKETS_URL() + `/api/ot-person-role/add`,
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
		url   : TWOTICKETS_URL() + `/api/ot-person-role/delete`,
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
		url   : TWOTICKETS_URL() + `/api/ot-person-role/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function findByUserId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-person-role/findByUserId`,
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
		url   : TWOTICKETS_URL() + `/api/ot-person-role/list`,
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
		url   : TWOTICKETS_URL() + `/api/ot-person-role/listByDO`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listScene(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-person-role/listScene`,
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
		url   : TWOTICKETS_URL() + `/api/ot-person-role/page`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function page2(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-person-role/page2`,
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
		url   : TWOTICKETS_URL() + `/api/ot-person-role/sync`,
		data,
	})
}
