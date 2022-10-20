import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取性能指标分类列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcCategory/getList',
      method: 'post',
      data: param
    });
} 

/**
 * 分页列表查询性能指标分类
 * @param {*} param 
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcCategory/pageList',
    method: 'post',
    data: param
  });
}

/**
* 保存性能指标分类
* @param {*} formData 
*/
export function savePcCategory(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/pcCategory/savePcCategory',
  data: formData
});
}

/**
* 通过id查询性能指标分类
* @param {*} param 
*/
export function queryById(param) {
return businessRequest({
  method: 'get',
  url: CALCULATION_URL() + `/api/pcCategory/queryById?id=${param}`
});
}

/**
* 通过id批量删除性能指标分类
* @param {*} catNos 
*/
export function deleteByIds(ids) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcCategory/deleteByIds',
    method: 'post',
    data: ids
  });
}

/**
* 通过编码查询性能指标分类是否已存在
* @param {*} param 
*/
export function isExistsByCatNo(catNo,oldCatNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcCategory/isExistsByCatNo?catNo=${catNo}&oldCatNo=${oldCatNo}`
  });
  }
  
/**
 * 获得顶级指标分类列表
 */
export function getTopTreeList(param) {
  return businessRequest({
    url: CALCULATION_URL() + `/api/pcCategory/getTopTreeList?companyId=${param}`,
    method: 'get'
  });
}

/**
 * 根据指标分类id查询下级指标分类列表
 */
export function getSubTreeList(id) {
  return businessRequest({
      method: 'get',
      url: CALCULATION_URL() + '/api/pcCategory/getSubTreeList',
      params: {
      id : id
      }
  });
}  
