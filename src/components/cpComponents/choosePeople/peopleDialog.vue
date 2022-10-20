 <template>
	<!-- 若使用于新项目，请将此项目的全局样式移入并注册到新项目中，样式位于 src\assets\style\common.scss -->
	<el-dialog title="人员选择">
		<div class="peopleDialog">
			<el-row class="mainTable" :gutter="10">
				<el-col style="width:17%" class="fullH" v-if="showTree">
					<treeBar ref="treeBar" @changeTree="showLeftTree(false)" @handleNodeClick="changTree"></treeBar>
				</el-col>
				<el-col style="width:40px;height:40px;background:#fff;text-align: center;" v-else>
					<i class="el-icon-d-arrow-right iconStyle" @click="showLeftTree(true)"></i>
				</el-col>
				<el-col :style="{'width':showTree?'83%':'calc(100% - 40px)'}" class="fullH ">
					<el-row class="body fullH">
						<el-row class="head">
							<el-form :model="searchObj" ref="searchObj" :inline="true" label-width="80px">
								<el-row style="height: 45px;" class="overWidth">
									<el-form-item label="活动区域：" prop="region">
										<el-select v-model="searchObj.region" placeholder="请选择活动区域" filterable clearable>
											<el-option v-for="(item,index) in optionS" :key="index" :label="item.name" :value="item.id" />
										</el-select>
									</el-form-item>

									<el-form-item label="活动名称：" prop="name">
										<el-input v-model="searchObj.name" placeholder="请输入活动名称" clearable></el-input>
									</el-form-item>
									<el-form-item>
										<el-button type="primary" @click="initTable(1)" icon="el-icon-search" style="margin-left:15px;">查询</el-button>
										<el-button @click="resetForm" icon="el-icon-refresh">重置</el-button>
										<el-image @click="showMore" style="width: 23px;height: 24px;vertical-align: middle;margin-left: 15px;" :src="imageUrl" fit="fit"></el-image>
									</el-form-item>
								</el-row>
								<el-row style="height: 45px;" class="overWidth" v-show="false" name="moreSearch">
									<el-form-item prop="dateTime">
										<span slot="label"><span style="letter-spacing: 8px;">时 间</span>：</span>
										<el-date-picker class="timeStyle" value-format="yyyy-MM-dd" v-model="searchObj.dateTime" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
										</el-date-picker>
									</el-form-item>
									<el-form-item label="赞助商：" prop="user">
										<el-input v-model="searchObj.user" placeholder="请输入赞助商" clearable></el-input>
									</el-form-item>
								</el-row>
							</el-form>
						</el-row>
						<el-row class="operationButtons">
							<el-button type="text" style="font-size:14px">新增</el-button>
							<el-button type="text" style="font-size:14px" :disabled="idList.length!=1">修改</el-button>
							<el-button type="text" style="font-size:14px" :disabled="idList.length==0">删除</el-button>
						</el-row>
						<el-table ref="table" :height="'100%'" :data="tableData" tooltip-effect="dark" class="tableRow" :header-row-style="{ background: 'transparent', color: '#fff' }" :row-class-name="tableRowClassName" @selection-change="changeTable">
							<!-- 长度固定的列用width，需要自适应的用 min-width="100" -->
							<el-table-column type="selection" width="55">
							</el-table-column>
							<el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
							<el-table-column prop="date" label="日期" min-width="100" align="center">
							</el-table-column>
							<el-table-column prop="name" label="姓名" min-width="105" align="center">
							</el-table-column>
							<el-table-column prop="sex" label="性别" width="105" align="center">
								<!-- 自定义表列 -->
								<template slot-scope="scope">
									{{sexObj[scope.row.sex]}}
									<!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
							<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button> -->
								</template>
							</el-table-column>
							<el-table-column label="地址" show-overflow-tooltip min-width="180" align="center" prop="address">
							</el-table-column>
						</el-table>
						<el-row class="pageRow">
							<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageObj.current" :page-sizes="[10, 20, 30, 50,100]" :page-size="pageObj.size" layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total">
							</el-pagination>
						</el-row>

					</el-row>
				</el-col>
			</el-row>

		</div>
	</el-dialog>
