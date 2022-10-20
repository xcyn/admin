import {businessRequest} from "@/plugins/axios/index.js"
import {TWOTICKETS_URL} from "@/api/baseUrl"


/**
 * 注释
 * @author mbb
 */
export function getExecuteByTypeAndTime(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ticketStatis/getExecuteByTypeAndTime`,
		params,
	})
}
