<template>
	<z-dialog-table ref="tpeDiaTb" :title="tpeProp.title" :toolbar-prop="tpeProp.toolbarProp" key_="parm_no"
					:table-prop="tpeProp.tableProp" :tree-prop="tpeProp.treeProp"
					:selection-handle="tpeProp.selectionHandle" @toolbar-search="onTpeSearch" @ok="onTpeOk">
		<template slot="searchBar">
			<el-form-item label="参数编码" prop="parm_no">
				<el-input v-model="tpeProp.toolbarProp.searchData.parm_no" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="参数名称" prop="parm_name">
				<el-input v-model="tpeProp.toolbarProp.searchData.parm_name" placeholder="请输入" />
			</el-form-item>
		</template>
	</z-dialog-table>
</template>
<script>
import * as comnHttp from "@/api/cpApi/common/index"

export default {
	name   : "assetTecParam-dialog-select",
	props  : { // String Number Boolean Array Object Function || validator (value) {}
		multipleSelect: {
			type   : Boolean,
			default: true,
		},
	},
	data(){
		return {
      pageNo: 1,
			tpeProp: {
				title          : "设备技术参数",
				selectionHandle: this.tpeSelection,
				toolbarProp    : {
					// 搜索数据
					searchData: {
						parm_no  : "",
						parm_name: "",
					},
				},
				// 表格属性
				tableProp      : {
					multipleSelect  : this.multipleSelect, // 是否可多选
					dataSource      : this.initTable, // 表格分页查询接口， Promise 对象
					paginationHandle: this.tpePagination, // 分页条件处理 返回分页查询条件
					columns         : [ // 显示列
						{
							title: "参数编码",
							key  : "parm_no",
						},
						{
							title: "参数名称",
							key  : "parm_name",
						},
						{
							title: "单位",
							key  : "unit",
						},
						{
							title: "状态",
							key  : "is_on",
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
	methods: {
		init(){
			this.$refs.tpeDiaTb.open()
			// 加载弹出框列表数据
			this.$nextTick(() => {
				this.$refs.tpeDiaTb.tableQuery()
			})
		},
		initTable(param){
      let param_ = {}
      if(null === param.parameters || undefined === param.parameters){
        param_ = {
          parameters: [
            {
              key  : "key",
              value: "sbjscsgdy",
            },
          ],
          requestPage: {
            limit : 20,
            pageNo: this.pageNo,
          },
        }
      }
			return comnHttp.findDataByKey(param_)
		},
		onTpeSearch(params){
			console.log("--------搜索条件--------", params)
			// 加载列表数据
			const param = {
				parameters: [
					{
						key  : "key",
						value: "sbjscsgdy",
					},
				],
			}
			if(params.parm_no != null&&params.parm_no !== ""){
				param.parameters.push({
					key  : "Q^parm_no^SL",
					value: params.parm_no,
				})
			}
			if(params.parm_name != null&&params.parm_name !== ""){
				param.parameters.push({
					key  : "Q^parm_name^SL",
					value: params.parm_name,
				})
			}
			this.$refs.tpeDiaTb.tableQuery(param)
		},
		tpePagination(pagination){
      this.pageNo = pagination.pageNo
			return { requestPage: pagination }
		},
		/**
		 * 处理勾选数据展示
		 */
		tpeSelection(selection){
			return selection.parm_name
		},
		/**
		 * 弹出表格确定事件
		 */
		onTpeOk(seleted){
			this.$emit("onDTableOk", seleted)
		},
	},
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
