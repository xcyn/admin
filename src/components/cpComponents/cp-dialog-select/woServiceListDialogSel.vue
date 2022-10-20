<!--服务选择框-->
<template>
	<z-dialog-table ref="wSerListTb" :title="wslProp.title" :toolbar-prop="wslProp.toolbarProp" key_="serviceType" :table-prop="wslProp.tableProp" :tree-prop="wslProp.treeProp" :selection-handle="wslProp.selectionHandle" @toolbar-search="onSearch" @ok="onOk">
		<template slot="searchBar">
			<el-form-item label="服务类型" prop="serviceType">
				<el-select v-model="wslProp.toolbarProp.searchData.serviceType">
					<el-option v-for="fwlx in fwlxs" :key="fwlx.key" :value="fwlx.key" :label="fwlx.name"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="服务名称" prop="serviceName">
				<el-input v-model="wslProp.toolbarProp.searchData.serviceName" placeholder="请输入" />
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import { findPage }    from "@/api/cpApi/workOrder/woService/common"
import { getDictInfo } from "@/utils/cpUtils/workOrder"

export default {
	name   : "woServiceList-dialog-select",
	props  : {
		multipleSelect: {
			type   : Boolean,
			default: true,
		},
	},
	data(){
		return {
			fwlxs  : [],
			wslProp: {
				title          : "外包服务费率",
				selectionHandle: this.selectionHandle,
				toolbarProp    : {
					// 搜索数据
					searchData: {
						serviceType: "",
						serviceName: "",
					},
				},
				// 表格属性
				tableProp      : {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : findPage, // 表格分页查询接口， Promise 对象
					paginationHandle: this.pagination, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title    : "服务类型",
							key      : "serviceType",
							formatter: (row, column, cellValue, index) => {
								for(const fwlx of this.fwlxs){
									if(fwlx.key == cellValue){
										return fwlx.name
									}
								}
							},
						},
						{
							title: "服务名称",
							key  : "serviceName",
						},
						{
							title: "单位",
							key  : "unit",
						},
						{
							title: "成本单价",
							key  : "unitCost",
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
		this.getDictByTypeKey()
	},
	methods: {
		getDictByTypeKey(){
			getDictInfo(this, "fwlx").then(ret => {
				this.fwlxs = ret
			})
		},
		init(){
			this.$refs.wSerListTb.open()
			// 加载弹出框列表数据
			this.$nextTick(() => {
				this.$refs.wSerListTb.tableQuery()
			})
		},
		onSearch(params){
			const pa = {
				serviceType: params.serviceType,
				serviceName: params.serviceName,
			}
			this.$refs.wSerListTb.tableQuery(pa)
		},
		pagination(pagination){
			return {
				pageNo  : pagination.pageNo,
				pageSize: pagination.limit,
			}
		},
		/**
		 * 处理勾选数据展示
		 */
		selectionHandle(selection){
			return selection.serviceName
		},
		/**
		 * 弹出表格确定事件
		 */
		onOk(seleted){
			this.$emit("onDTableOk", seleted)
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
