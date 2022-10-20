<template>
	<z-dialog-table ref="assetDTable" :title="assetLocDialogProp.title" :toolbarProp="assetLocDialogProp.toolbarProp"
					:tableProp="assetLocDialogProp.tableProp" :selectionHandle="assetLocDialogProp.selectionHandle"
					:treeProp="assetLocDialogProp.treeProp" @toolbar-search="onSearch" @tree-click="onTreeClick"
					@ok="onassetDTableOk" @on-reset="resetCon">
		<template slot="searchBar">
			<el-form-item label="位置编码" prop="locaNo">
				<el-input v-model="assetLocDialogProp.toolbarProp.searchData.locaNo"></el-input>
			</el-form-item>
			<el-form-item label="设备位置" prop="locaName">
				<el-input v-model="assetLocDialogProp.toolbarProp.searchData.locaName"></el-input>
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import * as httpUtils  from "@/framework/api/reqdemo.js"
import * as equipUtils from "@/api/cpApi/dictionary/index.js"
import {
	getEqLocationSubNo,
	initDeviceTree,
	initDeviceData,
}                      from "@/api/cpApi/equipment/list.js"

export default {
	name   : "asset-loca-dialog-select",
	props  : { // String Number Boolean Array Object Function || validator (value) {}
		fatherMethod  : { // 父组件传过来的方法 fatherMethod
			type    : Function,
			required: false,
			default : function(){
			},
		},
		multipleSelect: {
			type   : Boolean,
			default: true,
		},
	},
	data(){
		return {
			selectData        : {},
			pageNo            : 1,
			// 弹出属性
			assetLocDialogProp: {
				title          : "设备位置弹出框",
				selectionHandle: this.selectionHandle,
				toolbarProp    : {
					// 搜索数据
					searchData: {
						locaNo  : "",
						locaName: "",
					},
				},
				// 表格属性
				tableProp      : {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : this.initTableData, // 表格分页查询接口， Promise 对象
					paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title: "设备位置编码",
							key  : "locaNo",
						},
						{
							title: "设备位置名称",
							key  : "locaName",
						},
					],
				},
				// 树控件属性
				treeProp       : {
					title          : "设备位置",
					nodeKey        : "locaNo",
					clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
					multipleSelect : false,
					treeData       : this.dialogloadTreeData,
					lazyLoad       : true,
					propMapping    : { // 根据返回值的映射
						label   : "locaName",
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
					parameters : [
						/* {
						 key: 'Q^loca_id^S',
						 value: 'W242'
						 } */
					],
					requestPage: {
						limit : 20,
						pageNo: this.pageNo,
					},

				}
			}else{
				param_ = param
			}
			return initDeviceData(param_)
		},
		onSearch(params){
			console.log("--------搜索条件--------", params)
			let param = {
				parameters: [],
			}
			if(params.locaNo != null&&params.locaNo !== ""){
				param.parameters.push({
					key  : "locaNo",
					value: params.locaNo,
				})
			}
			if(params.locaName != null&&params.locaName !== ""){
				param.parameters.push({
					key  : "locaName",
					value: params.locaName,
				})
			}
			// 加载列表数据
			this.$refs.assetDTable.tableQuery(param)
		},
		reloadTable(param_obj){
			let param = {
				parameters: [],
			}
			if(null != param_obj){
				param.parameters.push(param_obj)
			}
			this.$refs.assetDTable.tableQuery(param)
		},
		dialogPaginationHandle(pagination){
			this.pageNo = pagination.pageNo
			console.log("--------分页事件--------", pagination)
			return { requestPage: pagination }
		},
		/**
		 * 处理勾选数据展示
		 */
		selectionHandle(selection){
			console.log("--------弹出框勾选数据--------", selection)
			return selection.assetName
		},
		/**
		 * 弹出表格确定事件
		 */
		onassetDTableOk(seleted){
			console.log("--------弹出表格确定事件--------", seleted)
			this.$emit("onDTableOk", seleted)
			//this.$refs.dialogTable.close();
		},
		init(){
			this.selectAssetGrid()
		},
		/**
		 * 树节点点击事件处理
		 * 返回 对象，用于表单查询条件
		 * 返回 null 不进行查询，可自定义一些处理
		 */
		onTreeClick(node){
			console.log("--------树节点点击--------", node)
			var param_obj = {
				key  : "locaId",
				value: node.locaId,
			}
			this.reloadTable(param_obj)
		},
		// 加载树组件数据 (非懒加载)
		dialogloadTreeData(node, resolve, loadDone){
			/* getTreeData().then(res=>{
			 console.log('--------------树控件数据Dialog-------------', res)
			 resolve(res)
			 loadDone()
			 }) */
			if(node.level === 0){
				initDeviceTree("-1").then(res => {
					resolve(res.data)
					loadDone()
				})
			}else{
				initDeviceTree(node.data.locaId).then(res => {
					resolve(res.data)
					loadDone()
				})
			}
		},
		/**
		 * 重置
		 */
		resetCon(){
			this.assetLocDialogProp.toolbarProp.searchData.locaNo   = ""
			this.assetLocDialogProp.toolbarProp.searchData.locaName = ""
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
