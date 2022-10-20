import { businessRequest,systemRequest } from '@/plugin/axios/index';
import { CALCULATION_URL,EXTEND_URL ,ORG_URL} from '@/api/baseUrl';

/**
 * 分页列表查监控信息
 * @param {*} param
 */
 export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/eamRecord/pageList',
      method: 'post',
      data: param
    });
}

/**
 * 通过ID批量删除告警信息
 * @param {*} ids
 */
 export function deleteByIds (ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amAlarm/deleteByIds',
      method: 'post',
      data: ids
    });
}

/**
 * 获取所有员工信息
 * @param {*} params
 */
 export function findAll(params) {
    return systemRequest({
        url: ORG_URL() + '/employee/findAll',
        method: 'get',
        params
    })
}

