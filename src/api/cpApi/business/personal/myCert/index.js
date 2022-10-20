import { businessRequest } from '@/plugin/axios/index';

// 获取表格信息
export function getTable(param) {
    return businessRequest({
        method: 'get',
        url: `/api/certificateIsn/queryMyCertPageList`,
        params: param
    });
}

// 证书发放审核
export function certAudit(param) {
    return businessRequest({
        method: 'get',
        url: `/api/certificateIsn/certAudit?id=${param}`
    });
}