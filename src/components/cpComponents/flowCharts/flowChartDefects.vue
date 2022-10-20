<!-- 缺陷流程图 -->
<template>
	<div>
		<el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" class="flow-diagram-dialog" append-to-body title="流程图" top="2vh" width="80%" @open="initData" @close="dialogVisible=false">
			<div class="flowChart">
				<RelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick" :on-line-click="onLineClick" />
			</div>
		</el-dialog>

		<!--审批历史-->
		<approval-history-dialog :visible="approvalHistoryVisible" :task-id="taskId" :inst-id="instId" :node-id="nodeId" :biz-key="bizKey" type="node" width="70%" @close="visible => approvalHistoryVisible= visible" />
	</div>
</template>

 <script>
import RelationGraph from 'relation-graph';
import { getFlowDiagram } from '@/api/platform/bpmn/bpmImage';
import { nodeList, linkList } from "./flowData.js";
import ApprovalHistoryDialog from '@/business/platform/bpmn/components/approval-history/dialog';
export default {
	name: 'Demo',
	components: { RelationGraph, ApprovalHistoryDialog },
	props: {
		instId: String,
		nodeIdFlash: String,//闪烁的节点Id
	},
	data () {
		return {
			nodeId: '',//点击的节点id
			approvalHistoryVisible: false,
			dialogVisible: false,
			data: [],//数据库查出来的数据
			nodeList: nodeList,
			linkList: linkList,
			graphOptions: {
				'layouts': [
					{
						'label': '手工',
						'layoutName': 'fixed',
						'layoutClassName': 'seeks-layout-fixed',
						'defaultJunctionPoint': 'border',
					}
				],
				//通用配置
				'defaultFocusRootNode': false,//默认为根节点添加一个被选中的样式
				'useLayoutStyleOptions': true,
				disableDragNode: true,//是否能拖动节点
				'defaultLineShape': 5,
				'defaultNodeShape': 1,
				'defaultNodeWidth': '60',
				'defaultNodeHeight': '60',
				'defaultNodeBorderWidth': 1,
				'defaultNodeBorderColor': "black",
				'defaultNodeColor': '#fff',
				'defaultNodeFontColor': "black",
				'defaultLineColor': 'black',
			}
		}
	},
	watch: {
		//this.refs.["组件名称"].dialogVisible=true打开此界面
		dialogVisible (val) {
			if (val) {
				this.initData();
			}
		}
	},
	mounted () {
		this.initData();
	},
	methods: {
		//第一步，获取数据库数据
		initData (instId) {
			this.instId = instId;
			// this.$emit('loading', true)
			getFlowDiagram({
				instId: instId,
				ignoreInstIdNull: this.$utils.isEmpty(instId) ? true : null,
				// _t: "1t9ry92",
			}).then(response => {
				// this.$emit('loading', false)
				let obj = response.data.styleMap ? response.data.styleMap : {};
				let keys = Object.keys(obj);
				this.data = []
				if (keys && keys.length > 0) {
					keys.forEach(item => {
						let colorObj = {
							name: item,
							color: obj[item].borderColor
						}
						this.data.push(colorObj);
					});
				}
				this.getNodeList();
			}).catch(() => {
				// this.$emit('loading', false)
			})

		},
		//第二步,处理数据
		getNodeList () {
			let nodes = [];
			let y = 250;
			if (this.nodeList && this.nodeList.length > 0) {
				//赋初始值
				this.nodeList.forEach(item => {
					//通用属性
					let obj = {
						id: item.id,
						text: item.text,
						data: { nodeId: item.nodeId },
						fixed: true,
						disableDefaultClickEffect: true,//禁止被选中的样式
						x: item.x,
						y: item.y ? item.y : y,
					};
					//赋值圆、菱形节点
					if (item.shape || item.shape == 0) {
						obj.nodeShape = item.shape;
						if (item.shape == 2) {
							obj.width = 150;
							obj.height = 150;
							obj.html = '<div style="width: 65px;height: 90px;"><div style="width: 70px;height: 70px;transform: rotate(45deg) skew(15deg, 15deg);color:black;border:1px solid black"></div><div style="position: absolute;left: 15px;top: 33px;color:black;text-align: center;width:60px;">' + item.text + '</div></div>'
						}
					}
					//当前节点闪烁表示
					if (this.nodeIdFlash && item.nodeId == this.nodeIdFlash) {
						obj.styleClass = "nodeStyle";
					}
					nodes.push(obj);
				});
				//赋数据库值borderColor
				let index = 0;
				if (this.data && this.data.length > 0) {
					for (let i = 0; i < this.data.length; i++) {
						for (let j = 0; j < nodes.length; j++) {
							if (this.data[i].name == nodes[j].data.nodeId) {
								//菱形边框
								nodes[j].borderColor = this.data[i].color ? this.data[i].color : "";
								//当前节点
								index = j > index ? j : index
								break;
							}
						}
					}

				}
				//当前节点闪烁表示
				// nodes[index].styleClass = "nodeStyle";

			}
			this.nodeList = nodes;
			this.showSeeksGraph()
		},
		//第二步,从父组件传过来的值得到节点连接关系，此处定义在对象中，无需获取
		//第三步画图
		showSeeksGraph (query) {
			var __graph_json_data = {
				rootId: this.nodeList && this.nodeList.length > 0 ? this.nodeList[0].id : "1",
				nodes: this.nodeList,
				links: this.linkList
			}
			// 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置 
			this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
				// Called when the relation-graph is completed 
			})
		},
		onNodeClick (nodeObject, $event) {
			this.$nextTick(() => {
				this.nodeId = nodeObject.data.nodeId;
				if (!nodeObject.nodeShape || odeObject.nodeShape != 2) {
					this.approvalHistoryVisible = true;
				}
			})

		},
		onLineClick (lineObject, $event) {
		}
	}
}
 </script>
 <style  lang="scss">
.lineStyle {
	//  color:red;
	text-align: center;
}
.flowChart {
	height: calc(100% - 20px);
	width: calc(100% - 20px);
	margin: 10px;
}
.nodeStyle {
	background-color: #fb3d3d !important; /** 通过自定义样式设置节点颜色需要加 !important **/
}
//闪烁配置
// .nodeStyle {
// 	animation: myFlash 600ms infinite;
// 	-webkit-animation: myFlash 600ms infinite;
// }
// @keyframes myFlash {
// 	from {
// 		opacity: 1;
// 	}
// 	50% {
// 		opacity: 0.4;
// 	}
// 	to {
// 		opacity: 1;
// 	}
// }
// @-webkit-keyframes myFlash {
// 	from {
// 		opacity: 1;
// 	}
// 	50% {
// 		opacity: 0.4;
// 	}
// 	to {
// 		opacity: 1;
// 	}
// }
</style>
