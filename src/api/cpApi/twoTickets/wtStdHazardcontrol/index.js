/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtStdHazardcontrolAPI from '@/api/cpApi/twoTickets/wtStdHazardcontrol/index.js';
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/add`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/addList`,
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
    url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/addListAndRemove`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/deleteByObjId`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/deleteGet`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/detail`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/edit`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/list`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/listByObjId`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/page`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-hazardcontrol/save`,
		data,
	})
}
