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
export function getWtTypeById(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-type-page/getWtTypeById`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type-page/getWtTypeByNo`,
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
		url   : TWOTICKETS_URL() + `/api/wt-type-page/list`,
		params,
	})
}

