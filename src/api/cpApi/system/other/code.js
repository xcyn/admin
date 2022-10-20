import { businessRequest } from '@/plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 查询数据字典

// 获取表格信息
export function getCode(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/code/queryByCatNo?catNo=' + param
  })
}

// 根据类型，code值 获取中文值
export function getCodeValue(param, code) {
  businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/code/queryByCatNo?catNo=' + param
  }).then(res => {
    let result = res.result
    if (result) {
      result.forEach(item => {
        if (code === item.codeNo) {
          return item.codeName
        }
      })
    } else {
      return ''
    }
  }).catch(error => {
    console.log(error)
  })
}

// 根据数据字典集合，传入的code值，查询value值
export function getCodeValueByList(param, code) {
  if (param) {
    for (var i = 0; i < param.length; i++) {
      if (code === param[i].codeNo) {
        return param[i].codeName
      }
    }
  } else {
    return ''
  }
}

export function getValueByList(param, code) {
  if (param) {
    for (var i = 0; i < param.length; i++) {
      if (code === param[i].key) {
        return param[i].name
      }
    }
  } else {
    return ''
  }
}
