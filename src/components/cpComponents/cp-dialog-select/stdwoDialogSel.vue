<!--标准工单选择框-->
<template>
	<z-dialog-table ref="stdWODiaTb" :title="stdWOProp.title" :key_="stdWOProp.key" :toolbar-prop="stdWOProp.toolbarProp" :table-prop="stdWOProp.tableProp" :tree-prop="stdWOProp.treeProp" :selection-handle="stdWOProp.selectionHandle" @toolbar-search="onStdWOSearch" @ok="onStdWOOk">
		<template slot="searchBar">
			<el-form-item label="工单类型" prop="woOrderType">
				<vxe-select v-model="stdWOProp.toolbarProp.searchData.woOrderType" placeholder="请选择" clearable>
					<vxe-option v-for="woOrderType in woOrderTypes" :key="woOrderType.woTypeNo" :value="woOrderType.woTypeNo" :label="woOrderType.woTypeName" />
				</vxe-select>
			</el-form-item>
			<el-form-item label="工作内容" prop="workContent">
				<el-input v-model="stdWOProp.toolbarProp.searchData.workContent" placeholder="请输入" />
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import * as wsoHttp from "@/api/cpApi/workOrder/woStdOrder/index"
import {
	getWoTypeList,
	getDictInfo,
}                   from "@/utils/cpUtils/workOrder"

export default {
	props: {
		multipleSelect: {
			type   : Boolean,
			default: true,
		},
		/**
		 * 初始化条件
		 * :initParam="{woTypeNo:'ta_pw'}"
		 * 只查询定期工单
		 */
		initParam     : {
			type   : Object,
			default: null,
		},
		selectedIds   : {
			type: String,
		},
		selectedNames : {
			type: String,
		},
	},

	data(){
		return {
			woOrderTypes: [],
			yxzts       : [],
			stdWOProp   : {
				title          : "标准工单",
				selectionHandle: this.stdWOSelection,
				key            : "stdWoId",
				toolbarProp    : {
					// 搜索数据
					searchData: {
						woOrderType    : "",
						operationDeptId: "",
						workContent    : "",
					},
				},
				// 表格属性
				tableProp      : {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : wsoHttp.findPage, // 表格分页查询接口， Promise 对象
					paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title: "标准工单编码",
							key  : "stdWoId",
						},
						{
							title: "工作内容",
							key  : "workContent",
						},
						{
							title    : "工单类型",
							key      : "woTypeNo",
							formatter: (row, column, cellValue, index) => {
								for(const item of this.woOrderTypes){
									if(item.woTypeNo === cellValue){
										return item.woTypeName
									}
								}
							},
						},
						// {
						// 	title: "场站",
						// 	key  : "operationDeptName",
						// },
						{
							title: "专业",
							key  : "skillName",
						},
						{
							title    : "状态",
							key      : "state",
							formatter: (row, column, cellValue, index) => {
								for(const item of this.yxzts){
									if(item.key == cellValue){
										return item.name
									}
								}
							},
						},
					],
				},
				// 树控件属性
				treeProp       : {
					show: false,
				},
			},
		}
	},

	mounted(){
		getWoTypeList(this).then(ret => {
			this.woOrderTypes = ret
		})
		this.getDictByTypeKey()
	},

	methods: {
		selectStdWO(){
			let selected = {
				key : "stdWoId",
				data: [],
			}
			if(this.selectedIds != undefined&&this.selectedNames != undefined){
				let size = this.selectedIds.split(",").length
				for(var i = 0; i<size; i++){
					selected.data.push({
						stdWoId: this.selectedIds.split(",")[i],
						text   : this.selectedNames.split(",")[i],
					})
				}
			}
			this.$refs.stdWODiaTb.open(selected)
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
					const pa = Object.assign({
						state: "yx",
					}, this.initParam)
					this.$refs.stdWODiaTb.tableQuery(pa)
				}, 600)
			})
		},

		onStdWOSearch(params){
			// 加载列表数据
			const pa = {
				woTypeNo   : params.woOrderType,
				manageObjNo: params.manageObjNo,
				workContent: params.workContent,
				state      : "yx",
			}
			this.$refs.stdWODiaTb.tableQuery(pa)
		},

		/**
		 * 返回分页条件
		 */
		busiPagination(pagination){
			return {
				pageNo  : pagination.pageNo,
				pageSize: pagination.limit,
			}
		},

		/**
		 * 处理勾选数据展示
		 */
		stdWOSelection(selection){ // 标准工单
			return selection.workContent
		},

		/**
		 * 弹出表格确定事件
		 */
		onStdWOOk(seleted){
			this.$emit("onDTableOk", seleted)
		},

		init(){
			this.selectStdWO()
		},
		getDictByTypeKey(){
			getDictInfo(this, "yxzt").then(ret => {
				this.yxzts = ret
			})
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
