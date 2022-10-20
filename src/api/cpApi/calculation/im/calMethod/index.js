import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取指标计算方法列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imCalMethod/getList',
      method: 'post',
      data: param
    });
}

/**
 * 分页获得指标计算方法列表
 * @param {*} param 
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imCalMethod/pageList',
      method: 'post',
      data: param
    });
}

/**
* 保存指标计算方法
* @param {*} formData 
*/
export function saveCalMethod(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/imCalMethod/saveCalMethod',
    data: formData
  });
  }
  
  /**
  * 通过编码查询指标计算方法
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imCalMethod/queryById?id=${param}`
  });
  }
  
  /**
  * 通过编码批量删除指标计算方法
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imCalMethod/deleteByIds',
      method: 'post',
      data: ids
    });
}

/**
* 通过编码查询指标计算方法是否已存在
* @param {*} param 
*/
export function isExistsByCalMethodNo(calMethodNo,oldCalMethodNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imCalMethod/isExistsByCalMethodNo?calMethodNo=${calMethodNo}&oldCalMethodNo=${oldCalMethodNo}`
  });
}
  