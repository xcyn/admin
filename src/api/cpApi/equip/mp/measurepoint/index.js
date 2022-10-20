import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

 
/**
 * 分页列表查询测点列表
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqMeaPoint/pageList',
    method: 'post',
    data: param
  });
}

  /**
  * 通过id查询测点信息
  * @param {*} param
  */
  export function queryMeaPointById(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/eqMeaPoint/queryMeaPointById?measurepointId=${param}`
  });
  }

/**
* 通过编码查询测点编码是否已存在
* @param {*} param
*/
export function isExistsByMeaPointNo(mpNo,oldMpNo,companyId) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqMeaPoint/isExistsByMeaPointNo',
    data:{mpNo:mpNo,oldMpNo:oldMpNo,companyId:companyId}
  });
}

/**
* 保存测点信息
* @param {*} formData
*/
export function saveMesPoint(formData) {
return businessRequest({
  method: 'post',
  url: EQUIPMENT_URL() + '/eqMeaPoint/saveMesPoint',
  data: formData
});
}

  /**
  * 通过id批量删除测点信息
  * @param {*} measurepointIds
  */
  export function deleteByMesPointIds(measurepointIds) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqMeaPoint/deleteByMesPointIds',
      method: 'post',
      data: measurepointIds
    });
}

export function  getTpPoints(locaNo, tpNo){
  return  businessRequest({
    url: EQUIPMENT_URL()+'/api/diagram/getTpPoint',
    method:'post',
    data:{'tpNo':tpNo,'locaNo':locaNo}
  })
}

export function showProcessChart(param){
  return businessRequest({
    url:EQUIPMENT_URL()+'/api/diagram/showProcessChart',
    method:'post',
    data:param
  })
}

export function  getLastImData(param){
  return  businessRequest({
    url: EQUIPMENT_URL()+'/api/imData/getLastImData',
    method:'post',
    data:param
  })
}

/**
  * 根据设备位置id获得测点列表
  * @param {*} locaId
  */
 export function findEqMeasurePointByLocaId(locaId) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqMeaPoint/findEqMeasurePointByLocaId?locaId=${locaId}`
  })
}