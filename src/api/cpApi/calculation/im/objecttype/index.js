import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';


/**
 * 获得指标对象类型列表
 * @param {*} param 
 */
export function getList(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObjectType/getList',
    method: 'post',
    data: param
  });
}

/**
 * 分页获得指标对象类型列表
 * @param {*} param 
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imObjectType/pageList',
      method: 'post',
      data: param
    });
}

/**
* 保存指标对象类型
* @param {*} formData 
*/
export function saveImObjectType(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/imObjectType/saveImObjectType',
    data: formData
  });
  }
  
  /**
  * 通过id查询指标对象类型
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imObjectType/queryById?id=${param}`
  });
  }
  
  /**
  * 通过id批量删除指标对象类型
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imObjectType/deleteByIds',
      method: 'post',
      data: ids
    });
}

/**
* 通过编码查询指标对象类型是否已存在
* @param {*} param 
*/
export function isExistsByObjectTypeNo(objectTypeNo,oldObjectTypeNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imObjectType/isExistsByObjectTypeNo?objectTypeNo=${objectTypeNo}&oldObjectTypeNo=${oldObjectTypeNo}`
  });
}



export function isExistsBySortNo(sortNo,oldSortNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imObjectType/isExistsBySortNo?sortNo=${sortNo}&oldSortNo=${oldSortNo}`
  });
}


  