import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取指标统计周期列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imTimeType/getList',
      method: 'post',
      data: param
    });
}

/**
 * 分页获得指标统计周期列表
 * @param {*} param 
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imTimeType/pageList',
      method: 'post',
      data: param
    });
}

/**
* 保存指标统计周期
* @param {*} formData 
*/
export function saveImTimeType(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/imTimeType/saveImTimeType',
    data: formData
  });
  }
  
  /**
  * 通过id查询指标统计周期
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imTimeType/queryById?id=${param}`
  });
  }
  
  /**
  * 通过id批量删除指标统计周期
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imTimeType/deleteByIds',
      method: 'post',
      data: ids
    });
}

/**
* 通过编码查询指标统计周期是否已存在
* @param {*} param 
*/
export function isExistsByTimeTypeNo(timeTypeNo,oldTimeTypeNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imTimeType/isExistsByTimeTypeNo?timeTypeNo=${timeTypeNo}&oldTimeTypeNo=${oldTimeTypeNo}`
  });
}
  