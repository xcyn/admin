<template>
  <!-- 选择所有人 -->
  <div class="chooseAllOrg">
    <el-select v-model="selected" :disabled="disable" filterable placeholder="请选择" :filter-method="searchPeople" :multiple-limit="multiples" clearable multiple>
      <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id">
        <span>
          <!-- {{ item.orgAlias + ":" + item.name }} -->
          {{ item.name }}
        </span>
      </el-option>
    </el-select>
  </div>

</template>
<script>
import * as ibps from '@/api/cpApi/ibps/index'
export default {
  components: {
  },
  props: {
    multiples: {
      type: Number,
      default: 1
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataList: [],
      options: [],
      selected: [],
      selectedStrs: '',
      queryData: true
    }
  },

  watch: {
    selected (val) {
      this.judgeList()
    }
  },
  created () {
    this.iniList()
  },
  methods: {
    // 循环调用自己，直到人员有值
    judgeList () {
      if (this.dataList && this.dataList.length > 0) {
        this.changeData()
      } else {
        setTimeout(() => {
          this.judgeList()
        }, 100)
      }
    },
    changeData () {
      const peoples = this.getChoosed()
      this.getChoosedAndSearch(peoples)
      this.$emit('changeData', peoples)
    },

    async iniList () {
      // 如果还没获取到list
      if (!this.queryData) {
        return false
      }
      this.queryData = false

      const res = await ibps.orgFindAll()
      const data = res.data && res.data.length > 0 ? res.data : []
      this.$set(this, 'dataList', data)
      // this.$set(this, "options", data && data.length > 10 ? data.slice(0, 10) : data)
      this.$set(this, 'options', data)
    },

    // 设置人data为逗号拼接的str
    async setVal (data) {
      this.selected = data
    },

    // 得到已选择的人员集合
    getChoosed () {
      const peoples = []
      if (this.selected && this.selected.length > 0) {
        this.selected.forEach(itemV => {
          const data = this.dataList.find((item) => {
            return item.id == itemV
          })
          if (data) {
            peoples.push(data)
          }
        })
      }
      return peoples
    },
    // 将已选择的和搜索过滤出来的拼接
    getChoosedAndSearch (peoples) {
      if (this.options && this.options.length > 0) {
        if (peoples && peoples.length > 0) {
          this.$set(this, 'options', Array.from(new Set([...peoples, ...this.options])))
        }
      } else {
        this.$set(this, 'options', peoples)
      }
    },
    // 过滤查询
    searchPeople (val) {
      this.options = []
      if (!val) {
        // this.options = this.$set(this, "options", this.dataList.length > 10 ? this.dataList.slice(0, 10) : this.dataList)
      } else {
        if (this.dataList && this.dataList.length > 0) {
          // 先根据编号查找
          this.options = this.dataList.filter(item => item.orgAlias.indexOf(val) >= 0)
          // 无返回值再根据名字查找
          if (!this.options || this.options.length == 0) {
            this.options = this.dataList.filter(item => item.name.indexOf(val) >= 0)
          }
          // 只采用前十个
          this.options = this.options.length > 10 ? this.options.slice(0, 10) : this.options
          if (!this.options || this.options.length == 0) {
            this.options = this.$set(this, 'options', this.peopleData.length > 10 ? this.peopleData.slice(0, 10) : this.peopleData)
          }
        }
      }
      // 最后再把已选择的给带上
      this.getChoosedAndSearch(this.getChoosed())
    }
  }
}
</script>
<style scoped lang="scss">
.chooseAllOrg {
  /* 子菜单界面通用布局 */
  /* height: calc(100vh-); */
  width: 100%;
  height: 100%;
}
::v-deep .el-input__prefix {
  left: calc(100% - 50px);
  font-size: 16px;
  cursor: pointer;
  z-index: 100;
  width: 25px;
}
::v-deep .el-select__tags {
  overflow-y: auto;
  height: 30px;
}
::v-deep .vxe-button--dropdown {
  display: none;
}
</style>
