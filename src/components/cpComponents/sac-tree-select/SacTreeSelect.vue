<template>
  <el-select
    class="select"
    ref="select"
    v-model="tags"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :placeholder="placeholder"
    :size="size"
    @clear="clear"
    @remove-tag="handleSelectRemoveTag"
  >
    <el-option value="">
      <el-tree
        class="tree"
        :accordion="accordion"
        :check-strictly="checkStrictly"
        :data="options"
        :default-expand-all="defaultExpandAll"
        :expand-on-click-node="false"
        :node-key="nodeKey"
        :props="props"
        :show-checkbox="multiple"
        @node-click="data => { this.handleTreeNodeClick(data) }"
        @check="(data, checked) => { this.handleTreeNodeCheck(data, checked) }"
      />
    </el-option>
  </el-select>
</template>

<script>
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

/**
 * 树形选择器
 *
 * @author 管超
 */
@Component
class SacTreeSelect extends Vue {
  @Prop({
    type: String | Array,
    default: ''
  })
  value;

  /** 选项（树形结构） */
  @Prop({
    type: Array,
    default: () => ([])
  })
  options;

  /** 节点唯一性标识符 */
  @Prop({
    type: String,
    default: 'id'
  })
  nodeKey;

  /** 节点属性 */
  @Prop({
    type: Object,
    default: () => ({ label: 'label', value: 'value', children: 'children' })
  })
  props;

  /** 禁用 */
  @Prop({
    type: Boolean,
    default: false
  })
  disabled;

  /** placeholder */
  @Prop({
    type: String,
    default: '请选择'
  })
  placeholder;

  /** 尺寸 */
  @Prop({
    type: String,
    default: 'medium'
  })
  size;

  /** 树节点是否展开 */
  @Prop({
    type: Boolean,
    default: false
  })
  defaultExpandAll;

  /** 多选 */
  @Prop({
    type: Boolean,
    default: false
  })
  multiple;

  /** 可折叠 */
  @Prop({
    type: Boolean,
    default: false
  })
  accordion;

  /** 严格选中 */
  @Prop({
    type: Boolean,
    default: false
  })
  checkStrictly;

  /** 是否可清除选中 */
  @Prop({
    type: Boolean,
    default: false
  })
  clearable;

  @Prop({
    type: String,
    default: null
  })
  tags;

  checkedNodes = [];

  mounted() {
    this.watchValue();
  }

  @Watch('value')
  watchValue() {
    if (this.value && typeof this.value === 'string') {
      this.tags = this.findLabel(this.options, this.value);
    } else if (this.value instanceof Array) {
      this.tags = this.value.map(v => this.findLabel(this.options, v));
    } else {
      this.tags = this.value;
    }
  }

  @Watch("tags")
  watchTag(val) {
    this.$emit("getData", val);
  }

  /**
   * 处理树节点点击
   */
  handleTreeNodeClick(data) {
    if (!this.multiple) {
      this.$refs.select.blur();
      this.tags = data[this.props.label];
      this.$emit('input', data);
    }
  }

  /**
   * 处理树节点复选
   */
  handleTreeNodeCheck(data, checked) {
    const { checkedNodes } = checked;
    const { label, value } = this.props;
    this.checkedNodes = [...checkedNodes];
    this.tags = checkedNodes.map(n => n[label]);
    this.$emit('input', checkedNodes.map(n => n[value]));
  }

  /**
   * 处理下拉选择中标签的清除按钮
   */
  handleSelectRemoveTag(tag) {
    const { label, value } = this.props;
    this.checkedNodes = this.checkedNodes.filter(n => n[label] !== tag);
    this.$emit('input', this.checkedNodes.map(n => n[value]));
  }

  /**
   * 清除所有选中
   */
  clear() {
    if (!this.multiple) {
      this.$emit('input', null);
      this.tags = null;
    } else {
      this.tags = [];
      this.$emit('input', []);
    }
  }

  /**
   * 根据 value 找出对应的 label
   */
  findLabel(options, value) {
    let queue = [];
    let label = null;

    queue = queue.concat(options);
    while (queue.length) {
      const item = queue.shift();
      if (item[this.props.children]) {
        queue = queue.concat(item[this.props.children]);
      }
      if (item[this.props.value] === value) {
        label = item[this.props.label];
        break;
      }
    }

    return label;
  }
}

export default SacTreeSelect;
</script>

<style lang="scss" scoped>
.el-select-dropdown__item {
  height: auto;
  padding: 0;

  &.selected {
    font-weight: normal;
  }

  &::v-deep .el-tree-node__content {
    height: 34px;
  }
}
</style>
