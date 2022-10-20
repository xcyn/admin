import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取告警分类列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amCategory/getList',
      method: 'post',
      data: param
    });
} 

/**
 * 分页列表查询告警分类
 * @param {*} param 
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/amCategory/pageList',
    method: 'post',
    data: param
  });
}

/**
* 保存告警分类
* @param {*} formData 
*/
export function saveAmCategory(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/amCategory/saveAmCategory',
  data: formData
});
}

/**
* 通过id查询告警分类
* @param {*} param 
*/
export function queryById(param) {
return businessRequest({
  method: 'get',
  url: CALCULATION_URL() + `/api/amCategory/queryById?id=${param}`
});
}

/**
* 通过id批量删除告警分类
* @param {*} ids 
*/
export function deleteByIds(ids) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/amCategory/deleteByIds',
    method: 'post',
    data: ids
  });
}

/**
* 通过编码查询告警分类是否已存在
* @param {*} param 
*/
export function isExistsByCatNo(catNo,oldCatNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/amCategory/isExistsByCatNo?catNo=${catNo}&oldCatNo=${oldCatNo}`
  });
  }

/**
 * 获得顶级告警分类列表
 */
export function getTopTreeList(param) {
  return businessRequest({
    url: CALCULATION_URL() + `/api/amCategory/getTopTreeList?companyId=${param}`,
    method: 'get'
  });
}

/**
 * 根据告警分类编码查询下级告警分类列表
 */
export function getSubTreeList(id) {
  return businessRequest({
      method: 'get',
      url: CALCULATION_URL() + '/api/amCategory/getSubTreeList',
      params: {
      id : id
      }
  });
}   