import { businessRequest } from '@/plugin/axios'
import { EXAMINATION_URL } from '@/api/baseUrl'

/**
 * 列表
 *
 * @author
 */
export function getTable(param) {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/topic/list',
    method: 'get',
    params: param
  })
}

/**
 * 获取题库目录树
 * @returns {*}
 */
export function getTree() {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/topicCatalog/getUseTree`
  })
}

/**
 *
 * @returns {*}
 */
export function getCatalog(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/topicCatalog/queryById?id=${param}`
  })
}

// 添加
export function addTopic(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/topic/add`,
    data: param
  })
}

// 修改
export function editTopic(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/topic/edit`,
    data: param
  })
}

// 启用禁用
export function topicEnable(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/topic/topicEnable`,
    data: param
  })
}

// 通过ID 查询
export function getTopic(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/topic/queryById?id=${param}`
  })
}

// 通过题库，题型查询
export function getTopicByParam(parama, paramb) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/topic/queryTopicByParam?topicCatalogId=${parama}&topicType=${paramb}`
  })
}

// 文件下载
export function downloadFile(url) {
  return businessRequest({
    method: 'get',
    url: url,
    responseType: 'blob'
  })
}
