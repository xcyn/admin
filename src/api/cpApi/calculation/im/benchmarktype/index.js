import { businessRequest,systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取指标标杆分类列表
 * @param {*} param
 */
export function getList(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imBenchMarkType/getList',
    method: 'post',
    data: param
  });
}

/**
 * 分页列表查询指标标杆类型
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imBenchMarkType/pageList',
    method: 'post',
    data: param
  });
}

  /**
  * 通过id查询标杆类型
  * @param {*} param
  */
  export function queryByBenchMarkTypeId(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imBenchMarkType/queryByBenchMarkTypeId?imTypeId=${param}`
  });
  }

/**
* 通过编码查询指标标杆类型是否已存在
* @param {*} param
*/
export function isExistsByBenchMarkTypeNo(imTypeNo,oldImTypeNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imBenchMarkType/isExistsByBenchMarkTypeNo?imTypeNo=${imTypeNo}&oldImTypeNo=${oldImTypeNo}`
  });
}

/**
* 保存指标标杆类型
* @param {*} formData
*/
export function saveBenchMarkType(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/imBenchMarkType/saveBenchMarkType',
  data: formData
});
}

  /**
  * 通过id批量删除指标标杆类型
  * @param {*} typeIds
  */
  export function deleteByBnechTypeIds(typeIds) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imBenchMarkType/deleteByBnechTypeIds',
      method: 'post',
      data: typeIds
    });
}
