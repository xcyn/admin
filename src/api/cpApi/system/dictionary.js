import { systemRequest, generateQueryString } from '../../plugin/axios/index';

/**
 * 获取字典数据列表
 *
 * @param {Object} query 查询条件对象
 * @author 管超
 */
export function get(query) {
  const queryString = generateQueryString(query);
  return systemRequest({
    method: 'get',
    url: `/dictionaries${queryString}`
  });
}

/**
 * 根据字典 id 获取详情
 *
 * @param {string} id 字典 id
 * @author 管超
 */
export function getById(id) {
  return systemRequest({
    method: 'get',
    url: `/dictionaries/${id}`
  });
}

/**
 * 根据父级字典 id 获取其子节点字典数据列表
 *
 * @param {string} id 父级字典 id
 * @author 管超
 */
export function getChildrenById(id) {
  return systemRequest({
    method: 'get',
    url: `/dictionaries/${id}/children`
  });
}

/**
 * 根据编码获取字典（lite）
 *
 * @param {string} code 编码
 * @author 管超
 */
export function getDictionaryLite(code) {
  const query = { code };
  return get(query) // 1. 根据编码查询当前字典实体以获取其唯一标识符
    .then((value1) => {
      if (value1.items.length === 1) { // 根据编码查询出的结果只能有一个，如果结果为空则此编码有误；如果结果超过一个则数据库数据有误
        return getChildrenById(value1.items[0].id) // 2. 根据唯一标识符获取其下属字典集合
          .then((value2) => {
            return Promise.resolve(value2);
          });
      } else {
        return Promise.resolve([]);
      }
    });
}

/**
 * 添加字典
 *
 * @param {Object} dictionary 字典
 * @author 管超
 */
export function add(dictionary) {
  return systemRequest({
    method: 'post',
    url: `/dictionaries`,
    data: dictionary
  });
}

/**
 * 更新字典
 *
 * @param {Object} dictionary 字典
 * @author 管超
 */
export function update(dictionary) {
  return systemRequest({
    method: 'put',
    url: `/dictionaries/${dictionary.id}`,
    data: dictionary
  });
}

/**
 * 移除字典
 *
 * @param {string} id 字典 id
 * @author 管超
 */
export function remove(id) {
  return systemRequest({
    method: 'DELETE',
    url: `/dictionaries/${id}`
  });
}
