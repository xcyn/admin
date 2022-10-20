<template>
	<z-dialog-table ref="assetDTable" :title="maObjDialogProp.title" :toolbarProp="maObjDialogProp.toolbarProp"
					:tableProp="maObjDialogProp.tableProp" :selectionHandle="maObjDialogProp.selectionHandle"
					:treeProp="maObjDialogProp.treeProp" @toolbar-search="onSearch" @tree-click="onTreeClick"
					@ok="onassetDTableOk" @on-reset="resetCon">
		<template slot="searchBar">
		</template>
	</z-dialog-table>
</template>
<script>
import * as comnHttp from "@/api/cpApi/common/index"

export default {
	name   : "asset-dialog-select",
	props  : { // String Number Boolean Array Object Function || validator (value) {}
		multipleSelect: {
			type   : Boolean,
			default: true,
		},
		manageObjNo   : {
			type: String,
		},
		manageObjName : {
			type: String,
		},
	},
	data(){
		return {
			pageNo         : 1,
			// 弹出属性
			maObjDialogProp: {
				title          : "设备机组弹出框",
				selectionHandle: this.selectionHandle,
				toolbarProp    : {
					// 搜索数据
					searchData: {},
				},
				// 表格属性
				tableProp      : {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : this.initTableData, // 表格分页查询接口， Promise 对象
					paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title: "机组编码",
							key  : "manage_obj_no",
							width: "180",
						},
						{
							title: "机组名称",
							key  : "manage_obj_name",
							width: "180",
						},
					],
				},
				// 树控件属性
				treeProp       : {
					title          : "管理对象",
					nodeKey        : "manage_obj_id",
					clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
					multipleSelect : false,
					treeData       : this.dialogloadTreeData,
					lazyLoad       : true,
					propMapping    : { // 根据返回值的映射
						label   : "manage_obj_name",
						children: "son",
					},
				},
			},
		}
	},
	methods: {
		selectAssetGrid(){
			this.$refs.assetDTable.open()
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.assetDTable.tableQuery()
				}, 600)
			})
		},
		initTableData(param){
			var param_ = {}
			if(null === param.parameters||undefined === param.parameters){
				param_ = {
					parameters : [{
						key  : "key",
						value: "zly",
					}],
					requestPage: {
						limit : 20,
						pageNo: this.pageNo,
					},
				}
			}else{
				param_ = param
			}
			return comnHttp.findDataByKey(param_)
		},
		onSearch(params){
			this.$refs.assetDTable.tableQuery(params)
		},
		reloadTable(param_obj){
			//if (null != param_obj) param.push(param_obj);
			this.$refs.assetDTable.tableQuery(param_obj)
		},
		dialogPaginationHandle(pagination){
			this.pageNo = pagination.pageNo
			return { requestPage: pagination }
		},
		/**
		 * 处理勾选数据展示
		 */
		selectionHandle(selection){
			return selection.manage_obj_name
		},
		/**
		 * 弹出表格确定事件
		 */
		onassetDTableOk(seleted){
			this.$emit("onDTableOk", seleted)
		},
		init(){
			// let selected = {
			//   key: 'id',
			//   data: []
			// }
			// selected.data.push({ id: this.locaId, text: this.locaName });
			this.selectAssetGrid()
		},
		/**
		 * 树节点点击事件处理
		 * 返回 对象，用于表单查询条件
		 * 返回 null 不进行查询，可自定义一些处理
		 */
		onTreeClick(node){
			let param = {
				parameters : [
					{
						key  : "key",
						value: "zly",
					},
				],
				requestPage: {
					limit : 20,
					pageNo: this.pageNo,
				},
			}
			param.parameters.push({
				key  : "Q^p_manage_obj_id^S",
				value: node.manage_obj_id,
			})
			this.reloadTable(param)
		},
		// 加载树组件数据 (非懒加载)
		dialogloadTreeData(node, resolve, loadDone){
			let param = {
				parameters: [
					{
						key  : "key",
						value: "zly",
					},
				],
			}
			if(node.level === 0){
				param.parameters.push({
					key  : "Q^p_manage_obj_id^S",
					value: " ",
				})
				comnHttp.findDataByKey(param).then(res => {
					resolve(res.data.dataResult)
					loadDone()
				})
			}else{
				param.parameters.push({
					key  : "Q^p_manage_obj_id^S",
					value: node.data.manage_obj_id,
				})
				comnHttp.findDataByKey(param).then(res => {
					resolve(res.data.dataResult)
					loadDone()
				})
			}
		},
    resetCon(){

    }
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
