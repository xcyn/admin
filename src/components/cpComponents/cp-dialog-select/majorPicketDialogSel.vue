<template>
	<z-dialog-table ref="stdWODiaTb" :title="stdWOProp.title" :key_="stdWOProp.key" :toolbar-prop="stdWOProp.toolbarProp" :table-prop="stdWOProp.tableProp" :tree-prop="stdWOProp.treeProp" :selection-handle="stdWOProp.selectionHandle" @toolbar-search="onStdWOSearch" @ok="onStdWOOk">
		<template slot="searchBar">
			<el-form-item :label="$t('common.field.deptAlias')" prop="operationDeptId">
				<el-select v-model="stdWOProp.toolbarProp.searchData.operationDeptId" placeholder="请选择" clearable>
					<el-option v-for="(item,index) in depts" :key="index" :value="item.id" :label="item.name" />
				</el-select>
			</el-form-item>

			<el-form-item label="类型" prop="wtTypeId">
				<vxe-select v-model="stdWOProp.toolbarProp.searchData.wtTypeId" placeholder="请选择" clearable :disabled="true">
					<vxe-option v-for="(woOrderType,index) in wtTypes" :key="index" :value="woOrderType.value" :label="woOrderType.label" />
				</vxe-select>
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import { getCurrentDept }      from "@/api/cpApi/dictionary/index.js"
import * as wtStdWorkticketAPI from "@/api/cpApi/twoTickets/wtStdWorkticket/index.js"
import * as wtTypeAPI          from "@/api/cpApi/twoTickets/wtType/index.js"

export default {
	props: {
		multipleSelect: {
			type   : Boolean,
			default: false,
		},
		/**
		 * 初始化条件
		 * :initParam="{woTypeNo:'ta_pw'}"
		 * 只查询定期工单
		 */
		initParam    : {
			type   : Object,
			default: null,
		},
		selectedIds  : {
			type: String,
		},
		selectedNames: {
			type: String,
		},
	},

	data(){
		return {
			wtTypes  : [],
			depts    : [],
			wtTypeObj: {},
			stdWOProp: {
				title          : "标准工作票",
				selectionHandle: this.stdWOSelection,
				key            : "stdWtId",
				toolbarProp    : {
					// 搜索数据
					searchData: {
						wtTypeId       : "",
						operationDeptId: "",
						isOn           : 1,
					},
				},
				// 表格属性
				tableProp: {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : this.getData, // 表格分页查询接口， Promise 对象
					paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
					columns         : [
						// 显示列
						{ title: "场站", key: "operationDeptName" },
						{ title: "工作票号", key: "stdWtNo" },
						{ title: "工作票类型", key: "wtTypeName" },
						{ title: "工作内容", key: "workContent" },
						{ title: "设备位置", key: "locaName" },
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
	  let that = this
     setTimeout(async function(){
       await that.queryWtType()
     },2000)

		//场站从store获取
		this.depts = this.$store.state.ibps.user.info.stationList
		// this.queryDeptName()
	},

	methods: {
		selectStdWO(){
			let selected = {
				key : "stdWtId",
				data: [],
			}
			if(this.selectedIds != undefined && this.selectedNames != undefined){
				let size = this.selectedIds.split(",").length
				for(var i = 0; i < size; i++){
					selected.data.push({
						stdWtId: this.selectedIds.split(",")[i],
						text   : this.selectedNames.split(",")[i],
					})
				}
			}
			this.$refs.stdWODiaTb.open(selected)
			// 加载弹出框列表数据
			if(this.initParam && this.initParam.wtTypeId){
				this.stdWOProp.toolbarProp.searchData.wtTypeId = this.initParam.wtTypeId
			}
			if(this.initParam && this.initParam.operationDeptId){
				this.stdWOProp.toolbarProp.searchData.operationDeptId = this.initParam.operationDeptId
			}
			this.$nextTick(() => {
				setTimeout(() => {

					this.$refs.stdWODiaTb.tableQuery(this.initParam)
				}, 600)
			})
		},

		getData(parmas){
			return new Promise((resolve, reject) => {
				wtStdWorkticketAPI.page(parmas).then(res => {
					resolve(res)
				})
			})
		},

		onStdWOSearch(params){
			// 加载列表数据
			let pa = {
				operationDeptId: params.operationDeptId,
				wtTypeId       : params.wtTypeId,
				isOn           : 1,
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

		init(){
			this.selectStdWO()
		},
		// 查询场站
		async queryDeptName(){
			let _this   = this
			let res     = await getCurrentDept({
				parameters: [
					{ key: "key", value: "cz" },
				],
			})
			let list    = res.data.dataResult.map(item => ({
				value: item.ID_,
				label: item.NAME_,
			}))
			_this.depts = list
		},
		// 查询工作票类型
		async queryWtType(){
			let response = await wtTypeAPI.list()
			let arr      = response?.data || []
			let list     = arr.filter(
				item => item.isMain == 1 && item.isOn == 1,
			)
      const that = this
			// 过滤出有效的主票类型
			list.forEach(o => {
        if(this.initParam.wtTypeId === o.wtTypeId){
          this.wtTypes.push({
            value: o.wtTypeId,
            label: o.wtTypeName,
          })
          this.wtTypeObj[o.wtTypeId] = o.wtTypeName
        }
			})
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
