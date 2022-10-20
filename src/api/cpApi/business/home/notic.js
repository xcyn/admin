import { businessRequest } from '@/plugin/axios/index';

// 获取首页通知信息
export function getTable(param) {
    return businessRequest({
        method: 'get',
        url: `web/notic/list`,
        params: param
    });
}