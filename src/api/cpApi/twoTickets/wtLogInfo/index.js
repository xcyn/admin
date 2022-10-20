/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      工作票过程信息API
 *  @how2use:         import * as wtLogInfoApi from '@/api/cpApi/twoTickets/wtLogInfo/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"

/**
 * 增加信息
 * @author mbb
 */
export function add(wtLogInfoDO){
	return businessRequest({
		url   : TWOTICKETS_URL() + "/api/wt-log-info/add",
		method: "post",
		data  : wtLogInfoDO,
	})
}

/**
 * 根据wtId查询信息
 * @author mbb
 */
export function listByObjId(objId){
	return businessRequest({
		url   : TWOTICKETS_URL() + "/api/wt-log-info/listByObjId",
		method: "get",
		params: { objId },
	})
}

/**
 * 根据wtId查询信息
 * @author mbb
 */
export function listByWtId(wtId){
	return businessRequest({
		url   : TWOTICKETS_URL() + "/api/wt-log-info/listByWtId",
		method: "get",
		params: { wtId },
	})
}

/**
 * 独特增加,
 * 以wtID和markEn作为唯一标识.表示同一张票下,只能有一个markEn
 * @author mbb
 */
export function uniqueSave(wtLogInfoDO){
	return businessRequest({
		url   : TWOTICKETS_URL() + "/api/wt-log-info/uniqueSave",
		method: "post",
		data  : wtLogInfoDO,
	})
}
