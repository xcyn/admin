import { businessRequest, systemRequest } from '@/plugin/axios/index';
import { LEANPRODUCT_URL, EXTEND_URL } from '@/api/baseUrl';

/**
 * 查询机组价格明细信息
 * @param {*} param
 */
export function getUnitTable() {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/list/getUnitTable',
        method: 'post',
    });
}


/**
 * 查询取水用水明细信息
 * @param {*} param
 */
export function getDetailTable() {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/list/getDetailTable',
        method: 'post',
    });
}

/**
 * 获取取水类型单价信息
 * @param {*} param
 */
export function getListWithPrice() {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/fetchType/getListWithPrice',
        method: 'post',
    });
}

/**
 * 保存取水类型单价设置
 * @returns 
 */
export function saveLpFetchTypePrice(data){
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/fetchType/saveLpFetchTypePrice',
        method: 'post',
        data:data
    });
}

/**
 * 获取取水类型供水能力明细信息
 * @param {*} param
 */
export function getListWithLimit() {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/fetchType/getListWithLimit',
        method: 'post',
    });
}

/**
 * 保存取水类型供水能力信息
 * @returns 
 */
export function saveLpFetchTypeLimit(data) {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/fetchType/saveLpFetchTypeLimit',
        method: 'post',
        data: data
    });
}

/**
 * 获取水处理成本明细信息
 * @param {*} param
 */
export function getCostTypeList() {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/costType/getList',
        method: 'post',
    });
}

/**
 * 保存水处理成本明细信息
 * @returns 
 */
export function saveCostTypeList(data) {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/costType/saveCostTypeList',
        method: 'post',
        data: data
    });
}


/**
 * 获取取水类型条件设置明细信息
 * @param {*} param
 */
export function getListWithCond() {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/fetchType/getListWithCond',
        method: 'post',
    });
}

/**
 * 保存取水类型条件设置明细信息
 * @returns 
 */
export function saveLpFetchTypeCond(data) {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/fetchType/saveLpFetchTypeCond',
        method: 'post',
        data: data
    });
}


/**
 * 获取模拟分配数据
 * @param {*} param
 */
export function getLpSimulate() {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/list/getLpSimulate',
        method: 'post',
    });
}

/**
 * 模拟分配数据计算
 * @param {*} param
 */
export function simulateLpCalc(data) {
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/list/simulateLpCalc',
        method: 'post',
        data:data
    });
}

/**计算建议分配 */
export function lpCalc(){
    return businessRequest({
        url: LEANPRODUCT_URL() + '/api/list/lpCalc',
        method: 'post'
    });
}
