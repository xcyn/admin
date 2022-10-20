<template>
	<div id="sac-tree">
		<el-input placeholder="输入关键字进行过滤" v-model="filterText">
		</el-input>

		<el-tree class="filter-tree" :data="data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" :node-click='treeClick' ref="tree">
		</el-tree>

	</div>
</template>

<script>
	export default {
		name: 'SacTree',
		props: {
			/** 树组件参数 */
			treeData: {
				type: Array,
				default: ()=>[]
			},
			/** 树组件渲染key */
			defaultProps: {
				type: Object,
				default: ()=>{
					return {
					children: 'children',
					label: 'label'
				}
				}
		}
		},
		components: {},
		data() {
			return {
				filterText: '',
				data: this.treeData 
			}
		},
		methods: {

			filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			treeClick(data,nodes,documents) {
				console.log(data,nodes,documents)
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
	}
</script>

<style>

</style>