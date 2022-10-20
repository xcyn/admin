import { businessRequest,systemRequest } from '@/plugin/axios/index';
import { CALCULATION_URL,EXTEND_URL } from '@/api/baseUrl';

/**
 * modbus非标测点下发控制
 * @param {*} formData
 */
 export function updateMpModbusVal(formData) {
    return businessRequest({
      method: 'post',
      url: CALCULATION_URL() + '/api/meaPointModbus/updateMpModbusVal',
      data: formData
    });
  }