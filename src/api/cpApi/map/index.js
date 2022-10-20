import { businessRequest,systemRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';
/**
 * 获取区域中心点信息
 * @param {} param
 * @returns
 */
export function getAreaCenterInfo(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/mapAreaCenter/getAreaCenterInfo',
      method: 'post',
      data: param
    });
  }
