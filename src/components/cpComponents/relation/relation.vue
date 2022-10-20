<template>
	<div id="myPage">
		<div ref="myPage" :style="{'height':height}" @click="isShowNodeMenuPanel = false">
			<SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick" :on-line-click="onLineClick">
				<div slot="node" title="" slot-scope="{node}" @mouseover="mvTitle(node.data.data.responsibility, $event)" style="text-align:left;cursor:pointer">
					<!-- <div
            @click="showNodeMenus(node, $event)"
            @contextmenu.prevent.stop="showNodeMenus(node, $event)"
          >-->
					<el-card @click="showNodeMenus(node, $event)" @contextmenu.prevent.stop="showNodeMenus(node, $event)">
						<div slot="header" class="clearfix">
							<span>{{node.data.name}}</span>
							<el-dropdown style="float:right" v-if="edit">
								<span class="el-dropdown-link">
									<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item @click.native="editNode(node)">编辑机构</el-dropdown-item>
									<el-dropdown-item @click.native="addChild(node)">增加子机构</el-dropdown-item>
									<el-dropdown-item @click.native="removeNode(node)" :disabled="node.id == nodeData.rootId" divided>删除</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
						<el-tag v-for="(item,index) of node.data.personList" :key="index" style="margin:0 5px 5px 0;min-width:54px; text-align:center;">{{item.name}}</el-tag>
					</el-card>
				</div>
				<!-- </div> -->
			</SeeksRelationGraph>
		</div>
		<el-dialog class="yj-dialog" :title="addOrEdit == 'add'?'增加节点':'编辑节点'" :visible.sync="dialogVisible" width="30%">
			<el-form :model="dialogForm" ref="dialogForm" label-position="right" label-width="120px" :rules="rule" size="mini">
				<el-row>
					<el-col :span="12">
						<el-form-item label="上级机构:">
							<span>{{dialogForm.parentName}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="机构类别:">
							<span>{{dialogForm.typeName}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="机构层级:">
							<span>{{dialogForm.level}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="人数:">
							<span>{{tableData&&tableData.length>0?tableData.length:0}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="机构名称:" prop="name">
							<el-input v-model="dialogForm.name" maxlength="64" show-word-limit  placeholder="请输入机构名称"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="职责说明:" prop="responsibility">
							<el-input v-model="dialogForm.responsibility" maxlength="512" show-word-limit placeholder="请输入职责说明"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="tab">
							<el-tabs v-model="activeName">
								<el-tab-pane label="人员信息" name="first">
									<div class="tab-bd">
										<div class="table-box">
											<div class="tolls-bar">
												<el-button class="layui-btn layui-btn-danger" @click="addSelection">添加</el-button>
												<el-button class="layui-btn btn layui-btn-danger" @click="delSelection" :disabled="tableSelectData.length<1">删除</el-button>
											</div>
											<el-table border :data.sync="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
												<el-table-column type="selection" width="50"></el-table-column>
												<el-table-column prop="name" label="人员" width="200"></el-table-column>
												<el-table-column prop="job" label="岗位" show-overflow-tooltip>
                          <template slot-scope="scope">
                            {{scope.row.job | changeJob(jobList)}}
                          </template>
                        </el-table-column>
												<el-table-column prop="department" label="部门" show-overflow-tooltip></el-table-column>
											</el-table>
										</div>
									</div>
								</el-tab-pane>
							</el-tabs>
						</div>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save">确 定</el-button>
				<el-button @click="dialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
    <user-dialog-select :selectedStrs="selectedUser" ref="userDSel1" :multiple-select="true" @onDTableOk="onuserDTableOk1" />
	</div>
</template>

<script>
import SeeksRelationGraph from "relation-graph";
import * as mechanismHttp from "@/api/cpApi/base/mechanism/mechanism";
import { getTreeData } from "@/api/platform/org/position";
import userDialogSelect from "@/components/cpComponents/cp-dialog-select/userDialogSel";
export default {
	name: "relation",
	props: {
		height: {
			type: String,
			default: "calc(100vh - 400px)"
		},
		from: {
			type: String,
			default: "left"
		},
		nodeList: {
			type: Object,
			default: {}
		},
		edit: {
			type: Boolean,
			default: true
		}
	},
	components: { SeeksRelationGraph,userDialogSelect},
	data () {
		return {
      selectedUser: "",
      jobList: [],
			activeName: "first",
			rule: {
				name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
				responsibility: [
					{ required: true, message: "请输入职责说明", trigger: "blur" }
				]
			},
			addOrEdit: "",
			dialogForm: {},
			dialogVisible: false,
			nodeData: null,
			// editNode: null,
			tableSelectData: [],
			tableData: [],
			deleteNode: [],
			addNode: [],
			isShowCodePanel: false,
			isShowNodeMenuPanel: false,
			nodeMenuPanelPosition: { x: 10, y: 10 },
			responsibilityTitle: '',
			graphOptions: {
				layouts: [
					{
						// label: "中心",
						layoutName: "tree",
						layoutClassName: "seeks-layout-tree",
						defaultJunctionPoint: "border",
						defaultNodeShape: 0,
						defaultLineShape: 1,
						from: this.from,
						// centerOffset_x: this.from == "left" ? 0 : -100,
						// centerOffset_y: this.from == "left" ? -100 : -150,
						max_per_width: "350",
						min_per_width: "300",
						max_per_height: "350",
						min_per_height: "200",
					}
				],
				defaultNodeShape: 1,
				defaultNodeColor: "#ffffff",
				defaultNodeBorderColor: "#000000",
				defaultNodeBorderWidth: 0,
				defaultNodeFontColor: "#000000",
				defaultNodeWidth: "220",
				// defaultNodeHeight: "150",
				defaultJunctionPoint: this.from == "left" ? "lr" : "tb",
				defaultLineMarker: {
					markerWidth: "0",
					markerHeight: "0"
				},
				defaultLineColor: "#000000",
				allowShowMiniToolBar: false,
				defaultLineShape: 4 //折线
				// 这里可以参考"Graph 图谱"中的参数进行设置
			}
		};
	},
	mounted () {
    // 获取岗位信息
    getTreeData().then((res) => {
      this.jobList = res.data && res.data.length > 0 ? res.data : []
    })
		// this.showSeeksGraph();
	},
	methods: {
		save () {
			this.dialogForm.personnelList = this.tableData;
			console.log(this.dialogForm);
			this.$refs["dialogForm"].validate(valid => {
				if (valid) {
					if (this.tableData.length < 1) {
						this.$message.error("请选择人员");
						return;
					}
					if (this.addOrEdit == "add") {
						mechanismHttp
							.save(this.dialogForm)
							.then(res => {
								this.$message.success("新增机构成功");
								this.dialogForm = {};
								this.tableData = [];
								this.dialogVisible = false;
								this.$emit("reload");
							})
							.catch(error => {
								console.log(error);
								this.loading = false;
								this.$message.error("新增机构失败");
							});
					} else {
						mechanismHttp
							.edit(this.dialogForm)
							.then(res => {
								this.$message.success("修改机构成功");
								this.dialogForm = {};
								this.tableData = [];
								this.dialogVisible = false;
								this.$emit("reload");
							})
							.catch(error => {
								this.$message.error("修改机构失败");
							});
					}
				} else {
					return false;
				}
			})
		},
    addSelection () {
      this.$refs.userDSel1.init();
    },
    onuserDTableOk1 (data) {
      this.tableData = [];
      if (data && data.length > 0) {
        this.tableData = data.map((item) => {
          let obj = {
            department: item.column.orgName,
            departmentId: item.column.groupID,
            name: item.column.name,
            personnelId: item.column.id,
            job: item.column.positions //岗位
          }
          return obj
        })
      }
      this.dialogForm.personnelNo = this.tableData.length;
    },
		handleSelectionChange (data) {
			this.tableSelectData = data;
		},
		delSelection () {
			this.tableSelectData.forEach(item => {
				this.tableData.forEach((_item, index) => {
					if (item.personnelId) {
						if (item.personnelId == _item.personnelId) {
							this.tableData.splice(index, 1);
							return false;
						}
					} else {
						if (item.personnelId == _item.personnelId) {
							this.tableData.splice(index, 1);
							return false;
						}
					}
				});
			});
			this.dialogForm.peopleNumber = this.tableData.length;
		},
		addChild (node) {
			// this.editNode = node;
			this.addOrEdit = "add";
      this.tableData =[];
			this.dialogForm = {
				parentId: node.id,
				parentName: node.data.name,
				company: node.data.data.company,
				companyId: node.data.data.companyId,
				type: node.data.data.type,
				typeNmae: this.nodeData.typeName,
				level: node.data.data.level + 1
			};
			this.dialogVisible = true;
		},
		editNode (node) {
			// this.editNode = node;
			this.addOrEdit = "edit";
			this.dialogForm = node.data.data;
			this.dialogForm.typeName = this.nodeData.typeName;
			this.tableData = JSON.parse(
				JSON.stringify(this.dialogForm.personnelList)
			);
			this.dialogVisible = true;
		},
		setUsers (data) {
			console.log(data);
		},
		removeNode (node) {
			this.$confirm(
				"本操作会将当前层级及其下属层级一并删除，请确认！",
				"提示",
				{
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}
			).then(() => {
				mechanismHttp
					.del(node.id)
					.then(res => {
						this.$message.success("删除机构成功");
						this.$emit("reload");
					})
					.catch(error => {
						this.$message.error("删除机构失败");
					});
			});
			// this.nodeData.nodes.forEach((item, index) => {
			//   if (item.id === node.id) {
			//     this.deleteNode.push(JSON.parse(JSON.stringify(item)));
			//     this.nodeData.nodes.splice(index, 1);
			//     this.loadMap();
			//     return false;
			//   }
			// });
		},
		loadMap () {
			this.$refs.seeksRelationGraph.setJsonData(this.nodeData, seeksRGGraph => {
				// 这些写上当图谱初始化完成后需要执行的代码
			});
		},
		showSeeksGraph (data) {
			// if (data && data.rootId) {
			this.nodeData = data;
			if (this.edit && this.nodeData.nodes.length === 0) {
				this.addOrEdit = "add";
				this.dialogForm = {
					parentId: 0,
					parentName: "",
					company: this.nodeData.company,
					companyId: this.nodeData.companyId,
					typeName: this.nodeData.typeName,
					type: this.nodeData.type,
					level: 1
				};
				this.dialogVisible = true;
			}
			this.$refs.seeksRelationGraph.setJsonData(this.nodeData, seeksRGGraph => {
				// 这些写上当图谱初始化完成后需要执行的代码
			});
			// }
		},
		onNodeClick (nodeObject, $event) {
			console.log("onNodeClick:", nodeObject);
		},
		onLineClick (lineObject, $event) {
			console.log("onLineClick:", lineObject);
		},
		showNodeMenus (nodeObject, $event) {
			this.currentNode = nodeObject;
			var _base_position = this.$refs.myPage.getBoundingClientRect();
			console.log("showNodeMenus:", $event, _base_position);
			this.isShowNodeMenuPanel = true;
			this.nodeMenuPanelPosition.x = $event.clientX - _base_position.x;
			this.nodeMenuPanelPosition.y = $event.clientY - _base_position.y;
		},
		doAction (actionName) {
			this.$notify({
				title: "提示",
				message: "对节点【" + this.currentNode.text + "】进行了：" + actionName,
				type: "success"
			});
			this.isShowNodeMenuPanel = false;
		},
		mvTitle (title, obj) { //职责说明提示
			obj.target.title = title
		}
	},
  watch: {
    tableData (val) {
      this.selectedUser = "";
      if (val && val.length > 0) {
        let users = val.map((item) => item.personnelId + "|" + item.name);
        this.selectedUser = users.toString();
      }
    }

  },
  filters: {
    changeJob (val, list) {
      let name = [];
      if (val && val.length > 0 && list && list.length > 0) {
        let jobIds = val.split(",");
        if (jobIds && jobIds.length > 0) {
          let nameList = list.filter((item) => {
            if (jobIds.includes(item.id)) {
              return item.name
            }
          })
          if (nameList && nameList.length > 0) {
            name = nameList.map((item) => item.name)
          }
        }
      }
      return name.toString();
    }
  }
};
</script>

<style lang="scss">
#myPage {
	.el-card__header {
		padding: 10px;
	}
	// .el-button {
	// 	padding: 0;
	// }
	.rel-node-shape-1 {
		padding: 0;
	}

	.rel-node-checked {
		-moz-transform: unset;
	}
}
</style>

<style lang="scss" scoped>
.c-node-menu-item {
	line-height: 30px;
	padding-left: 10px;
	cursor: pointer;
	color: #444444;
	font-size: 14px;
	border-top: #efefef solid 1px;
}
.c-node-menu-item:hover {
	background-color: rgba(66, 187, 66, 0.2);
}


.el-dropdown-menu{
  .is-disabled {
    cursor:not-allowed ;
    color:#EBEEF5;
    pointer-events: none;
  }
}
</style>
