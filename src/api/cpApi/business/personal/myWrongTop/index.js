import { businessRequest } from '@/plugin/axios/index';

// 错题集表查询
export function getTable(param) {
    return businessRequest({
        method: 'get',
        url: `/api/myWrongTop/list`,
        params: param
    });
}

// 添加
export function addFileCollection(param) {
    return businessRequest({
        method: 'post',
        url: `/api/fileCollection/add`,
        data: param
    });
}

// 通过ID 查询
export function getFileCollection(param) {
    return businessRequest({
        method: 'get',
        url: `/api/fileCollection/queryById?id=${param}`
    });
}

// 删除
export function deleteFileCollection(param) {
    return businessRequest({
        method: 'delete',
        url: `/api/fileCollection/delete?id=${param}`
    });
}