<template>
	<z-dialog-table ref="stdWODiaTb" :title="stdWOProp.title" :key_="stdWOProp.key" :toolbar-prop="stdWOProp.toolbarProp" :table-prop="stdWOProp.tableProp" :tree-prop="stdWOProp.treeProp" :selection-handle="stdWOProp.selectionHandle" @toolbar-search="onStdWOSearch" @ok="onStdWOOk">
		<template slot="searchBar">
			<el-form-item :label="$t('ticket.common.operateTask')" prop="opContent">
				<el-input :placeholder="$t('ticket.message.enterOpeTask')" v-model="stdWOProp.toolbarProp.searchData.opContent" clearable>
				</el-input>
			</el-form-item>
		</template>
	</z-dialog-table>
</template>

<script>
import * as otStdOperateticketApi from "@/api/cpApi/twoTickets/otStdOperateticket/index.js"

export default {
	props: {
		multipleSelect: { type: Boolean, default: false },
		otTypeProperty: { type: Object, default: null },
		initParam     : { type: Object, default: null },
		selectedIds   : { type: String },
		selectedNames : { type: String },
	},

	data(){
		return {
			otTypes  : [],
			depts    : [],
			otTypeObj: {},
			stdWOProp: {
				//title          : "典型操作票",
				title          : this.$t('ticket.optTicket.typicalOpt'),
				selectionHandle: this.stdWOSelection,
				key            : "stdOtId",
				toolbarProp    : {
					searchData: {// 搜索数据
						otTypeId       : "",
						operationDeptId: "",
						opContent      : "",
					},
				},
				tableProp      : {// 表格属性
					// mustShow: true,
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : this.getData, // 表格分页查询接口， Promise 对象
					paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
					columns         : [// 显示列
						// { title: "场站", key: "operationDeptName", width: 120 },
						// { title: "操作票编码", key: "stdOtNo", width: 134 },
						// { title: "操作票类型", key: "otTypeName", width: 106 },
						// { title: "操作任务", key: "opContent", width: 512 },
						// { title: "设备位置", key: "locaName", width: 512 },
						{ title: this.$t('common.field.deptAlias'), key: "operationDeptName", width: 120 },
						{ title: this.$t('ticket.optTicket.optNo'), key: "stdOtNo", width: 134 },
						{ title: this.$t('ticket.common.otType'), key: "otTypeName", width: 106 },
						{ title: this.$t('ticket.common.operateTask'), key: "opContent", width: 512 },
						{ title: this.$t('equipment.common.loca'), key: "locaName", width: 512 },
					],
				},
				// 树控件属性
				treeProp: {
					show: false,
				},
			},
		}
	},

	mounted(){
		this.depts = this.$store.state.ibps.user.info.stationList
	},

	methods: {
		init(operationDeptId){
			this.selectStdWO(operationDeptId)
		},

		selectStdWO(operationDeptId){
			if(operationDeptId != "" && operationDeptId != null && operationDeptId != undefined){
				this.stdWOProp.toolbarProp.searchData.operationDeptId = operationDeptId
				this.initParam                                        = { deptId: operationDeptId }
			}
			let selected = {
				key : "stdOtId",
				data: [],
			}
			if(this.selectedIds != undefined && this.selectedNames != undefined){
				let size = this.selectedIds.split(",").length
				for(var i = 0; i < size; i++){
					selected.data.push({
						stdOtId: this.selectedIds.split(",")[i],
						text   : this.selectedNames.split(",")[i],
					})
				}
			}
			this.$refs.stdWODiaTb.open(selected)
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.stdWODiaTb.tableQuery(this.initParam)
				}, 600)
			})
		},

		/**
		 * 查询接口
		 */
		getData(parmas){
			parmas.otTypeId  = this.otTypeProperty.otTypeId
			parmas.opContent = this.stdWOProp.toolbarProp.searchData.opContent
			parmas.isOn      = 1
			return new Promise((resolve, reject) => {
				otStdOperateticketApi.page(parmas).then(response => {
					let list  = response?.data?.records || []
					let array = []
					if(this.otTypeProperty){
						list.forEach((item) => {
							if(item.otTypeId == this.otTypeProperty.otTypeId){
								item.otTypeName = this.otTypeProperty.otTypeName
								array.push(item)
							}
						})
					}
					response.data.records = array

					resolve(response)
				})
			})
		},

		/**
		 * 点击查询
		 */
		onStdWOSearch(params){
			// 加载列表数据
			const pa = {
				deptId: params.operationDeptId,
			}
			this.$refs.stdWODiaTb.tableQuery(pa)
		},

		/**
		 * 返回分页条件
		 */
		busiPagination(pagination){
			return {
				current: pagination.pageNo,
				size   : pagination.limit,
			}
		},

		/**
		 * 处理勾选数据展示
		 */
		stdWOSelection(selection){
			// 标准工单
			return selection.workContent
		},

		/**
		 * 弹出表格确定事件
		 */
		onStdWOOk(seleted){
			this.$emit("onDTableOk", seleted)
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
