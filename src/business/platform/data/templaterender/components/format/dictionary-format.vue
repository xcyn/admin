<template>
  <span class="ibps-dictionary">
    <template
      v-for="(item) in items"
    >
      <display-effect
        v-if="$utils.isNotEmpty(item[valueKey])"
        :key="item[valueKey]"
        :data="item"
        :label-key="labelKey"
        :value-key="valueKey"
        :shape="displayEffectShape"
        :effect="displayEffectEffect"
        :config="displayEffectDataMap"
        readonly
      />
    </template>
  </span>
</template>

<script>
import DictUtil from './utils/util.dicts'
import DisplayEffect from '@/components/ibps-tree-select/display-effect'
// value格式化展示组件
export default {
  name: 'DictionaryFormat',
  components: {
    DisplayEffect
  },
  props: {
    // 值
    value: {
      type: String
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // value的分隔符<br/>
    // 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
    // 传入空字符串，表示不分割<br/>
    separator: {
      type: String,
      default: ','
    },
    dataKey: {
      type: String,
      default: 'typeKey'
    },
    // 数据字典<br/>
    // {type:'xxx',data:[],value:'',label:'',children:''}
    dict: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dictDataMap: {}
    }
  },
  computed: {
    items() {
      if (this.value == null || this.value === '') {
        return []
      }
      const dictDataMap = this.dictDataMap
      let valueArr = []
      const options = []
      if (typeof (this.value) === 'string' && this.multiple && this.separator != null && this.separator !== '') {
        valueArr = this.value.split(this.separator)
      } else if (this.value instanceof Array) {
        // 本来就是数组的
        valueArr = this.value
      } else {
        valueArr = [this.value]
      }

      // 没有字典，直接显示值
      if (dictDataMap === null || dictDataMap === undefined || Object.keys(dictDataMap).length === 0) {
        for (const str of valueArr) {
          options.push(this.getOption(str))
        }
        return options
      }
      // 根据字典展示
      for (const str of valueArr) {
        const item = this.dictDataMap[str]
        if (item != null) {
          options.push(item)
        } else {
          options.push(this.getOption(str))
        }
      }
      return options
    },
    valueKey() {
      return this.dict.valueKey || 'key'
    },
    labelKey() {
      return this.dict.labelKey || 'name'
    },
    displayEffect() {
      return this.dict.displayEffect || {}
    },
    displayEffectType() {
      return this.$utils.isNotEmpty(this.displayEffect) ? 'effect' : 'default'
    },
    displayEffectShape() {
      return this.displayEffectType === 'default' ? 'tag' : this.displayEffect.shape || 'tag'
    },
    displayEffectEffect() {
      return this.displayEffectType === 'default' ? 'light' : this.displayEffect.effect || 'light'
    },
    displayEffectData() {
      return this.displayEffectType === 'default' ? [] : this.displayEffect.data || []
    },
    displayEffectDataMap() {
      const map = {}
      if (this.displayEffectType === 'default') {
        return map
      } else {
        this.displayEffectData.forEach((data) => {
          map[data[this.dataKey]] = data
        })
        return map
      }
    }

  },
  watch: {
    dict: {
      handler(val, oldVal) {
        if (val === oldVal) {
          return
        }
        DictUtil.mergeDefault(this.dict || {})
        DictUtil.get(this.dict).then((data) => {
          let dataMap = this.dict.dataMap
          if (dataMap == null && data != null && data.length > 0) {
            dataMap = {}
            this.putAll(dataMap, data, this.dict.isTree)
            this.$set(this.dict, 'dataMap', dataMap)
          }
          this.$set(this, 'dictDataMap', dataMap)
        })
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.dictDataMap = null
  },
  methods: {
    getOption(str) {
      return {
        [this.valueKey]: str,
        [this.labelKey]: str
      }
    },
    putAll(map, list, isTree) {
      const valueName = this.dict.valueKey
      const childrenName = this.dict.childrenKey
      for (const item of list) {
        map[item[valueName]] = item
        if (isTree && item[childrenName] != null) {
          this.putAll(map, item[childrenName], isTree)
        }
      }
    }
  }
}
</script>
