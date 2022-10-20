<!-- 网格区域弹出框 -->
<template>
	<z-dialog-table ref="assetDTable"
					:title="assetDialogProp.title"
					:toolbarProp="assetDialogProp.toolbarProp"
					:tableProp="assetDialogProp.tableProp"
					:selectionHandle="assetDialogProp.selectionHandle"
					:treeProp="assetDialogProp.treeProp"
					@toolbar-search="onSearch"
					@tree-click="onTreeClick"
					@ok="onassetDTableOk">
		<template slot="searchBar">
			<el-form-item label="区域编码" prop="areaNo">
				<el-input v-model="assetDialogProp.toolbarProp.searchData.areaNo" />
			</el-form-item>
			<el-form-item label="区域名称" prop="areaName">
				<el-input v-model="assetDialogProp.toolbarProp.searchData.areaName" />
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import * as areaHttp from "@/api/cpApi/base/areagrid/areagrid.js"

export default {
	name: "area-dialog-select",

	props: { // String Number Boolean Array Object Function || validator (value) {}
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
			selectData: {},

			// 弹出属性
			assetDialogProp: {
				title          : "网格区域弹出框",
				selectionHandle: this.selectionHandle,
				toolbarProp    : {
					// 搜索数据
					searchData: {
					  areaId:"",
						areaNo       : "",
						areaName     : "",
						companyId    : "",
						isOn         : 1,
					},
				},

				// 表格属性
				tableProp: {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : this.initTableData, // 表格分页查询接口， Promise 对象
					paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{ title: "区域编码", key: "areaNo", width: "180" },
						{ title: "区域名称", key: "areaName" },
						{ title: "区域范围", key: "scope" },
						{ title: "责任人", key: "dutyUserName" },
						{ title: "责任部门", key: "dutyDeptName" },
						{ title: "工作职责", key: "duty" },
						{ title: "上级区域", key: "pname" },
					],
				},
				// 树控件属性
				treeProp : {
					//show: false
					title          : "树组件",
					nodeKey        : "areaNo",
					clickNodeHandle: this.onTreeClick, // 树点击节点处理
					multipleSelect : false,
					treeData       : this.dialogloadTreeData,
					lazyLoad       : true,
					propMapping    : { // 根据返回值的映射
						label   : "areaName",
						isLeaf  : "isLeaf",
						children: "son",
					},
				},
			},
		}
	},

	mounted(){
		this.initFormData()

	},

	methods: {
		/**
		 * 初始化表单数据
		 * @author mbb
		 */
		initFormData(){
			this.assetDialogProp.toolbarProp.searchData.companyId = this.$store.state.ibps.user.info.company.companyId
			this.assetDialogProp.toolbarProp.searchData.isOn      = 1
		},

		/**
		 * 打开弹窗
		 * @author mbb
		 */
		init(parm){
			this.$refs.assetDTable.open()
			// 加载弹出框列表数据
			this.$nextTick(() => {
				setTimeout(() => {
					let param = Object.assign(this.assetDialogProp.toolbarProp.searchData, parm)
					this.$refs.assetDTable.tableQuery(param)
				}, 600)
			})
		},

		/**
		 * 查询
		 * @author mbb
		 */
		onSearch(){
			this.$refs.assetDTable.tableQuery(this.assetDialogProp.toolbarProp.searchData)
		},

		initTableData(param){
			return areaHttp.page(param)
		},

		dialogPaginationHandle(pagination){
			return {
				current: pagination.pageNo,
				size   : pagination.limit,
			}
		},

		/**
		 * 处理勾选数据展示
		 */
		selectionHandle(selection){
			return selection.areaName
		},

		/**
		 * 弹出表格确定事件
		 */
		onassetDTableOk(seleted){
			this.areaNos   = ""
			this.areaNames = ""
			for(let index in seleted){
				this.areaNos += (seleted[index]["column"]["areaNo"] || "") + ","
				this.areaNames += (seleted[index]["column"]["areaName"] || "") + ","
			}
			if(this.areaNos.lastIndexOf(",") !== -1){
				this.areaNos = this.areaNos.substring(0, this.areaNos.length - 1)
			}
			if(this.areaNames.lastIndexOf(",") !== -1){
				this.areaNames = this.areaNames.substring(0, this.areaNames.length - 1)
			}
			this.selectData = {
				nos    : this.areaNos,
				names  : this.areaNames,
				seleted: seleted,
			}
			this.$emit("onDTableOk", seleted)
			this.fatherMethod(this.selectData)
			//this.$refs.dialogTable.close();
		},

		/**
		 * 树节点点击事件处理
		 * 返回 对象，用于表单查询条件
		 * 返回 null 不进行查询，可自定义一些处理
		 */
		onTreeClick(node){
			this.assetDialogProp.toolbarProp.searchData.areaId = node.areaId
			this.onSearch()
		},

		// 加载树组件数据
		dialogloadTreeData(node, resolve, loadDone){
			let area = node.data

			let params = { areaId: area.areaId }
			if(node.level === 0){ // 初次加载一个根节点
				params = { areaId: "" }
			}

			//获得区域
			areaHttp.listSon(params).then(res => {
				let areaList = res.data.map(area => {
					area.isLeaf = area.isLeaf === 1
					return area
				})
				resolve(areaList)
				loadDone()
			})
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
