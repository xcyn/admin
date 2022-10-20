/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      安全检查项问题
 *  @how2use:         import * as issueApi from '@/api/cpApi/processManage/check/std/issue.js';
 *********************************************************************************************************
 */
import { businessRequest } from '@/plugins/axios/index'
import { SAFEPRO_URL } from '@/api/baseUrl'
const REST_URL_PREFIX = SAFEPRO_URL() + '/check/std/issue'

// ------------------------------------------------------Start------------------------------------------------------
/**
 * 新增_实体
 * @param {} params
 */
export function insert (params) {
    return businessRequest({
        url: REST_URL_PREFIX + '/insert',
        method: 'post',
        data: params
    })
}

/**
 * 删除_主键
 * @param {} params
 */
export function deleteById (stdItemId) {
    return businessRequest({
        url: REST_URL_PREFIX + '/deleteById?stdItemId=' + `${stdItemId}`,
        method: 'get'
    })
}

/**
 * 修改_主键
 * @param {} params
 */
export function updateById (params) {
    return businessRequest({
        url: REST_URL_PREFIX + '/updateById',
        method: 'post',
        data: params
    })
}

/**
 * 查询_主键
 * @param {} params
 */
export function getById (stdItemId) {
    return businessRequest({
        url: REST_URL_PREFIX + '/getById?stdItemId=' + `${stdItemId}`,
        method: 'get'
    })
}

/**
 * 查询_无条件全查
 * @param {} params
 */
export function getList () {
    return businessRequest({
        url: REST_URL_PREFIX + '/get/list',
        method: 'get'
    })
}

/**
 * 查询_标准项ID
 * @param {} params
 */
export function getListByStdItemId (params) {
    return businessRequest({
        url: REST_URL_PREFIX + '/get/list/byStdItemId',
        method: 'get',
        params
    })
}
