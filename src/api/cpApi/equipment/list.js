import request from "@/utils/request"

const URL = "/device/v3"

/**
 * 查询列表数据
 * @param {*} params
 */

export function queryPageList(params){
	return request({
		url   : URL + "/technicalParameter/query",
		method: "post",
		data  : params,
	})
}

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params){
	return request({
		url      : URL + "/technicalParameter/remove",
		method   : "post",
		isLoading: true,
		params   : params,
	})
}

/**
 * 保存数据
 * @param {*} params
 */
export function save(params){
	return request({
		url      : URL + "/technicalParameter/save",
		method   : "post",
		isLoading: true,
		data     : params,
	})
}

/**
 * 更新一行数据
 * @param {*} params
 */

export function update(params){
	return request({
		url   : URL + "/technicalParameter/update",
		method: "post",
		data  : params,
	})
}

/**
 * 获取数据词典
 */
export function getDictionary(params){
	return request({
		url   : "/platform/v3/cat/dictionary/findByTypeKey",
		method: "get",
		params: {
			"typeKey": params,
		},
	})
}

/**
 * 根据数据模板key值，获取对应数据
 * @param {Object} query
 */
export function findDataByKey(param){
	return request({
		url   : "/business/v3/data/template/queryDataByKey",
		method: "post",
		data  : param,
	})
}

/**
 * 获取设备子节点
 */
export function getEqLocationSubNo(params){
	return request({
		url   : "/device/v3/equipmentLocation/getEqLocationSubNo",
		method: "get",
		params: {
			"locaId": params,
		},
	})
}

/**
 * 根据locaNo查询所有path中包含的节点的id
 */
export function getAllLocaIdByPath(params){
	return request({
		url   : "/device/v3/equipmentLocation/getAllLocaIdByPath",
		method: "get",
		params: {
			"locaNo": params,
		},
	})
}

/**
 * 初始化设备位置树信息
 */
export function initDeviceTree(params){
	return request({
		url   : "/device/v3/equipmentLocation/initEquipLocationData",
		method: "get",
		params: {
			"locaId": params,
			"isLeaf": "N", //N 不是叶子节点
		},
	})
}

/**
 * 初始化设备列表信息
 */
export function initDeviceData(params){
	return request({
		url   : "/device/v3/equipmentLocation/getEqLocationWithAssetByLocaID",
		method: "post",
		data  : params,
	})
}

/**
 * 设备明细
 */
export function getEquipInfoByLocaId(params){
	return request({
		url   : "device/v3/equipmentLocation/getEqLocationAllByLocaID",
		method: "get",
		params: { "locaID": params },
	})
}

/**
 * 初始化设备类型信息
 */
export function initDeviceTypeData(params){
	return request({
		url   : "/device/v3/equipmentType/query",
		method: "post",
		data  : params,
	})
}


