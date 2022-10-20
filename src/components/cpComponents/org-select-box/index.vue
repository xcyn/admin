<template>
	<div @click="showDialog">
		<el-input :disabled="isView" v-model="selectName" placeholder="请选择" :validate-event="false" clearable @clear="resetUser">
			<el-button v-if="!inputClick" @click="dialogVisible=true" slot="append" icon="el-icon-search"></el-button>
		</el-input>
		<el-dialog class="yj-dialog" append-to-body :visible.sync="dialogVisible" :before-close="handleDialogClose">
			<div slot="title">
				<span>组织架构</span>
			</div>
			<div id="org-tree-table">
				<div class="left">
					<el-tree :props="props" :load="loadNode" node-key="id" lazy @node-click="nodeClick"></el-tree>
				</div>

				<div class="right">
					<div>
						<el-form :inline="true" style="margin-left: 8px;">
							<el-form-item label="姓名">
								<el-input v-model="name" placeholder="请输入" clearable />
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="query">查询</el-button>
							</el-form-item>
						</el-form>
					</div>
					<div class="table-box">
						<iTable :table-data="dataList" :key="dataList.length" :columns="columns" :loading="loading" :pagination="pagination" @handleTableChange="handleTableChange" @rowClick="rowClick" ref="iTable"></iTable>
					</div>
				</div>
			</div>
			<!-- <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="showVisabled = false">确 定</el-button>
      </span>-->
		</el-dialog>
	</div>
