<template>
	<div id="sac-select-tree">
		<treeselect size='mini' v-model="values"   :multiple="multiple" @input='getSelectTreeId' :options="options" :max-height="200" />
	</div>
</template>

<script>
	import Treeselect from '@riophae/vue-treeselect'
	// import the styles
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'

	export default {
		name: 'treeSelect',
		props: {
			/** 开启下拉树多选 */
			multiple: {
				type: Boolean,
				default: false
			},
			/** 默认的选中值 */
			value: {
				type: String,
				default: null
			},
			/** 目录树的结构图 */
			options: {
				type: Array,
				default: ()=>[]
			},
		},
		components: {
			Treeselect
		},
		data() {
			return {
				values: this.value
			}
		},
		methods: {
			getSelectTreeId(value, i) {
				this.$emit('getSelectTreeId', value)
			}
		}
	}
</script>

<style>
 .sac-select-tree{
 	position: relative;
 	color: #666;
 }
 .vue-treeselect__control{
 	height: 28px;
 }
 .vue-treeselect__placeholder{
 	line-height: 28px;
 }
 .vue-treeselect__single-value{
 	line-height: 28px;
 	color: #666;
 }
</style>
