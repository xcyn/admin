<!--标准工作票选择框-->
<template>
	<z-dialog-table ref="myTable" :title="stdWTProp.title" :toolbar-prop="stdWTProp.toolbarProp" :table-prop="stdWTProp.tableProp" :tree-prop="stdWTProp.treeProp" :selection-handle="stdWTProp.selectionHandle" @toolbar-search="onStdWTSearch" @ok="onStdWTOk">
		<template slot="searchBar">
			<el-form-item label="标准工作票" prop="stdWtNo">
				<el-input v-model="stdWTProp.toolbarProp.searchData.stdWtNo" placeholder="请输入" />
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import * as wtStdWorkticketAPI from "@/api/cpApi/twoTickets/wtStdWorkticket/index.js"

export default {
	props: {
		multipleSelect: {
			type   : Boolean,
			default: true,
		},
	},
	data(){
		return {
			stdWTProp: {
				title          : "标准工作票",
				selectionHandle: this.stdWTSelection,
				toolbarProp    : {
					// 搜索数据
					searchData: {
						stdWtNo: "",
					},
				},
				// 表格属性
				tableProp: {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : wtStdWorkticketAPI.page, // 表格分页查询接口， Promise 对象
					paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title: "ID",
							key  : "stdWtId",
						},
						{
							title: "编号",
							key  : "stdWtNo",
						},
						{
							title: "工作内容",
							key  : "workContent",
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
		/**
		 * 初始化方法
		 */
		init(){
			this.selectStdWT()
		},
		selectStdWT(){
			this.$refs.myTable.open()
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.myTable.tableQuery()
				}, 600)
			})
		},
		onStdWTSearch(params){
			console.log("--------搜索条件--------", params)
			// 加载列表数据
			const pa = {}
			this.$refs.myTable.tableQuery(pa)
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
		stdWTSelection(selection){
			console.log("--------弹出框勾选数据--------", selection)
			return selection.workContent
		},
		/**
		 * 弹出表格确定事件
		 */
		onStdWTOk(seleted){
			console.log("--------弹出表格确定事件--------", seleted)
			this.$emit("onDTableOk", seleted)
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
