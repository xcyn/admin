<template>
	<div class="projectDialog">
		<el-dialog title="检修/外委项目" :visible.sync="dialogVisible">
      <el-row style="padding-left:20px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="检修项目" name="standardItems">
            <standardItems ref="standardItems"></standardItems>
          </el-tab-pane>
          <el-tab-pane label="外委项目" name="outProject">
            <outProject ref="outProject"></outProject>
          </el-tab-pane>
        </el-tabs>
      </el-row>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="getRow">确 定</el-button>
				<el-button @click="init(false)">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import standardItems from '@/components/cpComponents/projectdialog/standardItems'
import outProject from '@/components/cpComponents/projectdialog/outProject'
export default {
	components: {
    standardItems,
    outProject
	},

	data () {
		return {
      activeName:"standardItems",
			dialogVisible: false,
			currentRow: {
        projectType:"",
        projectId:"",
        projectName:""
      },
		};
	},
	watch: {},
	created () {

	},
	methods: {
		init (val) {
			this.dialogVisible = val;

		},
		getRow () {
		  if (this.activeName === 'standardItems'){
        let choosed  = this.$refs.standardItems.choosed
        this.currentRow.projectId = choosed.id
        this.currentRow.projectName = choosed.name
        this.currentRow.projectType = 1
      }else {
        let choosed  =  this.$refs.outProject.choosed
        this.currentRow.projectId = choosed.proId
        this.currentRow.projectName = choosed.proName
        this.currentRow.projectType = 2
      }
			this.$emit("selectedRow", this.currentRow)
      this.dialogVisible = false
		},
	}
};
</script>
<style lang="scss" scoped>
.projectDialog {
	width: 100%;
	height: 100%;
	::v-deep .el-dialog__wrapper {
		width: 80vw;
		left: 10vw;
	}
	::v-deep .el-dialog {
		width: 80vw !important;
	}
  ::v-deep .el-tabs__content{
    height: 100%;
    padding: 0px;
    .modelTable .mainModelTable{
      height: 100%;
      width: 100%;
      margin:0px !important;
    }
  }

}
</style>
