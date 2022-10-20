/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtStdSafemeasureAPI from '@/api/cpApi/twoTickets/wtStdSafemeasure/index.js';
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
		url   : TWOTICKETS_URL() + `/api/wt-std-safemeasure/add`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-safemeasure/addList`,
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
    url   : TWOTICKETS_URL() + `/api/wt-std-safemeasure/addListAndRemove`,
    data,
  })
}

/**
 * 注释
 * @author mbb
 */
export function deleteByStdWtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-std-safemeasure/deleteByStdWtId`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-safemeasure/deleteGet`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-safemeasure/detail`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-safemeasure/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listByStdWtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-std-safemeasure/listByStdWtId`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-safemeasure/page`,
		params,
	})
}

