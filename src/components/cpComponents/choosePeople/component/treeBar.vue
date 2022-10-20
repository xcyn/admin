<template>
	<div class="treeBar">
		<el-row :gutter="10" style="margin-top:10px;font-weight: 600;height:24px;line-height: 24px;">
			<el-col :span="16">树标题</el-col>
			<el-col :span="8"><i class="el-icon-d-arrow-left iconStyle" @click="changeTree"></i></el-col>
		</el-row>
		<el-row>
			<el-input placeholder="输入关键字过滤" v-model="filterText" class="textInput">
			</el-input>
			<el-button type="primary" icon="el-icon-search" class="buttonSearch" @click="filterTree"></el-button>
		</el-row>
		<el-tree class="filterTree" :data="data" :props="defaultProps" @node-click="handleNodeClick" :default-expand-all="false" :filter-node-method="filterNode" ref="tree">
		</el-tree>
	</div>
</template>
<script>

export default {

	data () {
		return {
			filterText: '',
			data: [{
				id: 1,
				label: '一级 1',
				children: [{
					id: 4,
					label: '二级 1-1',
					children: [{
						id: 9,
						label: '三级 1-1-1'
					}, {
						id: 10,
						label: '现在擦所大错所大法师东方故事大幅度发圣诞的'
					}]
				}]
			}, {
				id: 2,
				label: '一级 2',
				children: [{
					id: 5,
					label: '二级 2-1'
				}, {
					id: 6,
					label: '二级 2-2'
				}]
			}, {
				id: 3,
				label: '一级 3',
				children: [{
					id: 7,
					label: '二级 3-1'
				}, {
					id: 8,
					label: '二级 3-2'
				}, {
					id: 100,
					label: '二级 3-1'
				}, {
					id: 101,
					label: '二级 3-2'
				}, {
					id: 102,
					label: '二级 3-1'
				}, {
					id: 103,
					label: '二级 3-2'
				}, {
					id: 104,
					label: '二级 3-1'
				}, {
					id: 105,
					label: '二级 3-2'
				}, {
					id: 106,
					label: '二级 3-1'
				}, {
					id: 107,
					label: '二级 3-2'
				},]
			}],
			defaultProps: {
				children: 'children',
				label: 'label'
			}
		};
	},
	watch: {

	},
	mounted () {
		this.initTreeData();
	},
	methods: {
		initTreeData () {

		},
		//隐藏树
		changeTree () {
			this.$emit("changeTree");
		},
		//点击树
		handleNodeClick (data) {
			this.$emit("handleNodeClick", data);
		},
		//过滤树
		filterTree () {
			this.$refs.tree.filter(this.filterText);
		},
		filterNode (value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
	}
};
</script>
<style lang="scss" scoped>
.treeBar {
	width: calc(100% - 20px);
	height: 100%;
	border: 1px solid #e7e7e7;
	overflow: auto;
	background: #fff;
	padding: 0 10px;
}

.filterTree {
	min-width: 100%;
	display: inline-block;
	margin-top: 10px;
}
.textInput {
	margin-top: 10px;
	width: calc(100% - 52px);
	.el-input__inner {
		border-radius: 3px 0 0 3px !important;
	}
}
.buttonSearch {
	border-radius: 0 3px 3px 0 !important;
	vertical-align: bottom;
}
.iconStyle {
	float: right;
	margin-right: 5px;
	font-size: 20px;
	cursor: pointer;
	line-height: 24px;
}
</style>