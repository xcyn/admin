import { businessRequest,systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';


/**
  * 通过id查询测点收藏信息
  * @param {*} param
  */
export function queryGroupByMpId(mpId, userId) {
    return businessRequest({
      method: 'get',
      url: CALCULATION_URL() + `/api/mpGroup/queryGroupByMpId?mpId=${mpId}&userId=${userId}`
    });
}
  

/**
 * 保存测点收藏信息
 * @param {*} formData
 */
export function saveMpGroupDetail(formData) {
    return businessRequest({
        method: 'post',
        url: CALCULATION_URL() + '/api/mpGroup/saveMpGroupDetail',
        data: formData
    });
} 
  
/**
 * 分页列表查询测点收藏列表
 * @param {*} param
 */
 export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/mpGroup/mpGroupDetailPage',
    method: 'post',
    data: param
  });
}

/**
 * 列表查询测点收藏明细
 * @param {*} param
 */
 export function getDetailList(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/mpGroup/mpGroupDetailList',
    method: 'post',
    data: param
  });
}

/**
 * 取消收藏
 */
 export function deleteByMpGroupDetailIds(param){
  return businessRequest({
    url: CALCULATION_URL() + '/api/mpGroup/deleteByMpGroupDetailIds',
    method: 'post',
    data: param
  });
 }

 /**
  * 收藏夹列表
  */
  export function getGroupList(userId){
    return businessRequest({
      url: CALCULATION_URL() + `/api/mpGroup/getGroupList?userId=${userId}`,
      method: 'get'
    });
   }

/**
 * 修改收藏夹名称
 */
export function saveMpGroup(param){
  return businessRequest({
    url: CALCULATION_URL() + `/api/mpGroup/saveMpGroup`,
    method: 'post',
    data: param
  });
}

/**
 * 删除收藏夹
 */
 export function deleteByMpGroupIds(param){
  return businessRequest({
    url: CALCULATION_URL() + `/api/mpGroup/deleteByMpGroupIds`,
    method: 'post',
    data: param
  });
}
