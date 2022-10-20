import { businessRequest } from '@/plugin/axios/index'
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询区域iot设备
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotAreaDevice/page',
    method: 'post',
    data: param
  })
}

/**
  * 通过id查询区域iot设备
  * @param {*} param
  */
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/queryById?id=${param}`
  })
}

/**
 * 同步iot设备
 */
export function synchrIotSystem(systemConfigId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/synchrIotSystem?systemConfigId=${systemConfigId}`
  })
}

/**
* 查询监控点预览页面的监控点树
* @param {*} param
*/
export function queryAreaCameraTree(iotSystem, companyId, areaId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/queryAreaCameraTree`,
    params: {
      iotSystem: iotSystem,
      companyId: companyId,
      areaId: areaId
    }
  })
}

/**
 * 更新关联的区域信息
 */
export function updateArea(indexCode, systemConfigId, areaId, areaNo, areaName) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/updateArea`,
    params: {
      indexCode: indexCode,
      systemConfigId: systemConfigId,
      areaId: areaId,
      areaNo: areaNo,
      areaName: areaName
    }
  })
}

/**
* 保存告警通知配置信息
* @param {*} formData
*/
export function saveArea(formData) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotAreaDevice/saveArea',
    data: formData
  })
}

/**
 * 获取视频预览流地址
 *
 * @param {*} indexCode 通道编码
 * @param {*} streamType 码流类型：1=主码流, 2=辅码流
 * @param {*} protocol 取流协议，包括 hik,rtsp,rtmp,hls,ws
 * @returns
 */
export function previewURLs(indexCode, streamType, protocol) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/previewURLs?indexCode=${indexCode}&streamType=${streamType}&protocol=${protocol}`
  })
}

/**
 *  获取视频回放流地址
 *
 * @param {*} indexCode 通道编码
 * @param {*} recordSource 录像来源：2=设备，3=中心
 * @param {*} startTime 开始时间(时间戳：单位秒)
 * @param {*} endTime 结束时间(时间戳：单位秒)
 * @param {*} streamType 码流类型：1=主码流， 2=辅码流；为空时默认查询主码流
 * @param {*} recordType 录像类型：1=一般录像，2=报警录像；为空时默认查询一般录像
 * @param {*} protocol 取流协议，包括 hik,rtsp,rtmp,hls,ws
 * @returns 客户端请求的URL
 */
export function playBackURLs(indexCode, recordSource, startTime, endTime, streamType, recordType, protocol) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/playBackURLs?indexCode=${indexCode}&recordSource=${recordSource}&startTime=${startTime}&endTime=${endTime}&streamType=${streamType}&recordType=${recordType}&protocol=${protocol}`
  })
}

/**
  * 根据设备编码获得设备的iot系统记录
  *
  * @param {*} indexCode 设备编码
  */
export function getIotSystemConfig(indexCode) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/getIotSystemConfig?indexCode=${indexCode}`
  })
}

/**
 * 云台方向控制
 *
 * @param {*} channelId 通道编码
 * @param {*} direct 方向：1=上，2=下，3=左，4=右，5=左上，6=左下，7=右上，8=右下
 * @param {*} stepX 水平方向步长
 * @param {*} stepY 垂直方向步长
 * @param {*} command 命令：0=停止, 1=开启
 * @param {*} extend 扩展数据
 * @returns
 */
export function operateDirect(channelId, direct, stepX, stepY, command, extend) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/operateDirect`,
    params: {
      channelId: channelId,
      direct: direct,
      stepX: stepX,
      stepY: stepY,
      command: command,
      extend: extend
    }
  })
}

/**
 * 云台镜头控制
 *
 * @param {*} channelId 通道编码
 * @param {*} operateType 操作类型：1=变倍，2=变焦，3=光圈
 * @param {*} direct 方向：1=增加，2=减小
 * @param {*} step 步长
 * @param {*} command 命令：0=停止动作，1=开启动作
 * @param {*} extend 扩展数据
 * @returns
 */
export function operateCamera(channelId, operateType, direct, step, command, extend) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/operateCamera`,
    params: {
      channelId: channelId,
      operateType: operateType,
      direct: direct,
      step: step,
      command: command,
      extend: extend
    }
  })
}

/**
 * 视频截图
 *
 * @param {*} channelId 通道编码
 * @returns
 */
export function videoScreenshot(channelId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/videoScreenshot?channelId=${channelId}`
  })
}

/**
 * 获得图片路径
 *
 * @param {*} param
 */
export function getPicturePath(systemConfigId, picture, svrIndexCode) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/getPicturePath?systemConfigId=${systemConfigId}&picture=${picture}&serverIndexCode=${svrIndexCode}`
  })
}

/**
 * 获得图片Base64位编码
 *
 * @param {*} param
 */
 export function getBase64Images(picture, svrIndexCode) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/iotAreaDevice/getBase64Images`,
      params: {
        picture: picture,
        svrIndexCode: svrIndexCode
      }
    })
  }

export function getTodayDeviceAndAlarmList(areaNo) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/getTodayDeviceAndAlarmList`,
    params: {
      areaNo: areaNo
    }
  })
}

/**
 * 根据区域id查询区域下的视频监控点和门禁点以及电子围栏
 *
 * @param {*} param
 */
export function getIsCamerasDoorsByAreaId(areaId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/getIsCamerasDoorsByAreaId`,
    params: {
      areaId: areaId
    }
  })
}

/**
 * 获得设备顶级区域树
 */
export function getDeviceTopTreeList(iotSystemCode, companyId, areaId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAreaDevice/getDeviceTopTreeList`,
    params: {
      iotSystemCode: iotSystemCode,
      companyId: companyId,
      areaId: areaId
    }
  })
}

/**
 * 根据区域ID查询下级区域及设备
 */
export function getDeviceSubTreeList(iotSystemCode, id) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + '/iotAreaDevice/getDeviceSubTreeList',
    params: {
      iotSystemCode: iotSystemCode,
      id: id
    }
  })
}

/**
* 批量更新设备区域
* @param {*} formData 
*/
export function batchUpdateDeviceArea(param) {
    return businessRequest({
      method: 'post',
      url: EQUIPMENT_URL() + '/iotAreaDevice/batchUpdateDeviceArea',
      data: param
    })
  }

/**
  * 更新移动布控
  * @param {*} param
  */
 export function updateMoveControl(id,isMoveControl) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/iotAreaDevice/updateMoveControl?id=${id}&isMoveControl=${isMoveControl}`
    })
  }  