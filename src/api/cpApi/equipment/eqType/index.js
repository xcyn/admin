import {businessRequest} from "@/plugins/axios/index"
import {EQUIPMENT_URL} from "@/api/baseUrl"

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqType/page",
    method: "get",
    params: query,
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqType/save",
    method: "post",
    data: data,
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqType/updateById",
    method: "post",
    data: data,
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqType/removeById/" + id,
    method: "post",
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqType/getById/" + id,
    method: "get",
  });
}

export function getEqTypeTree(nodeId) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqType/getEqTypeTree",
    method: "get",
    params: {nodeId: nodeId},
  });
}

export function initIdValue() {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqType/initIdValue",
    method: "get",
  });
}
