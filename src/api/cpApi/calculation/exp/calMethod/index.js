import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取测点计算方法列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcCalMethod/getList',
      method: 'post',
      data: param
    });
}

/**
 * 分页列表查询测点计算方法
 * @param {*} param 
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcCalMethod/pageList',
    method: 'post',
    data: param
  });
}

/**
* 保存测点计算方法
* @param {*} formData 
*/
export function saveCalMethod(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/pcCalMethod/saveCalMethod',
    data: formData
  });
  }
  
  /**
  * 通过id查询测点计算方法
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcCalMethod/queryById?id=${param}`
  });
  }
  
  /**
  * 通过id批量删除测点计算方法
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcCalMethod/deleteByIds',
      method: 'post',
      data: ids
    });
  }

/**
* 通过编码查询测点计算方法是否已存在
* @param {*} param 
*/
export function isExistsByCalMethodNo(calMethodNo,oldCalMethodNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcCalMethod/isExistsByCalMethodNo?calMethodNo=${calMethodNo}&oldCalMethodNo=${oldCalMethodNo}`
  });
}
  