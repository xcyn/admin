import { systemRequest } from '@/plugin/axios/index'

/**
 * 初始化区域列表信息
 */
export function initAreaData(params) {
  return systemRequest({
    url: '/device/v3/area/query',
    method: 'post',
    data: params
  })
}

/**
 * 初始化区域列表信息
 */
export function getArea(areaId) {
  return systemRequest({
    url: `/device/v3/area/get?areaId=${areaId}`,
    method: 'get'
  })
}

/**
 * 初始化顶级区域列表信息
 */
export function initTopAreaTree() {
  let companyParam = {
    'parameters': [
      {
        'key': 'key',
        'value': 'Dialog_Tree_Area'
      },
      {
        'key': 'Q^p_area_id^SIE'//p_area_id is null
        //'value': ""

      }
    ]
  }

  return systemRequest({
    url: '/business/v3/data/template/queryDataByKey',
    method: 'post',
    data: companyParam
  })
}

/**
 * 查询子级区域列表信息
 */
export function initSubAreaTree(pAreaId) {
  let companyParam = {
    'parameters': [
      {
        'key': 'key',
        'value': 'Dialog_Tree_Area'
      },
      {
        'key': 'Q^p_area_id^S',
        'value': pAreaId

      }
    ]
  }

  return systemRequest({
    url: '/business/v3/data/template/queryDataByKey',
    method: 'post',
    data: companyParam
  })
}
