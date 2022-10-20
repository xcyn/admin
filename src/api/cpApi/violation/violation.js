import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function detailData(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationItem/' + query,
        method: 'get'
    });
}
export function getTree(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationsCategory/tree',
        method: 'get',
        params: query,
    });
}


export function deleteData(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationItem/' + query,
        method: 'post',
    });
}


export function list(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationItem/list',
        method: 'post',
        data: query
    });
}
export function saveOrUpdateList(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationItem/saveOrUpdateList',
        method: 'post',
        data: query
    });
}