import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"

/**
 * 注释
 * @author mbb
 */
export function add(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-cfacs-record/add`,
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
		url   : TWOTICKETS_URL() + `/api/wt-cfacs-record/addList`,
		data,
	})
}


/**
 * 注释
 * @author mbb
 */
export function saveOrUpdate(data){
  return businessRequest({
    method: "post",
    url   : TWOTICKETS_URL() + `/api/wt-cfacs-record/saveOrUpdate`,
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
		url   : TWOTICKETS_URL() + `/api/wt-cfacs-record/listByObjId`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listByAtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-cfacs-record/listByAtId`,
		params,
	})
}

