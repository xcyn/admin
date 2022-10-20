import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqManageObject/page",
    method: "get",
    params: query,
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqManageObject/save",
    method: "post",
    data: data,
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqManageObject/updateById",
    method: "post",
    data: data,
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqManageObject/removeById/" + id,
    method: "post",
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqManageObject/getById/" + id,
    method: "get",
  });
}

export function getManageObjectTree(nodeId) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqManageObject/getManageObjectTree",
    method: "get",
    params: { nodeId: nodeId },
  });
}

