import {businessRequest} from "@/plugins/axios/index"
import {EQUIPMENT_URL} from "@/api/baseUrl"

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqAssetType/page",
    method: "get",
    params: query,
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqAssetType/save",
    method: "post",
    data: data,
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqAssetType/updateById",
    method: "post",
    data: data,
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqAssetType/removeById/" + id,
    method: "post",
  });
}

export function removeAssetType(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqAssetType/removeAssetType/" + id,
    method: "post",
  });
}


export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqAssetType/getById/" + id,
    method: "get",
  });
}

export function initIdValue() {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqAssetType/initIdValue",
    method: "get",
  });
}

export function updateEqType(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqAssetType/updateEqType",
    method: "post",
    data: data,
  });
}
