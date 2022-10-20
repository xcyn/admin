import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
  * 查询某个服务是否存在
  * @param {*} serviceNameParam
  */
 export function isExistsConsulService(serviceNameParam) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/common/isExistsConsulService?serviceNameParam=${serviceNameParam}`
    })
}