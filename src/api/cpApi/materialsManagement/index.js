//统一axios对象
import { businessRequest } from '@/plugins/axios/index';
//物资管理统一请求地址前缀
import { METERIAL_URL, WORKORDER_URL } from '@/api/baseUrl';
import * as utils from "@/utils/cpUtils/index";

//拼接URL地址
function getUrl(url) {
    return METERIAL_URL() + url;
}

export function getDefectInfo(id) {
    return businessRequest({
        url: WORKORDER_URL() + "/api/defectInfo/getById/" + id,
        method: "POST"
    });
}

/**
 * 物资管理统一请求，拼接地址方法
 * @param {String} url 请求地址
 * @param {String} method 请求方式 POST || GET  || PUT ||DELETE
 * @param {String} query ||请求参数，可为空
 */
export function request(url, method, query) {
    return businessRequest({
        url: getUrl(url),
        method: method,
        data: query
    });
}


/**
 * 物资管理统一GET请求，拼接地址方法
 * @param {String} url 请求地址
 * @param {String} query ||请求参数，可为空
 */
export function getRequest(url, query) {
    url = getUrl(url);
    if (query) {
        url += query;
    }
    return businessRequest({
        url: url,
        method: 'get'
    });
}


/**
 * 物资管理统一POST请求，拼接地址方法
 * @param {String} url 请求地址
 * @param {String} query ||请求参数，可为空
 */
export function postRequest(url, query) {
    let sUrl = getUrl(url);
    if (sUrl.indexOf("?") > -1) {
        sUrl += '&';
    } else {
        sUrl += '?';
    }
    let userInfo = utils.getLoginInfo();
    sUrl += `username=${encodeURIComponent(userInfo.employee.name)}`
    return businessRequest({
        url: sUrl,
        method: 'post',
        data: query
    });
}

/**
 * 物资管理统一delete请求，拼接地址方法
 * @param {String} url 请求地址
 * @param {String} query ||请求参数，可为空
 */
export function deleteRequest(url, query) {
    return businessRequest({
        url: `${getUrl(url)}/${query}`,
        method: 'delete'
    });
}

/**
 * 物资管理统一PUT请求，拼接地址方法
 * @param {String} url 请求地址
 * @param {String} query ||请求参数，可为空
 */
export function putRequest(url, query) {
    return businessRequest({
        url: getUrl(url),
        method: 'put',
        data: query
    });
}