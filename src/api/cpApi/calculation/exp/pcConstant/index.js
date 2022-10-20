import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 分页列表查询性能计算常量
 * @param {*} param 
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcConstant/pageList',
      method: 'post',
      data: param
    });
}

/**
* 保存性能计算常量
* @param {*} formData 
*/
export function savePcConstant(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/pcConstant/savePcConstant',
    data: formData
  });
  }
  
  /**
  * 通过id查询性能计算常量
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcConstant/queryById?id=${param}`
  });
  }
  
  /**
  * 通过id批量删除性能计算常量
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcConstant/deleteByIds',
      method: 'post',
      data: ids
    });
}

/**
* 通过编码查询性能计算常量是否已存在
* @param {*} param 
*/
export function isExistsByConstantNo(constantNo,oldConstantNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcConstant/isExistsByConstantNo?constantNo=${constantNo}&oldConstantNo=${oldConstantNo}`
  });
}
  