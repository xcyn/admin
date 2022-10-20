<template>
	<z-dialog-table ref="dialogTable" :fatherMethod="fatherMethod" :title="dialogProp.title" :toolbarProp="dialogProp.toolbarProp" :tableProp="dialogProp.tableProp" :treeProp="dialogProp.treeProp" :selectionHandle="dialogProp.selectionHandle" @toolbar-search="onSearch" @tree-click="onTreeClick" @ok="onDialogTableOk" @on-reset="resetCon">
		<template slot="searchBar">
			<el-form-item label="姓名" prop="name_">
				<el-input v-model="dialogProp.toolbarProp.searchData.name_" clearable></el-input>
			</el-form-item>
			<el-form-item label="部门" prop="org_name_">
				<el-input v-model="dialogProp.toolbarProp.searchData.org_name_" clearable></el-input>
			</el-form-item>
		</template>
	</z-dialog-table>
</template>

<script>
import * as httpUtils from "@/framework/api/reqdemo.js"
import * as orgHttp   from "@/utils/cpUtils/index"
import * as gsHttp    from "@/api/cpApi/dictionary/index"

export default {
	name   : "stationChargDialogSel",
	props  : { // String Number Boolean Array Object Function || validator (value) {}
		title         : {
			type   : String,
			default: "用户信息弹出框",
		},
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
		conStr        : {
			type   : String,
			default: "",
		},
	},
	data(){
		return {
			selectData: {},
			// 弹出属性
			dialogProp: {
				title          : this.title,
				selectionHandle: this.selectionHandle,
				toolbarProp    : {
					// 搜索数据
					searchData: {
						name_    : "",
						org_name_: "",
					},
				},
				// 表格属性
				tableProp      : {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : this.getChargTable, // 表格分页查询接口， Promise 对象
					paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title: "人员ID",
							key  : "id",
							width: "180",
						},
						{
							title: "姓名",
							key  : "name",
							width: "180",
						},
						{
							title: "部门",
							key  : "orgName",
						},
					],
				},
				// 树控件属性
				treeProp       : {
					show: false,
					/* title: '树组件',
					 nodeKey: 'ID_',
					 clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
					 multipleSelect: false,
					 treeData: this.dialogloadTreeData,
					 lazyLoad: true,
					 propMapping: { // 根据返回值的映射
					 label: 'NAME_',
					 children: 'son'
					 }*/
				},
			},
			org       : [],
			yh        : [],
		}
	},
	methods: {
		onSearch(params){
			console.log("--------搜索条件--------", params)
			/* const parameters=[]
			 if(params){
			 for(let spkey in params){
			 const val=params[spkey]
			 if(val=== '' || val === undefined || val === null){
			 continue;
			 }
			 parameters.push({
			 key: 'Q^'+spkey+'^SL',
			 value: val
			 })
			 }
			 } */
			// 加载列表数据
			var searchObj = {
				parameters: [{
					key  : "Q^MAIN_PID_^SL",
					value: this.conStr,
				}],
			}
			if(null !== params.org_name_&&"" !== params.org_name_){
				searchObj.parameters.push({
					key  : "Q^orgName^SL",
					value: params.org_name_,
				})
			}
			if(null !== params.name_&&"" !== params.name_){
				searchObj.parameters.push({
					key  : "Q^name^SL",
					value: params.name_,
				})
			}
			this.$refs.dialogTable.tableQuery(searchObj)
		},
		/**
		 * 重置
		 */
		resetCon(){
			this.dialogProp.toolbarProp.searchData.name_     = ""
			this.dialogProp.toolbarProp.searchData.org_name_ = ""
		},
		/**
		 * 返回分页条件
		 */
		dialogPaginationHandle(pagination){
			console.log("--------分页事件--------", pagination)
			return { requestPage: pagination }
		},
		/**
		 * 处理勾选数据展示
		 */
		selectionHandle(selection){
			console.log("--------弹出框勾选数据--------", selection)
			return selection.name
		},
		/**
		 * 弹出表格确定事件
		 */
		onDialogTableOk(seleted){
			console.log("--------弹出表格确定事件--------", seleted)
			this.Names = ""
			this.Ids   = ""
			for(let index in seleted){
				this.Names += seleted[index]["column"]["name"]+","
				this.Ids += seleted[index]["column"]["id"]+","
			}
			if(this.Names.lastIndexOf(",") !== -1){
				this.selectData.names = this.Names.substring(0, this.Names.length-1)
				this.selectData.ids   = this.Ids.substring(0, this.Ids.length-1)
			}
			this.fatherMethod(this.selectData)
			this.$refs.dialogTable.close()
			this.$emit("onDTableOk", seleted)
		},
		init(){
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
						if(null !== this.conStr&&this.conStr.length>0){
							this.$refs.dialogTable.tableQuery({
								parameters: [{
									key  : "Q^MAIN_PID_^SL",
									value: this.conStr,
								}],
							})
						}else{
							this.$refs.dialogTable.tableQuery()
						}
					},
					500)
			})
			this.$refs.dialogTable.open()
		},
		/**
		 * 树节点点击事件处理
		 * 返回 对象，用于表单查询条件
		 * 返回 null 不进行查询，可自定义一些处理
		 */
		onTreeClick(node){
			//this.$refs.dialogTable.tableQuery({ parameters: [{ key: 'orgId', value: node.ID_ }] });
			console.log("--------树节点点击--------", node)
			let params = {
				ID_: node.ID_,
			}
			this.onSearch(params)
		},
		// 加载树组件数据 (非懒加载)
		dialogloadTreeData(node, resolve, loadDone){

			this.yh = orgHttp.getLoginInfo()

			const _param = {
				"parameters": [
					{
						"key"  : "key",
						"value": "dqjg",
					},
					{
						"key"  : "Q^ID^SL",
						"value": this.yh.org.id,
					},
					{
						"key"  : "Q^DEPTH_^SL",
						"value": "1",
					},
				],
			}
			gsHttp.getCurrentOrg(_param).then((ret) => {
				this.org = ret.data.dataResult
				console.log(this.org)
				if(node.level === 0){
					const _param = {
						"parameters": [
							{
								"key"  : "key",
								"value": "bm",
							},
							{
								"key"  : "Q^ID_^SL",
								"value": this.org[0].ID_,
							},
						],
					}
					httpUtils.getTreeData(_param).then(res => {
						console.log("--------------树控件数据-------------", res.data.dataResult)
						resolve(res.data.dataResult)
						loadDone()
					})
				}else{
					const _param = {
						"parameters": [
							{
								"key"  : "key",
								"value": "bm",
							},
							{
								"key"  : "Q^PARENT_ID_^SL",
								"value": node.data.ID_,
							},
						],
					}
					httpUtils.getTreeData(_param).then(res => {
						console.log("--------------树控件数据-------------", res.data.dataResult)
						resolve(res.data.dataResult)
						loadDone()
					})
				}
			})
		},
		getChargTable(param){ //场站负责人
			let _param = {
				"parameters": [
					{
						"key"  : "key",
						"value": "czfzrxz",
					},
					{
						key  : "Q^MAIN_PID_^SL",
						value: this.conStr,
					},
				],
			}
			if(null !== param&&null !== param.parameters){
				param.parameters.push({
					"key"  : "key",
					"value": "czfzrxz",
				})
				_param = param
			}
			return httpUtils.findDataByKey(_param)
		},
		// --------------------树节点相关结束----------------------------
	},
}
</script>

<style scoped>
@import url("./dialog.css");
</style>
