
import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"


export function save(data){
	return businessRequest({
		method: "POST",
		url   : TWOTICKETS_URL() + `/api/wtMpMeasBatch/save`,
    data:data
	})
}


export function getByWatId(watId){
  return businessRequest({
    method: "get",
    url   : TWOTICKETS_URL() + `/api/wtMpMeasBatch/getByWatId/`+watId,
  })
}

export function deleteById(mpBatchId){
  return businessRequest({
    method: "POST",
    url   : TWOTICKETS_URL() + `/api/wtMpMeasBatch/delete/`+mpBatchId,
  })
}
