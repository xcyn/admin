import { systemRequest } from '@/plugins/axios/index'

/**
 * 根据字典类型获取数据字典
 * @param {Object} query
 */
export function getByUserId (param) {
  return systemRequest({
    url: '/platform/v3/org/findByUserId',
    method: 'get',
    params: param
  })
}

/**
 * 获取当前用户机构
 * @param {Object} query
 */
export function getCurrentOrg (param) {
  return systemRequest({
    url: '/business/v3/data/template/queryDataByKey',
    method: 'post',
    data: param
  })
}

/**
 * 获取当前用户部门
 * @param {Object} query
 */
export function getCurrentDept (param) {
  return systemRequest({
    url: '/business/v3/data/template/queryDataByKey',
    method: 'post',
    data: param
  })
}

/**
 * 获取所在部门人员
 * @param {Object} query
 */
export function getEmployee (param) {
  return systemRequest({
    url: '/platform/v3/employee/findAll',
    method: 'get',
    params: param
  })
}

/**
 * 获取所在部门人员
 * @param {Object} query
 */
export function getPagePerson (param) {
  return systemRequest({
    url: '/platform/v3/employee/queryOrgUser',
    method: 'post',
    data: param
  })
}

/**
 * 公共调用接口（如获得场站列表、获得部门列表）
 * @param {Object} param
 */
export function queryDataByKey (param) {
  return systemRequest({
    url: '/business/v3/data/template/queryDataByKey',
    method: 'post',
    data: param
  })
}

/**
 * 平台数字字典调用接口（如获得专业列表）
 * @param String typeKey
 */
export function findByTypeKey (typeKey) {
  return systemRequest({
    url: '/platform/v3/cat/dictionary/findByTypeKey',
    method: 'get',
    params: {
      typeKey: typeKey
    }
  })
}

/**
 * 获得机组列表(状态为有效，按排序号排序)
 */
export function queryOperateDept () {
  let param = {
    parameters: [
      {
        key: 'key',
        value: 'List_ManagementObjectCode'
      },
      {
        key: 'Q^is_on^S',
        value: 'Y'
      }
    ],
    'sorts': [
      {
        'field': 'sort',
        'order': 'asc'
      }
    ]
  }
  return queryDataByKey(param)
}

/**
 * 获取设备位置信息列表(分页条件查询)数据
 * @param {Object} query
 */
export function queryEquipmentLocation (param) {
  return systemRequest({
    url: '/device/v3/equipmentLocation/query',
    method: 'post',
    data: param
  })
}

/**
 * 获取设备类型信息列表(分页条件查询)数据
 * @param {Object} query
 */
export function queryEquipmentType(param){
	return systemRequest({
		url   : "/device/v3/equipmentType/query",
		method: "post",
		data  : param,
	})
}

/**
 * 获得机构的公司列表(查询条件为机构ID) , 这是获得 最顶级的东北供热公司
 * @param {String} companyId
 */
export function queryCompany (orgId) {
  let param = {
    parameters: [
      {
        'key': 'key',
        'value': 'dqjg'
      },
      {
        'key': 'Q^ID^SL',
        'value': orgId
      },
      {
        'key': 'Q^DEPTH^SL',
        'value': '1'
      }
    ]
  }
  return queryDataByKey(param)
}

/**
 * 获得场站列表(查询条件为场站的公司ID)
 * @param {String} companyId
 */
export function queryStation (companyId) {
  // let param = {
  //   parameters: [
  //     {
  //       "key": "key",
  //       "value": "bm"
  //     },
  //     {
  //       "key": "Q^PARENT_ID_^SL",
  //       "value": companyId
  //     }
  //   ]
  // };
  // return queryDataByKey(param);
  // 获得运行部门
  const _param = {
    'parameters': [
      {
        'key': 'levelType',
        'value': 'org'
      },
      {
        'key': 'depth',
        'value': '2'
      },
      {
        'key': 'orgId',
        'value': companyId
      }
    ]
  }

  return systemRequest({
    url: '/extend/v3/entity/findAllByCondition',
    method: 'post',
    data: _param
  })
}

/**
 * 获取员工信息
 * @param {import('lodash').String} param
 */
export function getEmployeeById (param) {
  return systemRequest({
    url: `/platform/v3/employee/get?employeeId=${param}`,
    method: 'get'
  })
}

/**
 * 获取测点表列表(分页条件查询)数据
 * @param {Object} query
 */
export function queryMeasurePoint (param) {
  return systemRequest({
    url: '/device/v3/measurePoint/query',
    method: 'post',
    data: param
  })
}

/**
 * 根据用户ID查询扩展属性(查询页面)
 * @param {Object} query
 */
export function findByPartyTypeUserId4Get (partyType, userId) {
  return systemRequest({
    url: `/platform/v3/attr/findByPartyTypeUserId4Get?partyType=${partyType}&userId=${userId}`,
    method: 'get'
  })
}
