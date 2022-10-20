import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function detailData(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/antiViolation/' + query,
        method: 'get'
    });
}


export function deleteData(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/antiViolation/' + query,
        method: 'post',
    });
}


export function list(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/antiViolation/list',
        method: 'post',
        data: query
    });
}
export function saveOrUpdateList(query) {
    return businessRequest({
        url: SAFEPRO_URL() + '/antiViolation/saveOrUpdate',
        method: 'post',
        data: query
    });
}