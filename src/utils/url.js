
/**
 *  Url工具类
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2020-07-02-下午10:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import { getToken } from '@/utils/auth'
import { FORM_TOKEN_KEY } from '@/constant'

import pathToRegex from 'path-to-regexp'
const hostRegex = /^(http|https):\/\/[\w.:]*\//
const httpRegex = /^(http|https):\/\/[\w.:]*/

/**
 *
 * @param {*} url
 */
export function transformUrl(url) {
  const reg = new RegExp(`{${FORM_TOKEN_KEY}}`, 'g')
  return url ? url.replace(reg, getToken()) : ''
}

/**
 * 参数字符串转换成对象形式，如：a=1&b=2 转换成 {a:1, b:2}
 * @param {String} str 需要转换的字符串
 * @param {String} [sep=&] 连接符，可选，默认 &
 * @param {String} [eq==] 键值间隔符，可选，默认 =
 * @returns {Object}
 */
export function parse(str, sep, eq) {
  const obj = {}
  str = (str || location.search).replace(/^[^]*\?/, '')
  sep = sep || '&'
  eq = eq || '='
  let arr
  const reg = new RegExp('(?:^|\\' + sep + ')([^\\' + eq + '\\' + sep + ']+)(?:\\' + eq + '([^\\' + sep + ']*))?', 'g')
  while ((arr = reg.exec(str)) !== null) {
    if (arr[1] !== str) {
      obj[decodeURIComponent(arr[1])] = decodeURIComponent(arr[2] || '')
    }
  }
  return obj
}

/**
 * 键值对转换成查询字符串
 * @param {object} query 键值对，对象
 * @returns {string} 查询参数字符串
 */
export function stringify(query) {
  const array = []
  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      array.push([key, encodeURIComponent(query[key])].join('='))
    }
  }
  return array.join('&')
}

/**
 * 获取url的Host段，
 * @param {string} url URL地址
 * @returns {string} Host
 *
 * @example
 *
 * let url = 'http://127.0.0.1:8080/api/abc/123'
 * getHost(url) // -> http://127.0.0.1:8080/
 */
export function getHost(url) {
  const matches = url.match(hostRegex)
  if (matches) {
    return matches[0]
  }
  return ''
}

/**
 * 是否是http或https的地址
 * @param {*} url
 *
 *   @returns {Boolean}  是否是http地址
 */
export function isHttp(url) {
  return !!url.match(httpRegex)
}

/**
 * 从url 的 path中提取参数对象，
 * @param {string} regexUrl url path规则表达式
 * @param {string} url URL
 * @returns {object} 获取参数键值对
 *
 * @example
 *
 * let   url = '/api/abc/123'
 *   regexUrl = '/api/:type/:id' ,
 *
 * getParams(url,regexUrl) // -> {type: 'abc', id: 123}
 *
 */
export function getParams(url, regexUrl) {
  const keys = []
  const host = getHost(regexUrl)
  // 先排除host段，因为host段的端口号与参数写法有冲突
  const regex = pathToRegex(regexUrl.replace(host, ''), keys)
  // 排除url参数部分
  const matches = regex.exec(url.split('?')[0].replace(host, ''))
  const params = {}
  if (matches && matches.length > 0) {
    keys.forEach((key, index) => {
      params[key.name] = matches[index + 1]
    })
  }
  return params
}

/**
 * 在url追加参数
 * @param {string} url 原本的url（可能带有url）
 * @param {string|object} query 需要追加的参数，Object|String
 * @returns {string} 追加参数后的url
 */
export function appendQuery(url, query) {
  query = typeof query === 'string' ? parse(query) : query
  const path = url.split('?')[0]
  const originalQuery = parse(url)
  const joinQuery = Object.assign({}, originalQuery, query)
  const queryStr = stringify(joinQuery)
  return queryStr ? [path, queryStr].join('?') : url
}
