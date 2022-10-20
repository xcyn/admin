import { businessRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 分页列表查询主题
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imTheme/pageList',
    method: 'post',
    data: param
  });
}

/**
* 保存主题
* @param {*} formData
*/
export function saveImTheme(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/imTheme/saveImTheme',
  data: formData
});
}

/**
* 通过id查询主题
* @param {*} param
*/
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imTheme/queryById?id=${param}`
  });
}

/**
* 通过id批量删除主题
* @param {*} catNos
*/
export function deleteByIds(catNos) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imTheme/deleteByIds',
    method: 'post',
    data: catNos
  });
}

/**
* 通过编码查询主题是否已存在
* @param {*} param
*/
export function isExistsByThemeNo(imThemeNo,oldImThemeNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imTheme/isExistsByThemeNo?imThemeNo=${imThemeNo}&oldImThemeNo=${oldImThemeNo}`
  });
}

/**查询主题列表(不分页)， 一般要传有效值isOn = 1  */
export function getThemeList(param){
  return businessRequest({
    url:CALCULATION_URL() + '/api/imTheme/selectList',
    method:'post',
    data:param
  })
}