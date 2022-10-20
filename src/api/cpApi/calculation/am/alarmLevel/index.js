import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取告警等级列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amAlarmLevel/getList',
      method: 'post',
      data: param
    });
}

/**
 * 分页列表查询告警等级
 * @param {*} param 
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/amAlarmLevel/pageList',
    method: 'post',
    data: param
  });
}

/**
* 保存告警等级
* @param {*} formData 
*/
export function saveAmAlarmLevel(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/amAlarmLevel/saveAmAlarmLevel',
    data: formData
  });
  }
  
  /**
  * 通过id查询告警等级
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/amAlarmLevel/queryById?id=${param}`
  });
  }
  
  /**
  * 通过id批量删除告警等级
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amAlarmLevel/deleteByIds',
      method: 'post',
      data: ids
    });
  }

/**
* 通过编码查询告警等级是否已存在
* @param {*} param 
*/
export function isExistsByaLevelNo(aLevelNo,oldaLevelNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/amAlarmLevel/isExistsByaLevelNo?aLevelNo=${aLevelNo}&oldaLevelNo=${oldaLevelNo}`
  });
}
  