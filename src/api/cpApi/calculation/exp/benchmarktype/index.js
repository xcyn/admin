import { businessRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取性能指标标杆类型列表
 * @param {*} param
 */
export function getList(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcBenchmarkType/getList',
    method: 'post',
    data: param
  });
}

/**
 * 分页列表查询性能指标标杆类型
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcBenchmarkType/pageList',
    method: 'post',
    data: param
  });
}

  /**
  * 通过id查询性能指标标杆类型
  * @param {*} param
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcBenchmarkType/queryById?id=${param}`
  });
  }

/**
* 通过编码查询性能指标标杆类型是否已存在
* @param {*} param
*/
export function isExistsByBenchmarkTypeNo(bmTypeNo,oldBmTypeNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcBenchmarkType/isExistsByBenchmarkTypeNo?bmTypeNo=${bmTypeNo}&oldBmTypeNo=${oldBmTypeNo}`
  });
}

/**
* 保存性能指标标杆类型
* @param {*} formData
*/
export function savePcBenchmarkType(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/pcBenchmarkType/savePcBenchmarkType',
  data: formData
});
}

  /**
  * 通过id批量删除性能指标标杆类型
  * @param {*} typeIds
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcBenchmarkType/deleteByIds',
      method: 'post',
      data: ids
    });
}
