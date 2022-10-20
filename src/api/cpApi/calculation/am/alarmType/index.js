import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取告警类型列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amAlarmType/getList',
      method: 'post',
      data: param
    });
}

/**
 * 分页列表查询告警类型
 * @param {*} param 
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/amAlarmType/pageList',
    method: 'post',
    data: param
  });
}

/**
* 保存告警类型
* @param {*} formData 
*/
export function saveAmAlarmType(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/amAlarmType/saveAmAlarmType',
    data: formData
  });
  }
  
  /**
  * 通过编码查询告警类型
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/amAlarmType/queryById?id=${param}`
  });
  }
  
  /**
  * 通过编码批量删除告警类型
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amAlarmType/deleteByIds',
      method: 'post',
      data: ids
    });
  }

/**
* 通过编码查询告警类型是否已存在
* @param {*} param 
*/
export function isExistsByaTypeNo(aTypeNo,oldaTypeNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/amAlarmType/isExistsByaTypeNo?aTypeNo=${aTypeNo}&oldaTypeNo=${oldaTypeNo}`
  });
}
  