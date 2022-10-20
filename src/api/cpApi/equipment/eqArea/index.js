import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL, TWOTICKETS_URL } from '@/api/baseUrl'

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqArea/page",
    method: "get",
    params: query,
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqArea/save",
    method: "post",
    data: data,
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqArea/updateById",
    method: "post",
    data: data,
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqArea/removeById/" + id,
    method: "post",
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqArea/getById/" + id,
    method: "get",
  });
}

export function queryById(params){
  return businessRequest({
    method: "get",
    url   : EQUIPMENT_URL() + `/eqArea/queryById`,
    params,
  })
}

export function getAreaTree(nodeId) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqArea/getEqAreaTree",
    method: "get",
    params: { nodeId: nodeId },
  });
}
