/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtSafeMeasureAPI from '@/api/cpApi/twoTickets/wtSafeMeasure/index.js';
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
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/add`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function addList(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/addList`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function addListAndRemove(data){
  return businessRequest({
    method: "post",
    url   : TWOTICKETS_URL() + `/api/wt-safe-measure/addListAndRemove`,
    data,
  })
}



/**
 * 注释
 * @author mbb
 */
export function deleteByObjId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/deleteByObjId`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function deleteByWtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/deleteByWtId`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function deleteGet(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/deleteGet`,
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
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/detail`,
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
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listByObjId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/listByObjId`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listByWtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/listByWtId`,
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
		url   : TWOTICKETS_URL() + `/api/wt-safe-measure/page`,
		params,
	})
}
