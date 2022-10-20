import { businessRequest,systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';


/**
 * 分页列表查询测点列表
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/dataSource/pageList',
    method: 'post',
    data: param
  });
}

  /**
  * 通过id查询测点数据源
  * @param {*} param
  */
  export function queryDataSourceById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/dataSource/queryDataSourceById?dsId=${param}`
  });
  }

/**
* 更新其他数据源为非缺省
* @param {*} formData
*/
export function updateDataSourceDefault(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/dataSource/updateDataSourceDefault',
  data: formData
});
}

/**
* 保存测点数据源
* @param {*} formData
*/
export function saveDataSource(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/dataSource/saveDataSource',
  data: formData
});
}

  /**
  * 通过id批量删除测点数据源
  * @param {*} dsIds
  */
  export function deleteDataSourceIds(dsIds) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/dataSource/deleteDataSourceIds',
      method: 'post',
      data: dsIds
    });
}


/**
  * 通过公司id查询启用的数据源
  * @param {*} param
  */
  export function queryDataSourceByComId(comId) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/dataSource/queryDataSourceByComId?comId=${comId}`
  });
  }
