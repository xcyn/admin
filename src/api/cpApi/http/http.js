import { systemRequest } from "@/plugins/axios"
import {
	TWOTICKETS_URL,
	PLATFORM_BASE_URL,
	BUSINESS_BASE_URL,
	SHIFTDUTY_URL,
}                        from "@/api/baseUrl"

import qs from "qs"

const HTTPSTYLE = {
	"platform" : PLATFORM_BASE_URL(),
	"business" : BUSINESS_BASE_URL(),
	"shiftduty": SHIFTDUTY_URL(),
}

export default {
	post: (url, data, domain) => systemRequest({
		method: "post",
		url   : (HTTPSTYLE[domain] || TWOTICKETS_URL()) + `${ HTTPSTYLE[domain] ? "" : "/api" }` + url,
		data,
	}).then(resp => (resp && resp.result ? resp.result : resp)),
	get : (url, params, domain) => systemRequest({
		method          : "get",
		url             : (HTTPSTYLE[domain] || TWOTICKETS_URL()) + `${ HTTPSTYLE[domain] ? "" : "/api" }` + url,
		params,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		},
	}).then(resp => (resp && resp.result ? resp.result : resp)),
	async getList(url, current, domain, list){
		let { result }         = await this.get(url, { current, size: 100 }, domain)
		let { records, pages } = result || {}
		records && list.push(records)
		if(current < pages){
			await this.getList(url, current + 1, domain, list)
			return
		}
	},
	async all(url, domain){
		let list = []
		await this.getList(url, 1, domain, list)
		return list.flat(1)
	},
}
