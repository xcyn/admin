import { businessRequest,systemRequest } from '@/plugin/axios/index';
import { CALCULATION_URL,EXTEND_URL } from '@/api/baseUrl';

/**
 * 室外温度控制
 * @param {*} formData
 */
 export function doTempControls(formData) {
    return businessRequest({
      method: 'post',
      url: CALCULATION_URL() + '/api/temp/doTempControls',
      data: formData
    });
  }

  /**
   * 查询当前最新温度数据
   * @returns 
   */
  export function getLastTemp(){
    return businessRequest({
        method: 'post',
        url: CALCULATION_URL() + '/api/monweather/getLastTemp',
        data: {}
      });
  }