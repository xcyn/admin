import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"

/**
 * 注释
 * @author mbb
 */
export function add(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-operate-remark/add`,
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
		url   : TWOTICKETS_URL() + `/api/wt-operate-remark/saveOrUpdate`,
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
		url   : TWOTICKETS_URL() + `/api/wt-operate-remark/getByWtId`,
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
		url   : TWOTICKETS_URL() + `/api/wt-operate-remark/listByWtId`,
		params,
	})
}
