import { businessRequest, ibpsRequest } from '@/plugins/axios/index';

// 查询数据字典

/*// 获取表格信息
export function getCode(param) {
  return businessRequest({
    method: 'get',
    url: `/api/code/queryByCatNo?catNo=${param}`
  });
}

// 根据类型，code值 获取中文值
export function getCodeValue(param, code) {
  businessRequest({
    method: 'get',
    url: `/api/code/queryByCatNo?catNo=${param}`
  }).then(res => {
    let result = res.result;
    if (result) {
      result.forEach(function(item, index) {
        if (code === item.codeNo) {
          return item.codeName;
        }
      });
    } else {
      return '';
    }
  }).catch(error => {
    console.log(error);
  });
}

// 根据数据字典集合，传入的code值，查询value值
export function getCodeValueByList(param, code) {
  if (param) {
    for (var i = 0; i < param.length; i++) {
      if (code === param[i].codeNo) {
        return param[i].codeName;
      }
    }
  } else {
    return '';
  }
}*/


export function getIbpsCode (param) {
  return ibpsRequest({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_API}/platform/v3/cat/dictionary/findByTypeKey?typeKey=${param}`
  });
}
