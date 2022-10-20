<!--检查计划选择框-->
<template>
	<z-dialog-table ref="dialogTable" :title="dialogProp.title" :toolbarProp="dialogProp.toolbarProp" :tableProp="dialogProp.tableProp" :treeProp="dialogProp.treeProp" :selectionHandle="dialogProp.selectionHandle" @toolbar-search="onSearch" @ok="onDialogTableOk">
		<template slot="searchBar">
			<el-form-item label="检查类别">
				<el-select v-model="dialogProp.toolbarProp.searchData.planTypeNo" placeholder="检查类别" clearable>
					<el-option v-for="item in baseData.checkTypeList" :key="item.key" :label="item.name" :value="item.key" />
				</el-select>
			</el-form-item>
		</template>
	</z-dialog-table>
</template>

<script>
import { getDictByKey } from "@/api/cpApi/baseService/baseService.js"
import * as planApi     from "@/api/cpApi/processManage/check/plan/plan"

export default {
	data(){
		return {
			baseData  : {
				checkTypeList: [],//检查类别
			},
			selectData: {},
			dialogProp: {
				title          : "检查计划选择框",
				selectionHandle: this.selectionHandle,
				key            : "id",
				toolbarProp    : {
					searchData: {
						planTypeNo: "",
						isOn      : 1,
					},
				},
				// 表格属性
				tableProp      : {
					multipleSelect  : false, // 是否可多选
					dataSource      : planApi.getByPlanTypeNo, // 表格分页查询接口， Promise 对象
					paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
					columns         : [
						{
							title    : "检查类别",
							key      : "planTypeNo",
							formatter: row => {
								return this.baseData.checkTypeList.filter(one => {
									return one.key === row.planTypeNo
								})[0].name
							},
						},
						{ title: "检查项目名称", key: "planName" },
						{
							title    : "周期", key: "schedulingMode",
							formatter: row => {
								let dict = {
									day  : "天",
									week : "周",
									month: "月",
									year : "年",
								}
								return dict[row.schedulingMode] || ""
							},
						},
						{ title: "内容", key: "checkContent" },
						{ title: "备注", key: "comment" },
						{ title: "状态", key: "isOn", formatter: row => row.isOn === 1 ? "启用" : "停用" },
					],
				},
				// 树控件属性
				treeProp       : {
					show: false,
				},
			},
			org       : [],
		}
	},

	mounted(){
		this.loadBaseData()
	},

	methods: {
		/**
		 * 加载基础数据
		 * @author mbb
		 */
		loadBaseData(){
			return new Promise(resolve => {
				let need2load = 2
				let loadDone  = function(){
					need2load--
					if(need2load === 0){
						resolve()
					}
				}

				// 1.检查类别List:数据字典
				getDictByKey("check_type_list").then(res => {
					this.baseData.checkTypeList = res.data.map(({ key, name }) => ({ key, name }))
				}).finally(loadDone)
			})

		},
		/**
		 * 初始化打开
		 */
		init(val){
			this.$refs.dialogTable.open()
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.dialogTable.tableQuery(this.dialogProp.toolbarProp.searchData)
				}, 600)
			})

		},

		/**
		 * 查询操作
		 */
		onSearch(params){
			this.$refs.dialogTable.tableQuery(params)
		},

		/**
		 * 返回分页条件
		 */
		dialogPaginationHandle(pagination){
			return { requestPage: pagination }
		},

		/**
		 * 处理勾选数据展示
		 */
		selectionHandle(selection){
			return selection.planName
		},

		/**
		 * 弹出表格确定事件
		 */
		onDialogTableOk(seleted){
			this.$refs.dialogTable.close()
			this.$emit("onDTableOk", seleted)
		},
	},
}
</script>

<style scoped>
@import url("./dialog.css");
</style>
