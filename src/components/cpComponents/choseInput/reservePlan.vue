<template>
	<div id="selectInput">
		<el-input v-model="value" :clearable="clearable" readonly placeholder="请选择应急预案">
			<i class="el-icon-plus el-input__icon" slot="append" @click="handleIconClick"></i>
		</el-input>
		<el-dialog class="yj-dialog" append-to-body :visible.sync="choseDialogVisible" :before-close="handleChoseDialogClose">
			<div slot="title">
				<span>应急预案</span>
			</div>
			<div class="sac-tree-table" style="margin:10px 0px   ;">
				<div class="filter-top">
					<el-form :model="searchForm" ref="searchForm" label-width="90px" :inline="true" class="yj-search-form">
						<el-form-item label="预案类型" class="yl-col6">
							<el-select v-model="searchForm.planType" placeholder="请选择预案类型">
								<el-option v-for="(item,index) of yalxOptions" :key="index" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="预案名称" class="yl-col6">
							<el-input v-model="searchForm.name" placeholder="请输入预案名称" :clearable="true"></el-input>
						</el-form-item>
						<el-form-item label="演练类型" class="yl-col6">
							<el-select v-model="searchForm.drillType" placeholder="请选择演练类型">
								<el-option v-for="(item,index) of yllxOptions" :key="index" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label class="yl-col6">
							<el-button type="primary" size="small" @click="getList">查询</el-button>
							<el-button icon="el-icon-refresh" @click="refresh">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div id="org-tree-table">
					<div class="right">
						<iTable :table-data="dataList" :columns="columns" :loading="loading" :pagination="pagination" @handleTableChange="handleTableChange" @rowClick="rowClick" ref="iTable"></iTable>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import iTable from "@/components/cpComponents/sac-tree-table/iTable.vue";
import * as addReservePlanHttp from "@/api/cpApi/processManage/emergency/reservePlan";
import * as codeHttp from "@/api/cpApi/code";
import * as classificationHttp from "@/api/cpApi/processManage/risk/classification";
import { code } from "@/utils/cpUtils/constant";
import moment from "moment";

export default {
	name: "choseInput",
	props: ["setvalue", "readonly", "clearable"],
	components: {
		iTable
	},
	data () {
		return {
			choseDialogVisible: false,
			loading: false,
			yalxOptions: [],
			yllxOptions: [],
			yljbOptions: [],
			searchForm: {
				status: "0"
			},
			value: "",
			columns: [
				{
					prop: "name",
					label: "预案名称"
				},
				{
					prop: "companyName",
					label: "公司"
				},
				{
					prop: "drillLevel",
					label: "演练级别",
					format: (row, col, val) => {
						let newVal = val;
						this.yljbOptions.map(item => {
							if (item.value == val) {
								newVal = item.label;
								return false;
							}
						});
						return newVal;
					}
				},
				{
					prop: "drillType",
					label: "演练类型",
					format: (row, col, val) => {
						let newVal = val;
						this.yllxOptions.map(item => {
							if (item.value == val) {
								newVal = item.label;
								return false;
							}
						});
						return newVal;
					}
				},
				{
					prop: "validity",
					label: "状态",
					format: (row, col, val) => {
            //获取当前时间
            let currentTime =new Date(Date.parse(moment().format('YYYY/MM/DD'))) ;
            let customTime = val.replace("-","/");//替换字符，变成标准格式
            customTime= new Date(Date.parse(customTime));
            if(currentTime > customTime) {
              return "超期"
            }else {
              return "有效"
            }
					}
				}
			],
			dataList: [],
			pagination: {
				size: 20,
				current: 1,
				total: 0
			}
		};
	},
	mounted () {
		codeHttp.getIbpsCode(code.yalx).then(res => {
			res.data.map(item => {
				this.yalxOptions.push({
					value: item.key,
					label: item.name
				});
			});
		});

		codeHttp.getIbpsCode(code.yllx).then(res => {
			res.data.map(item => {
				this.yllxOptions.push({
					value: item.key,
					label: item.name
				});
			});
		});

		codeHttp.getIbpsCode(code.yljb).then(res => {
			res.data.map(item => {
				this.yljbOptions.push({
					value: item.key,
					label: item.name
				});
			});
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
		refresh () {
			this.searchForm = {
				planType: "",
				name: "",
				drillType: "",
				status: "0"
			};
		},
		handleIconClick () {
			this.choseDialogVisible = true;
		},
		reset () {
			delete this.searchForm.hazardCategoryId;
			this.searchForm = {
				status: "0"
			};
			this.$forceUpdate();
		},
		clear () {
			delete this.searchForm.hazardType;
		},
		//下一页的的回调
		handleTableChange (pagination) {
			this.getList(pagination);
		},
		//加载数据
		getList (init) {
			console.log(init, "init");
			this.loading = true;
			let obj = {
				planType: this.searchForm.planType,
				name: this.searchForm.name,
				drillType: this.searchForm.drillType,
				status: "0",
				current: init && init.current ? init.current : this.pagination.current,
				size: init && init.size ? init.size : this.pagination.size
			}
			addReservePlanHttp.list(obj).then(res => {
				console.log(res);
				this.dataList = res.data.records;
				this.pagination.total = res.data.total;
				this.pagination.current = res.data.current;
				this.pagination.size = res.data.size;
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
			this.value = data.name;
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

<style lang="scss" scoped>
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
::v-deep .el-table[data-v-58c4fdbd] {
	max-height: 390px !important;
}

::v-deep .el-dialog__body {
	overflow: hidden !important;
}
#org-tree-table {
	height: auto;
	.right {
		height: auto;
	}
}
</style>
