<template>
	<z-dialog-table ref="assetDTable" :title="assetTypeDialogProp.title" :toolbarProp="assetTypeDialogProp.toolbarProp"
					:tableProp="assetTypeDialogProp.tableProp" :selectionHandle="assetTypeDialogProp.selectionHandle"
					:treeProp="assetTypeDialogProp.treeProp" @toolbar-search="onSearch" @tree-click="onTreeClick"
					@ok="onassetDTableOk" @on-reset="resetCon">
		<template slot="searchBar">
			<el-form-item label="类型编码" prop="eqTypeNo">
				<el-input v-model="assetTypeDialogProp.toolbarProp.searchData.eqTypeNo"></el-input>
			</el-form-item>
			<el-form-item label="设备类型" prop="eqTypeName">
				<el-input v-model="assetTypeDialogProp.toolbarProp.searchData.eqTypeName"></el-input>
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import { initDeviceTypeData } from "@/api/cpApi/equipment/list.js"

export default {
	name   : "asset-type-dialog-select",
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
    initParam     : {
      type   : Object,
      default: null,
    },
	},
	data(){
		return {
			selectData         : {},
			pageNo             : 1,
			// 弹出属性
			assetTypeDialogProp: {
				title          : "设备类型弹出框",
				selectionHandle: this.selectionHandle,
				toolbarProp    : {
					// 搜索数据
					searchData: {
						eqTypeNo  : "",
						eqTypeName: "",
					},
				},
				// 表格属性
				tableProp      : {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : this.initTableData, // 表格分页查询接口， Promise 对象
					paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title: "设备类型编码",
							key  : "eqTypeNo",
						},
						{
							title: "设备类型名称",
							key  : "eqTypeName",
						},
					],
				},
				// 树控件属性
				treeProp       : {
					title          : "设备类型",
					nodeKey        : "eqTypeId",
					clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
					multipleSelect : false,
					treeData       : this.dialogloadTreeData,
					lazyLoad       : true,
					propMapping    : { // 根据返回值的映射
						label   : "eqTypeName",
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
			if (this.initParam){
        param_.parameters.push(this.initParam)
      }
			return initDeviceTypeData(param_)
		},
		onSearch(params){
			console.log("--------搜索条件--------", params)
			var param_ = {}
			if(null === params.parameters||undefined === params.parameters){
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
			if(params.eqTypeNo != null&&params.eqTypeNo !== ""){
				param_.parameters.push({
					key  : "Q^eq_type_no^SL",
					value: params.eqTypeNo,
				})
			}
			if(params.eqTypeName != null&&params.eqTypeName !== ""){
				param_.parameters.push({
					key  : "Q^eq_type_name^SL",
					value: params.eqTypeName,
				})
			}
			// 加载列表数据
			this.$refs.assetDTable.tableQuery(param_)
		},
		reloadTable(params){
			var param_ = {}
			if(null === params.parameters||undefined === params.parameters){
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
			if(params.eqTypeId != null&&params.eqTypeId !== ""){
				param_.parameters.push({
					key     : "Q^eq_type_id^S",
					value   : params.eqTypeId,
				})
			}
			if(params.peqTypeId != null&&params.peqTypeId !== ""){
				param_.parameters.push({
					key     : "Q^p_eq_type_id^SL",
					value   : params.peqTypeId,
				})
			}
			// 加载列表数据
			this.$refs.assetDTable.tableQuery(param_)
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
			return selection.eqTypeName
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
			var params = { peqTypeId: node.eqTypeId }
			this.reloadTable(params)
		},
		// 加载树组件数据 (非懒加载)
		dialogloadTreeData(node, resolve, loadDone){
			/* getTreeData().then(res=>{
			 console.log('--------------树控件数据Dialog-------------', res)
			 resolve(res)
			 loadDone()
			 }) */
			let param_ = {
				parameters : [
					/* {
					 key: 'Q^loca_id^S',
					 value: 'W242'
					 } */
				],
				requestPage: {
					limit : 20000,
					pageNo: 1,
				},
			}
			if(node.level === 0){
				param_.parameters.push({
					key  : "Q^p_eq_type_id^S",
					value: "",
				})
				initDeviceTypeData(param_).then(res => {
					let result = []
					res.data.dataResult.forEach((item) => {
						if(item.peqTypeId == ""){
							result.push(item)
						}
					})
					console.log(result)
					resolve(result)
					loadDone()
				})
			}else{
				param_.parameters.push({
					key  : "Q^p_eq_type_id^S",
					value: node.data.eqTypeId,
				})
				initDeviceTypeData(param_).then(res => {
					resolve(res.data.dataResult)
					loadDone()
				})
			}
		},
    /**
     * 重置
     */
    resetCon(){
      this.assetTypeDialogProp.toolbarProp.searchData.eqTypeNo   = ""
      this.assetTypeDialogProp.toolbarProp.searchData.eqTypeName = ""
    },
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
