<template>
	<z-dialog-table ref="otDiaTb" :title="otProp.title" :key_="otProp.key" :toolbar-prop="otProp.toolbarProp" :table-prop="otProp.tableProp" :tree-prop="otProp.treeProp" :selection-handle="otProp.selectionHandle" @toolbar-search="onOtSearch" @ok="onOtOk">
		<template slot="searchBar">
			<el-form-item :label="$t('common.field.deptAlias')" prop="operationDeptId">
				<el-select v-model="otProp.toolbarProp.searchData.operationDeptId" placeholder="请选择" clearable>
					<el-option v-for="(item,index) in depts" :key="index" :value="item.id" :label="item.name" />
				</el-select>
			</el-form-item>
			<el-form-item label="操作任务" prop="opContent">
				<el-input placeholder="请输入操作任务" v-model="otProp.toolbarProp.searchData.opContent" clearable>
				</el-input>
			</el-form-item>
		</template>
	</z-dialog-table>
</template>

<script>
import * as otOperateTicketApi from "@/api/cpApi/twoTickets/otOperateTicket/index.js"

export default {
	props: {
		multipleSelect: { type: Boolean, default: false },
		//otTypeProperty: { type: Object, default: null },
		initParam    : { type: Object, default: null },
		selectedIds  : { type: String },
		selectedNames: { type: String },
	},

	data(){
		return {
			otTypes  : [],
			depts    : [],
			otTypeObj: {},
			otProp   : {
				title          : "操作票",
				selectionHandle: this.otSelection,
				key            : "otId",
				toolbarProp    : {
					searchData: {// 搜索数据
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
						{ title: "场站", key: "operationDeptName", width: 120 },
						{ title: "操作票编码", key: "otNo", width: 200 },
						{ title: "操作任务", key: "opContent" },
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
			this.selectOt(operationDeptId)
		},

		selectOt(operationDeptId){
			if(operationDeptId != "" && operationDeptId != null && operationDeptId != undefined){
				this.otProp.toolbarProp.searchData.operationDeptId = operationDeptId
				this.initParam                                     = { deptId: operationDeptId }
			}
			let selected = {
				key : "otId",
				data: [],
			}
			if(this.selectedIds != undefined && this.selectedNames != undefined){
				let size = this.selectedIds.split(",").length
				for(var i = 0; i < size; i++){
					selected.data.push({
						otId: this.selectedIds.split(",")[i],
						text: this.selectedNames.split(",")[i],
					})
				}
			}
			this.$refs.otDiaTb.open(selected)
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.otDiaTb.tableQuery(this.initParam)
				}, 600)
			})
		},

		/**
		 * 查询接口
		 * todombb 这个地方的引用比较奇怪,在替换新API时可能有问题.没有深入测试,可能不通.后续处理
		 */
		getData(parmas){
			parmas.operationDeptId = this.otProp.toolbarProp.searchData.operationDeptId
			parmas.opContent       = this.otProp.toolbarProp.searchData.opContent
			parmas.isOn            = 1
			return new Promise((resolve, reject) => {
				otOperateTicketApi.page(parmas).then(res => {
					resolve(res)
				})
			})
		},

		/**
		 * 点击查询
		 */
		onOtSearch(params){
			// 加载列表数据
			const pa = {
				deptId: params.operationDeptId,
			}
			this.$refs.otDiaTb.tableQuery(pa)
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
		otSelection(selection){
			// 标准工单
			return selection.workContent
		},

		/**
		 * 弹出表格确定事件
		 */
		onOtOk(seleted){
			this.$emit("onDTableOk", seleted)
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
