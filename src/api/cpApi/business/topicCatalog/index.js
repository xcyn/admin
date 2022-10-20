import { businessRequest } from '../../../../plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

/**
 * 获取题库目录树
 * @returns {*}
 */
export function getTree() {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/topicCatalog/getTree`
  })
}

// 获取表格信息
export function getTable(code) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/topicCatalog/list`
  })
}

// 添加题库目录
export function addCatalog(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/topicCatalog/add`,
    data: param
  })
}

// 修改
export function editCatalog(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/topicCatalog/edit`,
    data: param
  })
}

// 通过IDs 查询
export function getCatalogNames(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/topicCatalog/queryTopicCatalogName?param=${param}`
  })
}
