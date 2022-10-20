import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
  * 通过id查询设备台账
  * @param {*} id
  */
 export function queryById(locaId,assetId) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqAccount/queryById?locaId=${locaId}&assetId=${assetId}`
    })
}

// 添加
export function add(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqAccount/add',
    data: param
  });
}

// 修改
export function edit(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqAccount/edit',
    data: param
  });
}

/**
  * 查询扩展属性
  * @param {*} locaId
  * @param {*} assetId
  * @param {*} type
  */
 export function findEqAccountExtend(locaId,assetId,type) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAccount/findEqAccountExtend?locaId=${locaId}&assetId=${assetId}&type=${type}`
  })
}

/**
  * 查询技术参数
  * @param {*} locaId
  * @param {*} assetId
  * @param {*} type
  */
 export function findEqAccountParm(locaId,assetId,type) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAccount/findEqAccountParm?locaId=${locaId}&assetId=${assetId}&type=${type}`
  })
}

/**
  * 查询备品备件
  * @param {*} locaId
  * @param {*} assetId
  * @param {*} type
  */
 export function findEqAccountSparepart(locaId,assetId,type) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAccount/findEqAccountSparepart?locaId=${locaId}&assetId=${assetId}&type=${type}`
  })
}

/**
  * 查询测点
  * @param {*} locaId
  * @param {*} assetId
  * @param {*} type
  */
 export function findEqAccountMeasurePoint(locaId,assetId,type) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAccount/findEqAccountMeasurePoint?locaId=${locaId}&assetId=${assetId}&type=${type}`
  })
}

/**
  * 查询文档资料
  * @param {*} locaId
  * @param {*} assetId
  * @param {*} type
  */
 export function findEqAccountUploadFile(locaId,assetId,type) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAccount/findEqAccountUploadFile?locaId=${locaId}&assetId=${assetId}&type=${type}`
  })
}