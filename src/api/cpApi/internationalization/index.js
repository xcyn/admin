import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 查询顶级标签目录树
 */
export function getTopTreeList() {
  return request({
    url: EXTEND_URL() + '/cpisIntlCatFront/getTopTreeList',
    method: 'get'
  })
}

/**
 * 根据标签目录id查询下级标签目录树
 */
export function getSubTreeList(parentId) {
  return request({
    url: EXTEND_URL() + '/cpisIntlCatFront/getSubTreeList',
    method: 'get',
    params: { parentId }
  })
}

/**
 * 根据id查询标签目录
 * @param {*} params
 */
export function queryCatById(id) {
  return request({
    url: EXTEND_URL() + '/cpisIntlCatFront/queryById',
    method: 'get',
    params: { id }
  })
}

/**
 * 查询标签目录列表信息
 */
export function getCatList(params) {
  return request({
    url: EXTEND_URL() + '/cpisIntlCatFront/getList',
    method: 'post',
    data: params
  })
}

/**
 * 查询标签列表信息
 */
export function getLabelList(params) {
  return request({
    url: EXTEND_URL() + '/cpisIntlFront/getPageList',
    method: 'post',
    data: params
  })
}

/**
 * 根据id查询标签
 * @param {*} params
 */
export function queryLabelById(id) {
  return request({
    url: EXTEND_URL() + '/cpisIntlFront/queryById',
    method: 'get',
    params: { id }
  })
}

/**
 * 标签添加或修改
 * @param {*} params
 */
export function saveLabel(params) {
  return request({
    url: EXTEND_URL() + '/cpisIntlFront/saveOrUpdate',
    method: 'post',
    data: params
  })
}

/**
 * 查询标签翻译列表信息
 */
export function getLabelTrList(params) {
  return request({
    url: EXTEND_URL() + '/cpisIntlFrontTr/getList',
    method: 'post',
    data: params
  })
}

/**
 * 根据语言类型查询标签翻译列表信息
 */
export function getLabelTrListByLang(language) {
  return request({
    url: EXTEND_URL() + '/cpisIntlFrontTr/listByLanguage',
    method: 'get',
    params: { language }
  })
}

/**
 * 导入Excel
 */
export function importData(params) {
  return request({
    url: EXTEND_URL() + '/cpisIntlFrontTr/importData',
    method: 'post',
    data: params
  })
}
