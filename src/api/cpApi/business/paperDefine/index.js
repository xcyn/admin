import { businessRequest } from '@/plugin/axios'
import { EXAMINATION_URL } from '@/api/baseUrl'

/**
 * 列表
 *
 * @author
 */
export function getTable(param) {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/paperDefine/list',
    method: 'get',
    params: param
  })
}

// 添加
export function addPaper(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/paperDefine/add`,
    data: param
  })
}

// 修改
export function editPaper(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/paperDefine/edit`,
    data: param
  })
}

// 通过ID 查询
export function getPaper(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/paperDefine/queryById?id=${param}`
  })
}

// 查询题库
export function getTopicCatalog() {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/topicCatalog/queryTopicCatalog`
  })
}

// 通过题库，题型查询
export function getTopicParam(parama, paramb) {
  return businessRequest({
    method: 'get',
    url:
      EXAMINATION_URL() +
      `/api/topic/queryByParam?topicCatalogId=${parama}&topicType=${paramb}`
  })
}

// 作废
export function paperCancellation(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/paperDefine/paperCancellation?id=${param}`
  })
}
