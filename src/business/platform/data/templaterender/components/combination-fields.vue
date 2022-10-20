<template>
  <label>{{ combination }}</label>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      combination: ''
    }
  },
  watch: {
    config: {
      handler: function(val, oldVal) {
        this.filterCombinationFields(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    buildJointFileds(dataTitle) {
      const d = dataTitle.split(/(\$[0-9a-zA-Z._|]+#[0-9A-Fa-f]*)/g)
      const rtn = []
      d.forEach((n) => {
        let a = n
        if (/^\$(_widget_)/.test(n)) {
          // 对字段进行处理
          const f = n.replace('$_widget_', '').split('#')
          a = f[0]
        }
        rtn.push(a)
      })
      return rtn
    },
    filterCombinationFields(val) {
      const fileds = val.fileds
      if (this.$utils.isEmpty(fileds)) {
        this.combination = ''
        return
      }
      const columnData = JSON.parse(JSON.stringify(this.data))

      const joinsDatas = []
      fileds.forEach((j) => {
        if (columnData[j] && this.$utils.isEmpty(columnData[j])) {
          columnData[j] = '暂无数据'
        }
        const str = columnData[j] ? columnData[j] : j
        joinsDatas.push(str)
      })
      this.combination = joinsDatas.join('')
    }
  }
}
</script>
