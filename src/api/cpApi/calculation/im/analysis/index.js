import { businessRequest,systemRequest } from '@/plugin/axios/index';
import { CALCULATION_URL,DEVICE_URL,EQUIPMENT_URL } from '@/api/baseUrl';
/**
 * 获取单指标分析表格数据
 * @param {} param 
 * @returns 
 */
export function getIndicatChartTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imAnalysis/getIndicatChartTable',
      method: 'post',
      data: param
    });
  }

  /**
 * 获取单指标分析图表数据
 * @param {} param 
 * @returns 
 */
export function getIndicatChart(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imAnalysis/getIndicatChart',
      method: 'post',
      data: param
    });
  }

/**
 * 获取指标对标分析表格数据
 * @param {} param 
 * @returns 
 */
 export function getIndicatBenchChartTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getIndicatBenchChartTable',
    method: 'post',
    data: param
  });
}

/**
* 获取指标对标分析图表数据
* @param {} param 
* @returns 
*/
export function getIndicatBenchChart(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getIndicatBenchChart',
    method: 'post',
    data: param
  });
}
  



/**
 * 获取多指标分析表格数据
 * @param {} param 
 * @returns 
 */
 export function getMultiIndicatChartTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getMultiIndicatChartTable',
    method: 'post',
    data: param
  });
}

/**
* 获取多指标分析图表数据
* @param {} param 
* @returns 
*/
export function getMultiIndicatChart(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getMultiIndicatChart',
    method: 'post',
    data: param
  });
}


export function getImDataByObjectsTime(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getImDataByObjectsTime',
    method: 'post',
    data: param
  });
}

export function getImDataByTime(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getImDataByTime',
    method: 'post',
    data: param
  });
}

/**
 * 查询指定类型和时间的指标结果数据,单对象,多指标,指标名称不含单位 */
export function getImDataByTimeNoUnit(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getImDataByTimeNoUnit',
    method: 'post',
    data: param
  });
}


export function getImDataByTimeCodes(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getImDataByTimeCodes',
    method: 'post',
    data: param
  });
}


export function getMultiImDataByTime(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getMultiImDataByTime',
    method: 'post',
    data: param
  });
}

export function getOrderMultiImDataByTime(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getOrderMultiImDataByTime',
    method: 'post',
    data: param
  });
}

//该方法废弃了，device服务废弃，使用equipment服务了,如需使用，需先添加微服务接口
/* export function getEqLocationByTypeNos(companyId, eqTypeNos){
  return systemRequest({
    url: DEVICE_URL() + '/equipmentLocation/getEqLocationByTypeNos?companyId='+companyId+'&eqTypeNos='+eqTypeNos,
    method: 'get'
  });
} */

export function getHeatDeviation(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getHeatDeviation',
    method: 'post',
    data: param
  });
}


export function getSubObjectByNoAndType(objectNo, typeNo){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imObject/getList',
    method: 'post',
    data:{pObjectNos:objectNo,objectTypeNo:typeNo}
  });
}


export function getHeatPipeSteamPressure(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getHeatPipeSteamPressure',
    method: 'post',
    data: param
  });
}

export function getHeatPipeWaterPressure(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imAnalysis/getHeatPipeWaterPressure',
    method: 'post',
    data: param
  });
}

export function getEqLocationByLocaNo(locaNo){
  return systemRequest({
    url: EQUIPMENT_URL()+'/eqLocation/getEqLocationByLocaNo?locaNo='+locaNo,
    method: 'get'
  });
  
}

export function getIndicatorList(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/indicator/selectList',
    method: 'post',
    data: param
  });
}

export function getLastImData(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/imData/getLastImData',
    method: 'post',
    data: param
  });
}


export function selectImDataByNoAndTime(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imData/selectImDataByNoAndTime',
    method: 'post',
    data: param
  });
}

export function getIndicatorInfo(indicatorNo){
  return businessRequest({
    url: CALCULATION_URL() + '/api/indicator/queryInfoByIndicatorNo?indicatorNo='+indicatorNo,
    method: 'get'
  });
}