</template>
<script>
import treeBar from './component/treeBar'
import { tableData } from "./data.js"
export default {
	components: { treeBar },
	data () {
		return {
			imageUrl: require("@/assets/images/more.png"),
			searchObj: {
				user: "",
				name: "",
				region: "",
				dateTime: [],
				treeId: "",//树形结构传的值
			},
			optionS: [
				{ id: "1", name: "选项一", },
				{ id: "2", name: "选项二", },
			],
			idList: [],//选择的行
			sexObj: {
				0: "男",
				1: "女",
			},
			tableData: [],
			pageObj: {
				current: 1,
				size: 10,
				total: 0,
			},
			showTree: true,
		};
	},
	watch: {},
	created () {

	},
	mounted () {
		this.initTable();
	},
	methods: {
		//更改树数据
		changTree (data) {
			this.searchObj.treeId = data.id;
			this.initTable(1);
		},
		//是否展示树
		showLeftTree (val) {
			this.showTree = val;
		},
		//搜索栏开始
		//展示更多搜索条件
		showMore () {
			$('div[name=moreSearch]').slideToggle()
		},
		//重置表单,此方法需要prop与属性值对应
		resetForm () {
			this.$refs.searchObj.resetFields();
		},
		//提交时间一定要转为string
		getQueryObj () {
			let timeStart = "";
			let timeEnd = "";
			if (this.searchObj.dateTime && this.searchObj.dateTime.length > 0) {
				timeStart = this.searchObj.dateTime[0];
				if (this.searchObj.dateTime.length == 2) {
					timeEnd = this.searchObj.dateTime[1];
				}
			}
			//整合参数
			let queryObj = {
				user: this.searchObj.user,
				name: this.searchObj.name,
				region: this.searchObj.region,
				timeStart,
				timeEnd,
				treeId: this.searchObj.treeId,//树形结构传的值
				current: this.pageObj.current,
				size: this.pageObj.size,
				total: this.pageObj.total,
			}
			console.log(queryObj, "queryObj");
			return queryObj;
			// 以下调用查询方法
		},
		//搜索栏结束
		//表格开始
		//数据初始化
		initTable (val) {
			//当带查询条件时或改变分页大小，传val值，使其获取第一页的值
			if (val == 1) {
				this.pageObj.current = 1;
			}
			let queryObj = this.getQueryObj();//查询入参以待使用;
			this.tableData = tableData;
			this.pageObj.total = this.tableData && this.tableData.length > 0 ? this.tableData.length : 0;
			this.tableData = this.tableData.slice((this.pageObj.current - 1) * this.pageObj.size, this.pageObj.current * this.pageObj.size);
			//正常获取到后台返回的tabledata后赋值按照如下，且应该赋分页值-----开始
			// if (this.tableData && this.tableData.length > 0) {
			// this.tableData = res.tableData
			// 	this.pageObj = {
			// 		current: res.current,
			// 		size: res.size,
			// 		total: res.total,
			// 	}
			// } else {
			//  this.tableData=[];
			// 	this.pageObj = {
			// 		current: 1,
			// 		size: 10,
			// 		total: 0,
			// 	}
			// }
			//正常获取到后台返回的tabledata后赋值按照如下，且应该赋分页值-----结束
		},
		// 表格斑马纹!
		tableRowClassName (row) {
			if (row.rowIndex % 2 == 0) {
				return "";
			} else {
				return "dark-row";
			}
		},
		//选择列赋值
		changeTable (data) {
			this.idList = [];
			if (data && data.length > 0) {
				data.forEach(item => {
					this.idList.push(item.id)
				});
			}
			console.log(this.idList, data);
		},
		//表格结束
		//分页功能开始
		handleSizeChange (size) {
			this.pageObj.size = size;
			this.initTable(1);
		},
		handleCurrentChange (current) {
			this.pageObj.current = current;
			this.initTable();
		},
		//分页功能结束

	}
};
</script>
<style lang="scss" scoped>
.peopleDialog {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.mainTable {
	width: calc(100% - 30px);
	height: calc(100% - 30px);
	margin: 15px !important;
}
.head {
	margin-top: 10px;
}
.operationButtons {
	height: 35px;
}
.body {
	display: flex;
	flex-direction: column;
	padding: 0 10px;
	background: #fff;
}
.searchRow {
}

.tableRow {
	width: 100%;
	height: 100%;
	flex: 1;
	overflow-y: auto;
}
.pageRow {
	height: 40px;
	margin-top: 10px;
}
.iconStyle {
	font-size: 20px;
	cursor: pointer;
	line-height: 40px;
}
</style>