/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtHazardControlAPI from '@/api/cpApi/twoTickets/wtHazardControl/index.js';
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
		url   : TWOTICKETS_URL() + `/api/wt-hazard-control/add`,
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
		url   : TWOTICKETS_URL() + `/api/wt-hazard-control/addList`,
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
		url   : TWOTICKETS_URL() + `/api/wt-hazard-control/deleteByObjId`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function addListAndRemove(data){
  return businessRequest({
    method: "post",
    url   : TWOTICKETS_URL() + `/api/wt-hazard-control/addListAndRemove`,
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
		url   : TWOTICKETS_URL() + `/api/wt-hazard-control/deleteGet`,
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
		url   : TWOTICKETS_URL() + `/api/wt-hazard-control/edit`,
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
		url   : TWOTICKETS_URL() + `/api/wt-hazard-control/list`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listByObjId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-hazard-control/listByObjId`,
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
		url   : TWOTICKETS_URL() + `/api/wt-hazard-control/page`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function save(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-hazard-control/save`,
		data,
	})
}
