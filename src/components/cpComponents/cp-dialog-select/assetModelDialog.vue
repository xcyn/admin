<template>
	<z-dialog-table ref="assetDTable" :title="assetTypeDialogProp.title" :toolbarProp="assetTypeDialogProp.toolbarProp"
					:tableProp="assetTypeDialogProp.tableProp" :selectionHandle="assetTypeDialogProp.selectionHandle"
					:treeProp="assetTypeDialogProp.treeProp" @toolbar-search="onSearch" @tree-click="onTreeClick"
					@ok="onassetDTableOk" @on-reset="resetCon">
		<template slot="searchBar">
			<el-form-item label="资产型号编码" prop="assetTypeNo">
				<el-input v-model="assetTypeDialogProp.toolbarProp.searchData.assetTypeNo"></el-input>
			</el-form-item>
			<el-form-item label="资产型号名称" prop="assetTypeName">
				<el-input v-model="assetTypeDialogProp.toolbarProp.searchData.assetTypeName"></el-input>
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import { queryDataTable } from "@/api/platform/data/dataTemplate"
import { initDeviceTypeData } from "@/api/cpApi/equipment/list.js"

export default {
	name   : "assetModelDialog",
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
			selectData         : {},
			pageNo             : 1,
			// 弹出属性
			assetTypeDialogProp: {
				title          : "资产型号",
				selectionHandle: this.selectionHandle,
				toolbarProp    : {
					// 搜索数据
					searchData: {
            assetTypeNo  : "",
            assetTypeName: "",
					},
				},
				// 表格属性
				tableProp      : {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : this.initTableData, // 表格分页查询接口， Promise 对象
					paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title: "型号编码",
							key  : "asset_type_id",
						},
						{
							title: "型号名称",
							key  : "asset_type_name",
						},
            {
              title: "生产厂商",
              key  : "manufacturer_ID",
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
            {key: "response_data",
              value: "{\"buttons\":{\"function_buttons\":[{\"button_type\":\"search\",\"label\":\"查询\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"add\",\"label\":\"新增\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"remove\",\"label\":\"删除\"},{\"button_type\":\"edit\",\"label\":\"修改\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"detail\",\"label\":\"浏览\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"}],\"edit_buttons\":[{\"button_type\":\"close\",\"label\":\"关闭\"},{\"button_type\":\"save\",\"label\":\"保存\"}]},\"display_columns\":[{\"label\":\"型号编码\",\"name\":\"asset_type_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"型号名称\",\"name\":\"asset_type_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"生产厂商\",\"name\":\"manufacturer_ID\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{},\"dataType\":\"varchar\"},{\"label\":\"设备类型\",\"name\":\"eq_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"customDialog\",\"field_options\":{\"read_rights\":false,\"link_linkage\":null,\"display\":true,\"default_value_type\":\"fixed\",\"multiple\":\"N\",\"icon\":\"search-plus\",\"mobile\":true,\"link_config\":null,\"default_value\":\"\",\"store\":\"id\",\"required\":false,\"label_width\":100,\"link_attr\":null,\"dialog\":\"Dialog_EquipmentType\",\"is_label_width\":false,\"link_condition\":null,\"is_width\":false,\"label_width_unit\":\"px\",\"width\":100,\"width_unit\":\"%\",\"placeholder\":\"请选择\",\"dialog_type\":\"dialog\",\"hide_rights\":false},\"dataType\":\"varchar\"},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"},\"dataType\":\"varchar\"},{\"label\":\"资产型号ID\",\"name\":\"asset_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"N\",\"field_type\":\"hidden\",\"field_options\":{},\"dataType\":\"varchar\"}],\"sort_columns\":[],\"template_id\":\"740592376887640064\",\"template_type\":\"\",\"result_columns\":[],\"ext_columns\":[],\"orig_display_columns\":[{\"label\":\"型号编码\",\"name\":\"asset_type_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"型号名称\",\"name\":\"asset_type_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"生产厂商\",\"name\":\"manufacturer_ID\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{},\"dataType\":\"varchar\"},{\"label\":\"设备类型\",\"name\":\"eq_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"customDialog\",\"field_options\":{\"read_rights\":false,\"link_linkage\":null,\"display\":true,\"default_value_type\":\"fixed\",\"multiple\":\"N\",\"icon\":\"search-plus\",\"mobile\":true,\"link_config\":null,\"default_value\":\"\",\"store\":\"id\",\"required\":false,\"label_width\":100,\"link_attr\":null,\"dialog\":\"Dialog_EquipmentType\",\"is_label_width\":false,\"link_condition\":null,\"is_width\":false,\"label_width_unit\":\"px\",\"width\":100,\"width_unit\":\"%\",\"placeholder\":\"请选择\",\"dialog_type\":\"dialog\",\"hide_rights\":false},\"dataType\":\"varchar\"},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"},\"dataType\":\"varchar\"},{\"label\":\"资产型号ID\",\"name\":\"asset_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"N\",\"field_type\":\"hidden\",\"field_options\":{},\"dataType\":\"varchar\"}],\"filter_conditions\":[{\"label\":\"默认条件\",\"key\":\"490dce12-0531-4bcc-a611-a7f53974d7ff\",\"type\":\"condition\",\"rights\":[{\"type\":\"all\"}],\"filter\":{\"condition\":\"AND\",\"rules\":[{\"id\":\"company_id\",\"field\":\"company_id\",\"label\":\"公司代码\",\"type\":\"string\",\"input\":\"text\",\"operator\":\"in\",\"source\":\"script\",\"value\":\"cscript.getSubOrgByCurrentUser()\"}]}}],\"export_columns\":null,\"attrs\":{\"manage_effect\":\"N\",\"init_query\":\"Y\",\"display_field\":\"N\",\"indexRow\":true,\"need_page\":\"Y\",\"page_size\":20},\"query_columns\":[{\"label\":\"设备类型\",\"name\":\"eq_type_id\",\"rights\":[{\"type\":\"all\"}],\"common\":\"Y\",\"same\":\"N\",\"field_type\":\"customDialog\",\"field_options\":{\"store\":\"id\",\"multiple\":\"N\",\"dialog\":\"Dialog_EquipmentType\",\"selector_type\":\"user\",\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"dictionary\":\"\"},\"dataType\":\"varchar\"},{\"label\":\"资产型号编码\",\"name\":\"asset_type_no\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"资产型号名称\",\"name\":\"asset_type_name\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"}],\"datasetKey\":\"sbzcxhx\",\"unique\":\"asset_type_id\"}"
            }
					],
					requestPage: {
						limit : 20,
						pageNo: this.pageNo,
					},

				}
			}else{
				param_ = param
			}
			return queryDataTable(param_)
		},
		onSearch(params){
			console.log("--------搜索条件--------", params)
			var param_ = {}
			if(null === params.parameters||undefined === params.parameters){
				param_ = {
					parameters : [
            {key: "response_data",
              value: "{\"buttons\":{\"function_buttons\":[{\"button_type\":\"search\",\"label\":\"查询\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"add\",\"label\":\"新增\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"remove\",\"label\":\"删除\"},{\"button_type\":\"edit\",\"label\":\"修改\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"detail\",\"label\":\"浏览\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"}],\"edit_buttons\":[{\"button_type\":\"close\",\"label\":\"关闭\"},{\"button_type\":\"save\",\"label\":\"保存\"}]},\"display_columns\":[{\"label\":\"型号编码\",\"name\":\"asset_type_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"型号名称\",\"name\":\"asset_type_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"生产厂商\",\"name\":\"manufacturer_ID\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{},\"dataType\":\"varchar\"},{\"label\":\"设备类型\",\"name\":\"eq_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"customDialog\",\"field_options\":{\"read_rights\":false,\"link_linkage\":null,\"display\":true,\"default_value_type\":\"fixed\",\"multiple\":\"N\",\"icon\":\"search-plus\",\"mobile\":true,\"link_config\":null,\"default_value\":\"\",\"store\":\"id\",\"required\":false,\"label_width\":100,\"link_attr\":null,\"dialog\":\"Dialog_EquipmentType\",\"is_label_width\":false,\"link_condition\":null,\"is_width\":false,\"label_width_unit\":\"px\",\"width\":100,\"width_unit\":\"%\",\"placeholder\":\"请选择\",\"dialog_type\":\"dialog\",\"hide_rights\":false},\"dataType\":\"varchar\"},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"},\"dataType\":\"varchar\"},{\"label\":\"资产型号ID\",\"name\":\"asset_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"N\",\"field_type\":\"hidden\",\"field_options\":{},\"dataType\":\"varchar\"}],\"sort_columns\":[],\"template_id\":\"740592376887640064\",\"template_type\":\"\",\"result_columns\":[],\"ext_columns\":[],\"orig_display_columns\":[{\"label\":\"型号编码\",\"name\":\"asset_type_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"型号名称\",\"name\":\"asset_type_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"生产厂商\",\"name\":\"manufacturer_ID\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{},\"dataType\":\"varchar\"},{\"label\":\"设备类型\",\"name\":\"eq_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"customDialog\",\"field_options\":{\"read_rights\":false,\"link_linkage\":null,\"display\":true,\"default_value_type\":\"fixed\",\"multiple\":\"N\",\"icon\":\"search-plus\",\"mobile\":true,\"link_config\":null,\"default_value\":\"\",\"store\":\"id\",\"required\":false,\"label_width\":100,\"link_attr\":null,\"dialog\":\"Dialog_EquipmentType\",\"is_label_width\":false,\"link_condition\":null,\"is_width\":false,\"label_width_unit\":\"px\",\"width\":100,\"width_unit\":\"%\",\"placeholder\":\"请选择\",\"dialog_type\":\"dialog\",\"hide_rights\":false},\"dataType\":\"varchar\"},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"},\"dataType\":\"varchar\"},{\"label\":\"资产型号ID\",\"name\":\"asset_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"N\",\"field_type\":\"hidden\",\"field_options\":{},\"dataType\":\"varchar\"}],\"filter_conditions\":[{\"label\":\"默认条件\",\"key\":\"490dce12-0531-4bcc-a611-a7f53974d7ff\",\"type\":\"condition\",\"rights\":[{\"type\":\"all\"}],\"filter\":{\"condition\":\"AND\",\"rules\":[{\"id\":\"company_id\",\"field\":\"company_id\",\"label\":\"公司代码\",\"type\":\"string\",\"input\":\"text\",\"operator\":\"in\",\"source\":\"script\",\"value\":\"cscript.getSubOrgByCurrentUser()\"}]}}],\"export_columns\":null,\"attrs\":{\"manage_effect\":\"N\",\"init_query\":\"Y\",\"display_field\":\"N\",\"indexRow\":true,\"need_page\":\"Y\",\"page_size\":20},\"query_columns\":[{\"label\":\"设备类型\",\"name\":\"eq_type_id\",\"rights\":[{\"type\":\"all\"}],\"common\":\"Y\",\"same\":\"N\",\"field_type\":\"customDialog\",\"field_options\":{\"store\":\"id\",\"multiple\":\"N\",\"dialog\":\"Dialog_EquipmentType\",\"selector_type\":\"user\",\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"dictionary\":\"\"},\"dataType\":\"varchar\"},{\"label\":\"资产型号编码\",\"name\":\"asset_type_no\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"资产型号名称\",\"name\":\"asset_type_name\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"}],\"datasetKey\":\"sbzcxhx\",\"unique\":\"asset_type_id\"}"
            }
					],
					requestPage: {
						limit : 20,
						pageNo: this.pageNo,
					},

				}
			}else{
				param_ = param
			}
			if(params.assetTypeNo != null&&params.assetTypeNo !== ""){
				param_.parameters.push({
					key  : "Q^asset_type_no^SL",
					value: params.assetTypeNo,
				})
			}
			if(params.assetTypeName != null&&params.assetTypeName !== ""){
				param_.parameters.push({
					key  : "Q^asset_type_name^SL",
					value: params.assetTypeName,
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
            {key: "response_data",
              value: "{\"buttons\":{\"function_buttons\":[{\"button_type\":\"search\",\"label\":\"查询\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"add\",\"label\":\"新增\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"remove\",\"label\":\"删除\"},{\"button_type\":\"edit\",\"label\":\"修改\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"detail\",\"label\":\"浏览\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"}],\"edit_buttons\":[{\"button_type\":\"close\",\"label\":\"关闭\"},{\"button_type\":\"save\",\"label\":\"保存\"}]},\"display_columns\":[{\"label\":\"型号编码\",\"name\":\"asset_type_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"型号名称\",\"name\":\"asset_type_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"生产厂商\",\"name\":\"manufacturer_ID\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{},\"dataType\":\"varchar\"},{\"label\":\"设备类型\",\"name\":\"eq_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"customDialog\",\"field_options\":{\"read_rights\":false,\"link_linkage\":null,\"display\":true,\"default_value_type\":\"fixed\",\"multiple\":\"N\",\"icon\":\"search-plus\",\"mobile\":true,\"link_config\":null,\"default_value\":\"\",\"store\":\"id\",\"required\":false,\"label_width\":100,\"link_attr\":null,\"dialog\":\"Dialog_EquipmentType\",\"is_label_width\":false,\"link_condition\":null,\"is_width\":false,\"label_width_unit\":\"px\",\"width\":100,\"width_unit\":\"%\",\"placeholder\":\"请选择\",\"dialog_type\":\"dialog\",\"hide_rights\":false},\"dataType\":\"varchar\"},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"},\"dataType\":\"varchar\"},{\"label\":\"资产型号ID\",\"name\":\"asset_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"N\",\"field_type\":\"hidden\",\"field_options\":{},\"dataType\":\"varchar\"}],\"sort_columns\":[],\"template_id\":\"740592376887640064\",\"template_type\":\"\",\"result_columns\":[],\"ext_columns\":[],\"orig_display_columns\":[{\"label\":\"型号编码\",\"name\":\"asset_type_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"型号名称\",\"name\":\"asset_type_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"生产厂商\",\"name\":\"manufacturer_ID\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{},\"dataType\":\"varchar\"},{\"label\":\"设备类型\",\"name\":\"eq_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"Y\",\"field_type\":\"customDialog\",\"field_options\":{\"read_rights\":false,\"link_linkage\":null,\"display\":true,\"default_value_type\":\"fixed\",\"multiple\":\"N\",\"icon\":\"search-plus\",\"mobile\":true,\"link_config\":null,\"default_value\":\"\",\"store\":\"id\",\"required\":false,\"label_width\":100,\"link_attr\":null,\"dialog\":\"Dialog_EquipmentType\",\"is_label_width\":false,\"link_condition\":null,\"is_width\":false,\"label_width_unit\":\"px\",\"width\":100,\"width_unit\":\"%\",\"placeholder\":\"请选择\",\"dialog_type\":\"dialog\",\"hide_rights\":false},\"dataType\":\"varchar\"},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"},\"dataType\":\"varchar\"},{\"label\":\"资产型号ID\",\"name\":\"asset_type_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":\"custom\",\"width\":\"\",\"same\":\"N\",\"field_type\":\"hidden\",\"field_options\":{},\"dataType\":\"varchar\"}],\"filter_conditions\":[{\"label\":\"默认条件\",\"key\":\"490dce12-0531-4bcc-a611-a7f53974d7ff\",\"type\":\"condition\",\"rights\":[{\"type\":\"all\"}],\"filter\":{\"condition\":\"AND\",\"rules\":[{\"id\":\"company_id\",\"field\":\"company_id\",\"label\":\"公司代码\",\"type\":\"string\",\"input\":\"text\",\"operator\":\"in\",\"source\":\"script\",\"value\":\"cscript.getSubOrgByCurrentUser()\"}]}}],\"export_columns\":null,\"attrs\":{\"manage_effect\":\"N\",\"init_query\":\"Y\",\"display_field\":\"N\",\"indexRow\":true,\"need_page\":\"Y\",\"page_size\":20},\"query_columns\":[{\"label\":\"设备类型\",\"name\":\"eq_type_id\",\"rights\":[{\"type\":\"all\"}],\"common\":\"Y\",\"same\":\"N\",\"field_type\":\"customDialog\",\"field_options\":{\"store\":\"id\",\"multiple\":\"N\",\"dialog\":\"Dialog_EquipmentType\",\"selector_type\":\"user\",\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"dictionary\":\"\"},\"dataType\":\"varchar\"},{\"label\":\"资产型号编码\",\"name\":\"asset_type_no\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"},{\"label\":\"资产型号名称\",\"name\":\"asset_type_name\",\"field_type\":\"text\",\"field_options\":{\"display\":true,\"default_value_type\":\"fixed\",\"mobile\":true,\"placeholder\":\"请输入\",\"required\":true},\"dataType\":\"varchar\"}],\"datasetKey\":\"sbzcxhx\",\"unique\":\"asset_type_id\"}"
            }
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
					relation: "OR",
				})
			}
			if(params.peqTypeId != null&&params.peqTypeId !== ""){
				param_.parameters.push({
					key     : "Q^eq_type_id^SL",
					value   : params.peqTypeId,
					relation: "OR",
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
      this.assetTypeDialogProp.toolbarProp.searchData.assetTypeNo   = ""
      this.assetTypeDialogProp.toolbarProp.searchData.assetTypeName = ""
    },
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
