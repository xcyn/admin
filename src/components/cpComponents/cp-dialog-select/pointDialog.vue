<template>
	<z-dialog-table ref="assetDTable" :title="assetDialogProp.title" :toolbarProp="assetDialogProp.toolbarProp"
					:tableProp="assetDialogProp.tableProp" :selectionHandle="assetDialogProp.selectionHandle"
					:treeProp="assetDialogProp.treeProp" @toolbar-search="onSearch" @tree-click="onTreeClick"
					@ok="onassetDTableOk">
		<template slot="searchBar">
			<el-form-item label="测点编码" prop="mpNo">
				<el-input v-model="assetDialogProp.toolbarProp.searchData.mpNo"></el-input>
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import * as httpUtils  from "@/framework/api/reqdemo.js"
import { getDictInfo } from "@/utils/cpUtils/workOrder"

export default {
	name   : "point-dialog-select",
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
			assetTableData : {},
			selectData     : {},
			units          : [],
			parmValueTypes : [],
			// 弹出属性
			assetDialogProp: {
				title          : "测点弹出框",
				selectionHandle: this.selectionHandle,
				toolbarProp    : {
					// 搜索数据
					searchData: {
						mpNo    : "",
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
							title: "测点编码",
							key  : "mpNo",
							width: "180",
						},
						{
							title: "测点描述",
							key  : "mpComment",
						},
						{
							title: "标准值",
							key  : "rangeStandard",
						},
						{
							title    : "单位",
							key      : "unit",
							formatter: (row, column, cellValue, index) => {
								for(const item of this.units){
									if(item.key == cellValue){
										return item.name
									}
								}
							},
						},
						{
							title: "量程上限",
							key  : "rangeTop",
						},
						{
							title: "量程下限",
							key  : "rangeBottom",
						},
						{
							title    : "值类型",
							key      : "parmValueTypeNo",
							formatter: (row, column, cellValue, index) => {
								for(const item of this.parmValueTypes){
									if(item.key == cellValue){
										return item.name
									}
								}
							},
						},
						{
							title: "小数位数",
							key  : "decimalDigit",
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
	created(){
		this.getDictByTypeKey()
	},
	methods: {
		selectAssetGrid(parm){
			this.$refs.assetDTable.open()
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.assetDTable.tableQuery(parm)
				}, 600)
			})
		},
		onSearch(params){
			console.log("--------搜索条件--------", params)
			let parm = {
				parameters: [
					{
						key  : "Q^mp_no^EQ",
						value: params.mpNo,
					},
					{
						key  : "Q^loca_no^EQ",
						value: params.locaNo,
					},
					{
						key  : "Q^loca_name^EQ",
						value: params.locaName,
					},
				],
			}
			// 加载列表数据
			this.$refs.assetDTable.tableQuery(parm)
		},
		initTableData(param){
			return httpUtils.getPoint(param)
		},
		reloadTable(param_obj){
			let param = {
				parameters: [
					{
						key  : "key",
						value: "sbzcwzst",
					},
				],
			}
			if(null != param_obj){
				param.parameters.push(param_obj)
			}
			this.$refs.assetDTable.tableQuery(param)
		},
		dialogPaginationHandle(pagination){
			console.log("--------分页事件--------", pagination)
			return { requestPage: pagination }
		},
		/**
		 * 处理勾选数据展示
		 */
		selectionHandle(selection){
			console.log("--------弹出框勾选数据--------", selection)
			return selection.mpNo
		},
		/**
		 * 弹出表格确定事件
		 */
		onassetDTableOk(seleted){
			console.log("--------弹出表格确定事件--------", seleted)
			this.assetNoNames = ""
			this.assetNoIds   = ""
			for(let index in seleted){

				this.assetNoNames += (seleted[index]["column"]["loca_name"]||"")+","
				this.assetNoIds += (seleted[index]["column"]["loca_id"]||"")+","
			}
			if(this.assetNoNames.lastIndexOf(",") !== -1){
				this.assetNoNames = this.assetNoNames.substring(0, this.assetNoNames.length-1)
			}
			if(this.assetNoIds.lastIndexOf(",") !== -1){
				this.assetNoIds = this.assetNoIds.substring(0, this.assetNoIds.length-1)
			}
			this.selectData = {
				ids    : this.assetNoIds,
				names  : this.assetNoNames,
				seleted: seleted,
			}
			this.$emit("onDTableOk", seleted)
			this.fatherMethod(this.selectData)
			//this.$refs.dialogTable.close();
		},
		init(parm){
			this.selectAssetGrid(parm)
		},
		/**
		 * 树节点点击事件处理
		 * 返回 对象，用于表单查询条件
		 * 返回 null 不进行查询，可自定义一些处理
		 */
		onTreeClick(node){
			console.log("--------树节点点击--------", node)
			var param_obj = {
				key  : "Q^loca_id^QE",
				value: node.loca_id,
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
				const _param = {
					"parameters": [
						{
							"key"  : "key",
							"value": "sbwzst",
						},
						{
							"key"  : "Q^p_loca_id^SL",
							"value": "778907868320497664",
						},
					],
				}
				httpUtils.findDataByKey(_param).then(res => {
					console.log("--------------树控件数据-------------", res.data.dataResult)
					resolve(res.data.dataResult)
					loadDone()
				})
			}else{
				const _param = {
					"parameters": [
						{
							"key"  : "key",
							"value": "sbwzst",
						},
						{
							"key"  : "Q^p_loca_id^SL",
							"value": node.data.loca_id,
						},
					],
				}
				httpUtils.findDataByKey(_param).then(res => {
					console.log("--------------树控件数据-------------", res.data.dataResult)
					resolve(res.data.dataResult)
					loadDone()
				})
			}
		},
		getDictByTypeKey(){
			getDictInfo(this, "sbjscszlx").then(ret => {
				this.parmValueTypes = ret
			})
			getDictInfo(this, "jldw").then(ret => {
				this.units = ret
			})
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
