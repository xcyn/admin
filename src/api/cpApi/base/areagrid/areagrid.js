import { businessRequest } from "@/plugins/axios"
import { SAFEPRO_URL }     from "@/api/baseUrl"

// 保存信息
export function save(params){
	return businessRequest({
		method: "post",
		url   : SAFEPRO_URL() + `/area/save`,
		data  : params,
	})
}

// 保存信息
export function update(params){
  return businessRequest({
    method: "post",
    url   : SAFEPRO_URL() + `/area/update`,
    data  : params,
  })
}
// 删除信息
export function deleteAreaId(params){
	return businessRequest({
		method: "get",
		url   : SAFEPRO_URL() + `/area/deleteAreaId`,
		params: params,
	})
}

// 获取选中信息
export function getAreaId(params){
	return businessRequest({
		method: "get",
		url   : SAFEPRO_URL() + `/area/getAreaId?` + params,
		params: params,
	})
}

// 获取上级区域信息
export function getAreaNo(params){
	return businessRequest({
		method: "get",
		url   : SAFEPRO_URL() + `/area/getAreaNo?` + params,
		params: params,
	})
}

// 获取分页信息
export function page(params){
	return businessRequest({
		method: "post",
		url   : SAFEPRO_URL() + `/area/page`,
		data  : params,
	})
}

// 获取区域树信息
export function listSon(params){
	return businessRequest({
		method: "get",
		url   : SAFEPRO_URL() + `/area/listSon`,
		params: params,
	})
}

export function getRIareaQRCodes(params){
	return businessRequest({
		url   : SAFEPRO_URL() + `/zxingCode/getRIareaQRCodes`,
		method: "post",
		data  : params,
	})
}
// 保存信息
export function updateRisk(params){
  return businessRequest({
    method: "post",
    url   : SAFEPRO_URL() + `/area/update/risk`,
    data  : params,
  })
}
// 获取区域树信息
export function tree(){
  return businessRequest({
    method: "get",
    url   : SAFEPRO_URL() + `/area/tree`,
  })
}
