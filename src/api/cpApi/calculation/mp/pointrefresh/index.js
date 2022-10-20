import { businessRequest, systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';


/**
 * 分页列表查询测点列表
 * @param {*} param
 */
export function getTable(param) {
    return businessRequest({
        url: CALCULATION_URL() + '/api/pointRefresh/pageList',
        method: 'post',
        data: param
    });
}

export function selectList(param) {
    return businessRequest({
        url: CALCULATION_URL() + '/api/pointRefresh/selectList',
        method: 'post',
        data: param
    });
}

/**
* 保存测点信息
* @param {*} formData
*/
export function saveMesPoint(params) {
    return businessRequest({
        method: 'post',
        url: CALCULATION_URL() + '/api/pointRefresh/saveMpPointRefresh',
        data: params
    });
}

/**
* 通过id批量删除实时刷新测点信息
* @param {*} ids
*/
export function deleteByIds(ids) {
    return businessRequest({
        url: CALCULATION_URL() + '/api/pointRefresh/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
* 批量获取测点值
* @param {*} param
*/
export function getRealtimeValues(param) {
    return businessRequest({
        url: CALCULATION_URL() + '/api/CPSIS/getRealtimeValues',
        method: 'post',
        data: param
    });
}
