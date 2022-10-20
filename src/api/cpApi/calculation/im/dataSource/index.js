import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取指标数据源配置列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imDataSource/getList',
      method: 'post',
      data: param
    });
}

/**
 * 分页获得指标数据源配置列表
 * @param {*} param 
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imDataSource/pageList',
      method: 'post',
      data: param
    });
}

/**
* 保存指标数据源配置
* @param {*} formData 
*/
export function saveImDataSource(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/imDataSource/saveImDataSource',
    data: formData
  });
  }
  
  /**
  * 通过id查询指标数据源配置
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imDataSource/queryById?id=${param}`
  });
  }
  
  /**
  * 通过id批量删除指标数据源配置
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imDataSource/deleteByIds',
      method: 'post',
      data: ids
    });
  }

  export function isExistsByDsName(dsName, oldDsName,companyId){
    return businessRequest({
      url: CALCULATION_URL() + '/api/imDataSource/isExistsByDsName',
      method: 'post',
      data: {dsName:dsName,oldDsName:oldDsName,companyId:companyId}
    })
  }
 