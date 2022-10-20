import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 分页列表查询测点
 * @param {*} param
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/meaPoint/pageList',
      method: 'post',
      data: param
    });
}
