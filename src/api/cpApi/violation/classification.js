import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function detailData(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationsCategory/' + query,
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
        url: SAFEPRO_URL() + '/violationsCategory/' + query,
        method: 'post',
    });
}

export function addData(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationsCategory/add',
        method: 'post',
        data: query
    });
}

export function list(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationsCategory/list',
        method: 'post',
        data: query
    });
}
export function saveOrUpdateList(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationsCategory/saveOrUpdateList',
        method: 'post',
        data: query
    });
}

export function updateData(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/violationsCategory/update',
        method: 'post',
        data: query
    });
}