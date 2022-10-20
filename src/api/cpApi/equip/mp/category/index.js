import { businessRequest } from '@/plugins/axios/index';
import { EQUIPMENT_URL } from '@/api/baseUrl';

/**
 * 获取测点分类列表
 * @param {*} param 
 */ 
export function getList(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqMpCate/getList',
      method: 'post',
      data: param
    });
} 

/**
 * 分页列表查询测点分类
 * @param {*} param 
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqMpCate/pageList',
    method: 'post',
    data: param
  });
}

/**
* 保存测点分类
* @param {*} formData 
*/
export function saveMpCategory(formData) {
return businessRequest({
  method: 'post',
  url: EQUIPMENT_URL() + '/eqMpCate/saveMpCategory',
  data: formData
});
}

/**
* 通过id查询测点分类
* @param {*} param 
*/
export function queryById(param) {
return businessRequest({
  method: 'get',
  url: EQUIPMENT_URL() + `/eqMpCate/queryById?id=${param}`
});
}

/**
* 通过id批量删除测点分类
* @param {*} catNos 
*/
export function deleteByIds(catNos) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqMpCate/deleteByIds',
    method: 'post',
    data: catNos
  });
}

/**
* 通过编码查询测点分类是否已存在
* @param {*} param 
*/
export function isExistsByCatNo(catNo,oldCatNo) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/eqMpCate/isExistsByCatNo?catNo=${catNo}&oldCatNo=${oldCatNo}`
  });
  }

  
  /**
* 通过排序号查询是否已存在
* @param {*} param 
*/
export function isExistsBySortNo(sortNo,pCatId, catId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/eqMpCate/isExistsBySortNo?sortNo=${sortNo}&pCatId=${pCatId}&catId=${catId}`
  });
  }

/**
 * 获得顶级测点类别列表
 */
export function getTopTreeList(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + `/eqMpCate/getTopTreeList?companyId=${param}`,
    method: 'get'
  });
}

/**
 * 根据测点类别编码查询下级测点类别列表
 */
export function getSubTreeList(id) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + '/eqMpCate/getSubTreeList',
      params: {
      id : id
      }
  });
}    

/**
 * 根据公司查询所有测点类别列表-树形
 */
 export function getAllTreeList(companyId) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + '/eqMpCate/getAllTreeList',
      params: {
        companyId : companyId
      }
  });
}    

/**
  * 是否存在可用的下级测点类别
  * @param {*} id
  */
 export function isExistsEnableSub(id) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqMpCate/isExistsEnableSub?id=${id}`
  })
}