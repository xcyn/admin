<template>
	<!--三种人-->
	<el-model title="请选择" :show-btn="false" :submit-btn-hide="false" v-if="showThree" :visible="true" class="datav_model" width="1200px">
		<section class="full">
			<div class="head">
				<el-form :inline="true" :model="params" class="demo-form-inline">
					<el-form-item label="工号">
						<el-input v-model="params.userNum" placeholder="请输入工号" />
					</el-form-item>

					<el-form-item label="姓名">
						<el-input v-model="params.userName" placeholder="请输入姓名" />
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="onSubmit">查询</el-button>
					</el-form-item>
				</el-form>
			</div>

			<div style="display: flex;flex-direction: column;" class="full">
				<div style="flex:1;overflow: auto;" class="main">
					<el-table class="sys-table" style="width: 100%;text-align: center;max-height: calc(70vh - 200px);overflow-y: auto;" border :data="userList" @current-change="selectBackForm" highlight-current-row>
						<el-table-column prop="userNum" label="工号" min-width="120" />

						<el-table-column prop="userName" label="姓名" show-overflow-tooltip min-width="120" />

						<el-table-column prop="companyId" label="部门/班组" show-overflow-tooltip min-width="120">
							<template slot-scope="{row}">
								<div slot="reference">
									<span>{{ row.companyId && row.companyId.split(".")[1] }}</span>
								</div>
							</template>
						</el-table-column>

						<el-table-column prop="userMobile" label="联系电话" show-overflow-tooltip min-width="120" />

						<el-table-column label="三种人" show-overflow-tooltip min-width="260">
							<template slot-scope="{row}">
								<div slot="reference">
									<el-col :span="8" v-if="row.isManager === '1'">
										<el-checkbox v-model="row.isManager" true-label="1" false-label="2" disabled>负责人</el-checkbox>
									</el-col>
									<el-col :span="8" v-if="row.isIssuer === '1'">
										<el-checkbox v-model="row.isIssuer" true-label="1" false-label="2" disabled>签发人</el-checkbox>
									</el-col>
									<el-col :span="8" v-if="row.isPermitor === '1'">
										<el-checkbox v-model="row.isPermitor" true-label="1" false-label="2" disabled>许可人</el-checkbox>
									</el-col>
								</div>
							</template>
						</el-table-column>

						<el-table-column label="公司" show-overflow-tooltip min-width="120">
							<template slot-scope="{row}">
								<div slot="reference">
									<span>{{ row.companyId && row.companyId.split(".")[0] }}</span>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<div style="height:60px;" class="fenye">
					<el-pagination :total="params.total" :current-page="params.current" :page-size="params.size" :page-sizes="[10, 15, 20, 50]" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
				</div>

				<div class="buttonGroup">
					<el-button class="ann" type="primary" @click.stop="submitModal" size="mini">确 定</el-button>
					<el-button class="ann" type="default" @click.stop="cancelModal" size="mini">取 消</el-button>
				</div>

			</div>
		</section>
	</el-model>
</template>

<script>
import * as wtPersonRoleAPI from "@/api/cpApi/twoTickets/wtPersonRole/index.js"

export default {
	props: {
		isPermitor: { type: Boolean },
		isIssuer  : { type: Boolean },
		isManager : { type: Boolean },
	},

	data(){
		return {
			showThree: false,// 是否展开
			userNow  : {},// 当前选择的人

			params: {
				userNum   : "",
				userName  : "",
				isOn      : 1,
				isPermitor: null,
				isIssuer  : null,
				isManager : null,
				current   : 1,
				total     : 0,
				size      : 10,
			},

			// -------------------表单数据---------------
			userList: [],
		}
	},

	methods: {
		/**
		 * 初始化打开
		 * @author mbb
		 */
		async init(){
			this.showThree = true

			if(this.isPermitor){
				this.params.isPermitor = 1
			}

			if(this.isIssuer){
				this.params.isIssuer = 1
			}

			if(this.isManager){
				this.params.isManager = 1
			}

			await this.getList()
		},

		/**
		 * 全查三种人
		 * @author mbb
		 */
		async getList(){
			let response      = await wtPersonRoleAPI.page(this.params)
			this.params.total = response?.data?.total
			this.userList     = response?.data?.records
		},

		/**
		 * 提交查询
		 * @author mbb
		 */
		async onSubmit(){
			this.params.current = 1
			await this.getList()
		},

		/**
		 * 当前页改变
		 * @author mbb
		 */
		handleCurrentChange(current){
			this.params.current = current
			this.getList()
		},

		/**
		 * 每页数量改变
		 * @author mbb
		 */
		handleSizeChange(size){
			this.params.size = size
			this.getList()
		},

		/**
		 * 选择用户
		 * @author mbb
		 */
		selectBackForm(user){
			this.userNow = user
		},

		/**
		 * 弹窗:确定
		 * @author mbb
		 */
		submitModal(){
			this.$emit("do-ok", this.userNow)
			this.showThree = false
		},

		/**
		 * 弹窗:取消
		 * @author mbb
		 */
		cancelModal(){
			this.$emit("do-cancel")
			this.showThree = false
		},

	},

}
</script>

<style scoped>
.fenye {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	background: white;
}

.head {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	background: white;
}

.buttonGroup {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin: 20px 0;
}
</style>
