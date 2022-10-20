<template>
	<vxe-modal v-model="visible" id="myModal" :width="width" :height="height" :min-width="minWidth"
			   :min-height="minHeight" esc-closable showFooter resize remember>
		<template v-slot:title>
			<slot name="dialogTitle"></slot>
		</template>
		<template v-slot>
			<vxe-grid border resizable show-overflow stripe auto-resize highlight-current-row :loading="loading"
					  height="auto" :data="tableData" :sync-resize="syncResize" :toolbar-config="tableToolbar"
					  :pager-config="tablePage" @page-change="handlePageChange" :columns="tableColumn">
				<template v-slot:toolbar_buttons>
					<slot name="searchArea"></slot>
				</template>
			</vxe-grid>
		</template>
	</vxe-modal>
</template>

<script>
export default {
	name   : "gridDialog",
	props  : {
		width      : {
			type   : String,
			default: "400",
		},
		height     : {
			type   : String,
			default: "300",
		},
		minHeight  : {
			type   : String,
			default: "300",
		},
		minWidth   : {
			type   : String,
			default: "400",
		},
		tableColumn: {
			type   : Array,
			default: [],
		},
	},
	data(){
		return {
			loading     : false,
			syncResize  : true,
			visible     : false,
			tableData   : [],
			transfer    : true,
			tableCustom : {
				storage: true,
			},
			tableToolbar: {
				size : "mini",
				slots: {
					buttons: "toolbar_buttons",
				},
			},
			tablePage   : {
				total      : 0,
				currentPage: 1,
				pageSize   : 10,
				align      : "left",
				pageSizes  : [5, 8, 10, 15],
				layouts    : ["Sizes", "PrevJump", "PrevPage", "Number", "NextPage", "NextJump", "FullJump", "Total"],
				perfect    : true,
			},
		}
	},
	created(){
	},
	methods: {
		load_init(){
			this.loading = true
		},
		load_close(){
			this.loading = false
		},
		open(){
			this.visible = true
		},
		close(){
			this.visible = false
		},
		setTableData(tableData, currentPage, pageSize, total){
			this.tableData             = tableData
			this.tablePage.currentPage = currentPage
			this.tablePage.pageSize    = pageSize
			this.tablePage.total       = total
		},
		handlePageChange({ currentPage, pageSize }){
			this.tablePage.currentPage = currentPage
			this.tablePage.pageSize    = pageSize
			this.$emit("reloadGrid", currentPage, pageSize)
		},
	},
}
</script>

<style scoped="scoped">
.vxe-toolbar.size--mini {
	height: 20px !important
}
</style>
