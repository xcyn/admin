// 数据异常接口
import * as REQUEST from '../index';
const key = 'dataException';

export function list(query) {
  return REQUEST.postRequest(`/api/${key}/listData`, query)
}

