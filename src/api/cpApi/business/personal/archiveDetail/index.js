import { businessRequest } from '@/plugin/axios/index';

// 获取培训经历表格信息
export function getTrainTableData(param) {
    return businessRequest({
        method: 'get',
        url: `/api/archiveDetail/myTrainList`,
        params: param
    });
}

// 获取考试表格信息
export function getExamTableData(param) {
    return businessRequest({
        method: 'get',
        url: `/api/archiveDetail/myExamList`,
        params: param
    });
}

// 获取证书表格信息
export function getCertTableData(param) {
    return businessRequest({
        method: 'get',
        url: `/api/archiveDetail/myCertList`,
        params: param
    });
}