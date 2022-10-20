<template>
	<div id="selectInput">
		<el-input v-model="value" :disabled="isView" :clearable="clearable" @input="input" maxlength="50" placeholder="请输入内容,不超过50个字">
			<i v-if="!isView" class="el-icon-plus el-input__icon" slot="append" @click="handleIconClick"></i>
		</el-input>
		<el-dialog class="yj-dialog" append-to-body :visible.sync="choseDialogVisible" :before-close="handleChoseDialogClose">
			<div slot="title">
				<span>危险源</span>
			</div>
			<div class="sac-tree-table" style="margin:-20px 0 0 0;">
				<div class="filter-top">
					<el-form :model="searchForm" ref="searchForm" label-width="90px" :inline="true" class="yj-search-form">
						<el-form-item label="类型" class="yl-col6">
							<el-select v-model="searchForm.type" clearable placeholder="请选择" @clear="clear">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="分类" class="yl-col6">
							<SacTreeSelect :options="treeData" :props="treeProps" :clearable="true" @input="checkNode"></SacTreeSelect>
						</el-form-item>
						<el-form-item label="危险源名称" class="yl-col6">
							<el-input v-model="searchForm.hazard" placeholder="请输入危险源名称" :clearable="true"></el-input>
						</el-form-item>
						<el-form-item label class="yl-col6">
							<el-button type="primary" size="small" @click="getList">查询</el-button>
						</el-form-item>
					</el-form>

					<!-- <div style="margin: 0 10px 15px 0">
            <span class="span-label">类型</span>
            <el-select v-model="searchForm.hazardType" clearable placeholder="请选择" @clear="clear">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </div>-->

					<!-- <div style="margin: 0 10px 15px 0">
            <span class="span-label">分类</span>
            <SacTreeSelect
              :options="treeData"
              :props="treeProps"
              :clearable="true"
              @input="checkNode"
            ></SacTreeSelect>
          </div>-->
					<!-- <div style="margin: 0 10px 15px 0">
            <span class="span-label">危险源名称</span>
            <el-input v-model="searchForm.hazard" placeholder="请输入危险源名称" :clearable="true"></el-input>
          </div>
          <div style="margin: 0 10px 15px 0">
            <el-button type="primary" size="small" @click="getList">查询</el-button>
          </div>-->
				</div>
				<!-- <div id="org-tree-table">
          <div class="right"> -->
				<iTable style="height: calc(100% - 40px);" :table-data="dataList" :columns="columns" :loading="loading" :pagination="pagination" @handleTableChange="handleTableChange" @rowClick="rowClick" ref="iTable"></iTable>
				<!-- </div>
        </div> -->
			</div>
		</el-dialog>
		<!-- <choseDialog
      :visible="choseDialogVisible"
      :mode="mode"
      :tableComponent="tableComponent"
      @handleDialogSave="handleChoseDialogSave"
      @handleDialogClose="handleChoseDialogClose"
    ></choseDialog>-->
	</div>
</template>

<script>
// import choseDialog from "@/components/choseDialog/index.vue";
import iTable from "@/components/cpComponents/sac-tree-table/iTable.vue";
import * as majorHttp from "@/api/cpApi/processManage/risk/major";
import SacTreeSelect from "@/components/cpComponents/sac-tree-select/SacTreeSelect.vue";
import * as codeHttp from "@/api/cpApi/code";
import * as classificationHttp from "@/api/cpApi/processManage/risk/classification";
import { code } from "@/utils/cpUtils/constant";

export default {
	name: "choseInput",
	props: ["setvalue", "readonly", "clearable", "isView"],
	components: {
		iTable,
		SacTreeSelect
	},
	data () {
		return {
			choseDialogVisible: false,
			loading: false,
			options: [],
			treeData: [],
			searchForm: {
			},
			value: "",
			treeProps: {
				label: "hazardCategory",
				children: "children",
				id: "hazardCategoryId",
				value: "hazardCategoryId"
			},
			columns: [
				{
					prop: "typeDesc",
					label: "类型"
				},
				{
					prop: "hazardCategory",
					label: "危险源分类"
				},
				{
					prop: "hazard",
					label: "危险源"
				},
				{
					prop: "accidentCause",
					label: "事故诱因"
				},
				{
					prop: "consequence",
					label: "可能导致的后果"
				}
			],
			dataList: [],
			pagination: {
				current: 1,
				size: 20,
				total: 0
			}
		};
	},
	mounted () {
		codeHttp.getIbpsCode(code.wxyfl).then(res => {
			res.data.map(item => {
				this.options.push({
					label: item.name,
					value: item.key
				});
			});
		});
		classificationHttp.tree().then(res => {
			if (res.data) {
				this.treeData = res.data.children;
			}
		});
	},
	computed: {},
	watch: {
		choseDialogVisible (newval) {
			if (newval) {
				this.getList();
				this.$nextTick(() => {
					console.log(222);
					if (this.setvalue) {
						console.log(this.setvalue);
						this.value = this.setvalue;
					}
				});
			}
		}
	},
	created () {
		this.$nextTick(() => {
			this.getList(true);
		});
	},
	methods: {
		handleIconClick () {
			this.choseDialogVisible = true;
		},
		reset () {
			delete this.searchForm.hazardCategoryId;
			this.searchForm = {
			};
			this.$forceUpdate();
		},
		clear () {
			delete this.searchForm.type;
		},
		input (val) {
			console.log(val);
			this.$emit("handleInput", val);
		},
		//下一页的的回调
		handleTableChange (pagination) {
			this.pagination.current = pagination.current;
			this.pagination.size = pagination.size;
			this.getList();
		},
		//加载数据
		getList (init) {
			this.loading = true;
			console.log(this.pagination.current ? this.pagination.current : 1, "current", this.pagination.current,);
			this.searchForm.pageNo = this.pagination.current ? this.pagination.current : 1;
			this.searchForm.limit = this.pagination.size ? this.pagination.size : 20;
			majorHttp.list(this.searchForm).then(res => {
				this.dataList = res.data.records;
				this.pagination = {
					current: 1,
					size: 20,
					total: 0
				};
				if (this.dataList && this.dataList.length > 0) {
					this.pagination = {
						current: res.data.current,
						size: res.data.size,
						total: res.data.total
					}
				}
				console.log(this.pagination, "	this.pagination ");

				this.loading = false;
				if (init) {
					this.value = this.setvalue;
				}
			});
		},
		handleChoseDialogClose (row) {
			this.choseDialogVisible = false;
		},
		rowClick (data) {
			console.log(data);
			this.value = data.hazard;
			this.$emit("edit", data);
			this.handleChoseDialogClose();
		},
		checkNode (data) {
			if (data) {
				this.searchForm.hazardCategoryId = data.hazardCategoryId;
			} else {
				delete this.searchForm.hazardCategoryId;
			}
		}
	}
};
</script>

<style lang="scss">
.el-input__icon {
	cursor: pointer;
}

#selectInput {
	.el-input-group__append {
		padding: 0;
		background: transparent;
		border: none;
		i {
			font-size: 22px;
		}
	}
}

#org-tree-table {
	height: auto;
	.right {
		height: auto;
	}
}
</style>
