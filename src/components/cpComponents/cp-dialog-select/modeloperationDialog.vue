<template>
	<z-dialog-table ref="stdWODiaTb" :title="stdWOProp.title" :toolbar-prop="stdWOProp.toolbarProp"
		:table-prop="stdWOProp.tableProp" :tree-prop="stdWOProp.treeProp"
		:selection-handle="stdWOProp.selectionHandle" @toolbar-search="onStdWOSearch" @ok="onStdWOOk">
		<template slot="searchBar">
			<el-form-item label="典型操作票编码" prop="stdOtNo">
				<el-input v-model="stdWOProp.toolbarProp.searchData.stdOtNo" placeholder="请输入" />
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import * as otStdOperateticketApi from "@/api/cpApi/twoTickets/otStdOperateticket/index.js"

export default {
	props: {
		multipleSelect: {
			type   : Boolean,
			default: true,
		},
	},
	data(){
		return {
			stdWOProp: {
				title          : "典型操作票",
				selectionHandle: this.stdWOSelection,
				toolbarProp    : {
					// 搜索数据
					searchData: {
						stdOtNo: "",
					},
				},
				// 表格属性
				tableProp: {
					multipleSelect: this.multipleSelect, // 是否可多选
					// todombb 这里引用不规范,替换接口时无法深入.不确定是否有问题.后续处理.
					dataSource      : otStdOperateticketApi.page, // 表格分页查询接口， Promise 对象
					paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title: "典型操作票ID",
							key  : "stdOtId",
						},
						{
							title: "典型操作票编码",
							key  : "stdOtNo",
						},
						{
							title: "典型操作票内容",
							key  : "opContent",
						},
					],
				},
				// 树控件属性
				treeProp: {
					show: false,
				},
			},
		}
	},
	methods: {
		selectStdWO(){
			this.$refs.stdWODiaTb.open()
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.stdWODiaTb.tableQuery()
				}, 600)
			})
		},
		onStdWOSearch(params){
			console.log("--------搜索条件--------", params)
			// 加载列表数据
			const pa = {}
			this.$refs.stdWODiaTb.tableQuery(pa)
		},
		/**
		 * 返回分页条件
		 */
		busiPagination(pagination){
			console.log("--------分页事件--------", pagination)
			return {
				current: pagination.pageNo,
				size   : pagination.limit,
			}
		},
		/**
		 * 处理勾选数据展示
		 */
		stdWOSelection(selection){
			console.log("--------弹出框勾选数据--------", selection)
			return selection.opContent
		},
		/**
		 * 弹出表格确定事件
		 */
		onStdWOOk(seleted){
			console.log("--------弹出表格确定事件--------", seleted)
			this.$emit("onDTableOk", seleted)
		},
		init(){
			this.selectStdWO()
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