</template>
<script>
import iTable from "@/components/cpComponents/sac-tree-table/iTable.vue";
import * as ipbsHttp from "@/api/cpApi/ibps/index";
import * as entityAPI   from "@/api/cpApi/entity/entityAPI.js"
export default {
	name: "orgSelectBox",
	components: { iTable },
	props: {
		username: {
			type: String,
			default: ""
		},
		inputClick: {
			type: Boolean,
			default: true
		},
		isView: Boolean
	},
	data () {
		return {
			flag: true,//清空input时不打开dialog
			loading: false,
			selectName: "",
			dialogVisible: false,
			dataList: [],
			pagination: {
				size: 20,
				total: 0
			},
			props: {
				label: "name",
				id: "id"
			},
			columns: [
				{
					prop: "name",
					label: "姓名"
				},
				{
					prop: "gender",
					label: "性别",
					format (row, cell, val) {
						return val == "male" ? "男" : "女";
					}
				},
				{
					prop: "createTime",
					label: "创建时间"
				}
			],
			defOrgId: "",
			orgId: "",
			orgName: "",
			employeeList: [],
			checkNode: null,
			name: ''
		};
	},
	watch: {
		username (newval) {
			this.selectName = newval;
		}
	},
	created () {
		this.loadNode(null);
		this.selectName = this.username;
	},
	methods: {
		/**
		 * 人员姓名查询
		 */
		query () {
			this.loading = true;
			let parameters;
			if (this.checkNode != '') {
				parameters = [{ key: "Q^GROUP_ID_^S", value: this.checkNode.id }, { key: "Q^NAME_^SL", value: this.name }]
			} else {
				parameters = [{ key: "Q^NAME_^SL", value: this.name }]
			}
			ipbsHttp
				.employeeQueryOrgUser({
					parameters: parameters,
					requestPage: this.pagination
				})
				.then(res => {
					this.dataList = res.data.dataResult;
					if (this.dataList.length > 0) {
						this.pagination.total = res.data.pageResult.totalCount;
					} else {
						this.pagination.total = 0
					}
					this.loading = false;
				})
		},
		setValue (val) {
			this.defOrgId = val;
		},
		showDialog () {
			//清空时阻止打开dialog
			if (!this.flag) {
				this.flag = true;
				return
			}
			if (this.inputClick) {
				this.dialogVisible = true;
			}
		},
		clearVal (event) {
			event.stopPropagation();
			this.selectName = "";
		},
		loadNode (node, resolve) {
			let data;
			if (node === null || !node.data) {
				console.log(this.defOrgId);
				if (this.defOrgId != "") {
					data = {
						parameters: [
							{ key: "type", value: 1 },
							{ key: "orgId", value: this.defOrgId }
						]
					};
				} else {
					data = {
						parameters: [
							{ key: "type", value: 1 },
							{ key: "orgId", value: 0 }
						]
					};
				}
			} else {
				data = {
					parameters: [
						{ key: "type", value: 1 },
						{ key: "orgId", value: node.data.id }
					]
				};
			}
			ipbsHttp.orgTree(data).then(res => {
				let json = [];
				res.data.forEach(element => {
					json.push({
						name: element.name,
						id: element.id,
						type: element.type,
						alias: element.alias,
						faId: element.parentId
					});
				});
				if (node === null || !node.data) {
					this.orgId = json[0].id;
					this.orgName = json[0].name;
				}
				if (resolve) return resolve(json);
			});
		},
		nodeClick (node) {
			this.checkNode = node;
			if (node.id != "0") {
				this.loading = true;
				ipbsHttp
					.employeeQueryOrgUser({
						parameters: [{ key: "Q^GROUP_ID_^S", value: node.id }],
						requestPage: this.pagination
					})
					.then(res => {
						this.dataList = res.data.dataResult;
						if (this.dataList.length > 0) {
							this.pagination.total = res.data.pageResult.totalCount;
						} else {
							this.pagination.total = 0
						}
						this.loading = false;
					});
			}
		},

	async	rowClick (row) {
		if (!row.id) {
			return false;
		}
		let ret = await ipbsHttp.getPositions(row.positions)
		let jobName = "";
		let firstName="";
			if (ret.data && ret.data.length > 0) {
				firstName=ret.data[0].name;
				//拼接岗位名字
				ret.data.forEach((item,length) => {
					length++;
					jobName = jobName + item.name + (length == ret.data.length ? "" : ",")
				});
			}
		let obj = {
			userId: row.id,
			userName: row.name,
			bmId: "",
			bmName: "",
			orgId: "",
			orgName: "",
			alias: "",
			//第一个岗位名字
			positions: firstName,
			//岗位编号
			signUserJob:jobName,
			mobile: row.mobile
		};
		//获取最近的部门和公司数据
	 	let res = 	await	entityAPI.getDepartmentByUserId( row.id)
		obj.bmId=res.data&&res.data.id?res.data.id:"";//部门ID
		obj.bmName= res.data&&res.data.name?res.data.name:"" //部门名称
		//row
		if(row.orgName){
			let orgs=row.orgName.split(".")
			obj.orgName=orgs&&orgs.length>0?orgs[0]:""
		}
		//组织编号
		if(res.data&&res.data.path){
			let paths=res.data.path.split(".")
			obj.orgId=paths&&paths.length>0?paths[0]:""
		}
		this.selectName = row.name
		this.$emit("rowClick", obj)
		this.dialogVisible = false;

		},
		//清空用户
		resetUser () {
			this.flag = false;
			this.$emit("rowClick", {
				userId: "",
				userName: "",
				bmId: "",
				bmName: "",
				orgId: "",
				orgName: "",
				alias: "",
				//第一个岗位名字
				positions: "",
				//岗位
				signUserJob: "",
				mobile: ""
			});
		},
		//下一页的的回调
		handleTableChange (pagination) {
			this.getList(pagination);
		},
		handleDialogClose () {
			this.dialogVisible = false;
		}
	}
};
</script>
<style lang="scss">
#org-tree-table {
	display: flex;
	flex: 1;
	width: 100%;
	background-color: #fff;
	& > div {
		height: 100%;
	}
	& > .left {
		width: 250px;
		min-height: 300px;
		border: 1px solid #e8e8e8;
		box-sizing: border-box;
		padding: 5px;
	}
	& > .right {
		flex: 1;
		width: 100%;
	}
}
</style>
