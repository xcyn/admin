import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"

/**
 * 注释
 * @author mbb
 */
export function add(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/tt-attach-file/add`,
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
		url   : TWOTICKETS_URL() + `/api/tt-attach-file/saveOrUpdate`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getByWtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/tt-attach-file/getByWtId`,
		params,
	})
}


/**
 * 注释
 * @author mbb
 */
export function listByWtId(wtId){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/tt-attach-file/listByWtId`,
    params: { wtId },
	})
}
