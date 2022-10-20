import { businessRequest } from "@/plugins/axios"
import { SAFEPRO_URL }     from "@/api/baseUrl"

export function page(params){
	return businessRequest({
		method: "post",
		url   : SAFEPRO_URL() + `/sfAreaDevice/page`,
		data  : params,
	})
}

