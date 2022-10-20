import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

// 添加
export function add(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqLocationInstall/add',
    data: param
  });
}
   
/**
  * 通过id查询设备安装卸载
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqLocationInstall/queryById?id=${id}`
    })
}