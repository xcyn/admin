<template>
	<!-- 选择所有人 -->
	<el-select :disabled="disable" v-model="selected" filterable placeholder="请选择" :filter-method="searchPeople" :multiple-limit="multiples" clearable multiple>
		<slot slot="prefix" v-if="!disable"><i class="el-icon-edit-outline" @click.stop="openDialog"></i>

			<user-dialog-sel ref="userDialogTable" :multipleSelect="multiples>1" :father-method="setPeoples" :selectedStrs="selectedStrs" />
		</slot>
		<el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id">
			<span>{{ item.account + ":" + item.name }} </span>
		</el-option>
	</el-select>

</template>
<script>
import userDialogSel from '@/components/cpComponents/cp-dialog-select/userDialogSel.vue'
export default {
	components: {
		userDialogSel,
	},
	props: {
		peopleData: {
			type: Array,
			default: () => {
				return []
			},
		},
		multiples: {
			type: Number,
			default: 1,
		},
		disable: {
			type: Boolean,
			default: false,
		},
	},
	data () {
		return {
			options: [],
			selected: [],
			selectedStrs: "",
		}
	},

	watch: {
		peopleData: {
			immediate: true,
			deep: true,
			handler: function (val) {
				this.$set(this, "options", val && val.length > 10 ? val.slice(0, 10) : val)
				//最后再把已选择的给带上
				this.getChoosedAndSearch(this.getChoosed())
			},
		},
		selected (val) {
			//返回的是集合，默认是单选。
			this.getSelectedStrs();
			let peoples = this.getChoosed()
			this.$emit("changePeople", peoples)
		},
	},



	methods: {
		//弹出框方法开始
		setPeoples (data) {
			this.setVal(data.ids ? data.ids.split(',') : []);
		},
		getSelectedStrs () {
			this.selectedStrs = "";
			let selectedList = [];
			if (this.selected && this.selected.length > 0 && this.peopleData && this.peopleData.length > 0) {
				selectedList = this.peopleData.filter((itemP) => {
					let flag = false;
					this.selected.forEach(itemS => {
						if (itemS == itemP.id) {
							flag = true
						}
					});
					if (flag) {
						return itemP;
					}
				})
				if (selectedList && selectedList.length > 0) {
					selectedList.forEach((item, index) => {
						this.selectedStrs += (item.id + "|" + item.name)
						if (index < selectedList.length - 1) {
							this.selectedStrs += ","
						}
					})
				}
			}

		},
		openDialog () {
			this.$nextTick(() => {
				this.$refs.userDialogTable.init()
			})
		},
		//弹出框方法结束


		//设置人
		setVal (data) {
			this.selected = data
			//最后再把已选择的给带上
			this.getChoosedAndSearch(this.getChoosed())
		},
		//过滤查询
		searchPeople (val) {
			this.options = []
			if (!val) {
				this.options = this.$set(this, "options", this.peopleData.length > 10 ? this.peopleData.slice(0, 10) : this.peopleData)
			} else {
				if (this.peopleData && this.peopleData.length > 0) {
					//先根据编号查找
					this.options = this.peopleData.filter(item => item.account.indexOf(val) >= 0);
					//无返回值再根据名字查找
					if (!this.options || this.options.length == 0) {
						this.options = this.peopleData.filter(item => item.name.indexOf(val) >= 0)
					}
					//只采用前十个
					this.options = this.options.length > 10 ? this.options.slice(0, 10) : this.options

				}
			}
			//最后再把已选择的给带上
			this.getChoosedAndSearch(this.getChoosed())
		},
		//得到已选择的人员集合
		getChoosed () {
			let peoples = []
			if (this.selected && this.selected.length > 0) {
				this.selected.forEach(itemV => {
					let data = this.peopleData.find(item => item.id == itemV)
					if (data) {
						peoples.push(data)
					}
				})
			}
			return peoples
		},
		//将已选择的和搜索过滤出来的拼接
		getChoosedAndSearch (peoples) {
			if (this.options && this.options.length > 0) {
				if (peoples && peoples.length > 0) {
					this.options = Array.from(new Set([...peoples, ...this.options]))
				}
			} else {
				this.options = peoples
			}
		},
	},
}
</script>
<style scoped lang="scss">
.chooseAll {
	/* 子菜单界面通用布局 */
	/* height: calc(100vh-); */
	width: 100%;
	height: 100%;
}
::v-deep .el-input__prefix {
	right: 18px !important;
	font-size: 16px;
}
::v-deep .el-select__tags {
	overflow-y: auto;
	height: 30px;
}
::v-deep .vxe-button--dropdown {
	display: none;
}
</style>
