import { businessRequest } from '@/plugin/axios/index';

// 获取表格信息
export function getTable(param) {
    return businessRequest({
        url: '/api/wrongTopSet/list',
        method: 'get',
        params: param
    });
}

// 错误次数加一
export function updateError(param) {
    return businessRequest({
        url: '/api/wrongTopSet/updateError',
        method: 'post',
        params: param
    });
}

// 状态修改
export function updateStatus(param) {
    return businessRequest({
        url: '/api/wrongTopSet/updateStatus',
        method: 'post',
        params: param
    });
}

// 通过考试ID查询试题
export function getExamTopic(param) {
    return businessRequest({
        method: 'get',
        url: `/api/wrongTopSet/queryExamTopicByExamId?id=${param}`
    });
}

// 添加
export function addRandomExam(param) {
    return businessRequest({
        method: 'post',
        url: `/api/examAnswer/add`,
        data: param
    });
}