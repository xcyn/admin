import { businessRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取指标分类列表
 * @param {*} param 
 */ 
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imCate/getList',
      method: 'post',
      data: param
    });
} 

/**
 * 分页列表查询指标分类
 * @param {*} param 
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imCate/pageList',
    method: 'post',
    data: param
  });
}

/**
* 保存指标分类
* @param {*} formData 
*/
export function saveImCategory(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/imCate/saveImCategory',
  data: formData
});
}

/**
* 通过id查询指标分类
* @param {*} param 
*/
export function queryById(param) {
return businessRequest({
  method: 'get',
  url: CALCULATION_URL() + `/api/imCate/queryById?id=${param}`
});
}

/**
* 通过id批量删除指标分类
* @param {*} catNos 
*/
export function deleteByIds(catNos) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imCate/deleteByIds',
    method: 'post',
    data: catNos
  });
}

/**
* 通过编码查询指标分类是否已存在
* @param {*} param 
*/
export function isExistsByCatNo(catNo,oldCatNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imCate/isExistsByCatNo?catNo=${catNo}&oldCatNo=${oldCatNo}`
  });
  }

/**
 * 获得顶级指标类别列表
 */
export function getTopTreeList(param) {
  return businessRequest({
    url: CALCULATION_URL() + `/api/imCate/getTopTreeList?companyId=${param}`,
    method: 'get'
  });
}

/**
 * 根据指标类别编码查询下级指标类别列表
 */
export function getSubTreeList(id) {
  return businessRequest({
      method: 'get',
      url: CALCULATION_URL() + '/api/imCate/getSubTreeList',
      params: {
      id : id
      }
  });
}    

  /**
* 通过排序号查询是否已存在
* @param {*} param 
*/
export function isExistsBySortNo(sortNo,pCatId, isTop) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imCate/isExistsBySortNo?sortNo=${sortNo}&pCatId=${pCatId}&isTop=${isTop}`
  });
  }