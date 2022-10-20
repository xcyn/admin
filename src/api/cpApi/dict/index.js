import { systemRequest } from '@/plugins/axios/index'

/**
 * 根据字典类型获取数据字典
 * @param {Object} query
 */
export function getDictByTypeKey(param) {
  return systemRequest({
    url: '/platform/v3/cat/dictionary/findByTypeKey',
    method: 'get',
    params: param
  })
}


export function getDictByTypeKeyExtend(param) {
  return systemRequest({
    url: '/extend/v3/cat/myDictionary/findByTypeKey',
    method: 'get',
    params: param
  })
}

/**
 * 获取设备分页列表
 * @param {Object} query
 */
export function findAssetPage(param) {
  return systemRequest({
    url: '/device/v3/asset/query',
    method: 'get',
    params: param
  })
}
