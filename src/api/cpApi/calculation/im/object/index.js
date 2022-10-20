import { businessRequest,systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL,EXTEND_URL} from '@/api/baseUrl';

/**
 * 获取指标对象列表
 * @param {*} param
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imObject/getList',
      method: 'post',
      data: param
    });
}

/**
 * 根据是否顶级获取指标对象顶级列表
 * @param {*} param
 * @returns
 */
 export function getTopTreeListIsTop(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/getTopTreeListIsTop',
    method: 'post',
    data: param
  });
}

/**
 * 获取指标对象顶级列表
 * @param {*} param
 * @returns
 */
export function getTopTreeList(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/getTopTreeList',
    method: 'post',
    data: param
  });
}

/**
 * 获取指标对象顶级列表(仅组织结构)
 * @param {*} param
 * @returns
 */
export function getTopTreeOrgList(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/getTopTreeOrgList',
    method: 'post',
    data: param
  });
}

/**
 * 获取指标对象下级列表
 * @param {*} param
 * @returns
 */
 export function getSubTreeList(id) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/getSubTreeList?id='+id,
    method: 'get'
  });
}

/**
 * 获取指标对象下级列表（仅组织结构）
 * @param {*} param
 * @returns
 */
 export function getSubTreeOrgList(id) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/getSubTreeOrgList?id='+id,
    method: 'get'
  });
}

/**
 * 根据条件查询所有组织
 * @param {Object} param
 */
 export function getParentComObjectNo (objectId) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/getParentComObjectNo?id='+objectId,
    method: 'get'
  });
}

/**
 * 分页列表查询指标对象
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/pageList',
    method: 'post',
    data: param
  });
}

/**
 * 分页列表查询指标对象(含测点)
 * @param {*} param
 */
 export function getPointTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/pagePointList',
    method: 'post',
    data: param
  });
}

/**
* 保存指标对象
* @param {*} formData
*/
export function saveImObject(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/imObject/saveImObject',
  data: formData
});
}

/**
* 通过id查询指标对象
* @param {*} param
*/
export function queryById(param) {
return businessRequest({
  method: 'get',
  url: CALCULATION_URL() + `/api/imObject/queryById?id=${param}`
});
}

/**
* 通过id批量删除指标对象
* @param {*} ids
*/
export function deleteByIds(ids) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/deleteByIds',
    method: 'post',
    data: ids
  });
}

/**
* 通过编码查询指标对象是否已存在
* @param {*} param
*/
export function isExistsByObjectNo(objectNo,oldObjectNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imObject/isExistsByObjectNo?objectNo=${objectNo}&oldObjectNo=${oldObjectNo}`
  });
  }

/**
 * 根据条件查询所有组织
 * @param {Object} param
 */
 export function findAllByCondition (param) {
  return systemRequest({
    url: EXTEND_URL() + '/entity/findAllByCondition',
    method: 'post',
    data: param
  });
}


/**
 * 通过id查询上级指标对象Id列表
 * @param {Object} id
 */
 export function getRecParentObjectIdList(id) {
   return businessRequest({
     url: CALCULATION_URL() + '/api/imObject/getRecParentObjectIdList?id='+id,
     method: 'get'
   });
 }
