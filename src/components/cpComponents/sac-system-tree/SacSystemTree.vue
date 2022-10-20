<template>
  <div class="container">
    <el-input
      v-if="filterable"
      class="filter-box"
      placeholder="请输入过滤内容"
      v-model="search"
      :size="size"
    />
    <el-tree
      class="tree"
      ref="tree"
      :data="data"
      :props="props"
      :node-key="props.id"
      :expand-on-click-node="false"
      :default-expand-all="defaultExpandAll"
      :filter-node-method="filter"
      :highlight-current="highlightCurrent"
      @node-click="handleTreeNodeClick"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { debounceTime, pluck } from 'rxjs/operators';

import { findNode } from '@/libs/util.tree';

/**
 * 系统模块通用树组件
 *
 * @author 管超
 */
@Component
class SacSystemTree extends Vue {
  /** 数据 */
  @Prop({
    type: Array,
    default: () => ([])
  })
  data;

  /** 树节点配置选项 */
  @Prop({
    type: Object,
    default: () => ({ label: 'label', id: 'id', children: 'children' })
  })
  props;

  /** 可过滤 */
  @Prop({
    type: Boolean,
    default: false
  })
  filterable;

  /** 尺寸 */
  @Prop({
    type: String,
    default: 'small'
  })
  size;

  /** 默认展开所有节点 */
  @Prop({
    type: Boolean,
    default: false
  })
  defaultExpandAll;

  /** 高亮当前 */
  @Prop({
    type: Boolean,
    default: true
  })
  highlightCurrent;

  /** 初始选中的节点 key */
  @Prop({
    type: [Number, String],
    default: null
  })
  selectedKey;

  /** 搜索值 */
  search = '';

  /** 之前选中的节点 */
  previousCheckedNode = null;

  /** 当前选中的节点 key */
  currentKey = null;

  created() {
    // this.$watchAsObservable('search')
    //   .pipe(
    //     // 等待 250 毫秒
    //     debounceTime(250),
    //     // 取出新值
    //     pluck('newValue')
    //   )
    //   .subscribe(value => { this.handleFilterBoxChange(value); });
  }

  mounted() {
    this.watchSelectedKey();
  }

  @Watch('selectedKey')
  watchSelectedKey() {
    if (this.selectedKey) {
      this.currentKey = this.selectedKey;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.currentKey);
      });
    }
  }
	@Watch("search", { deep: true })
	watchSearch () {
		this.handleFilterBoxChange(this.search);
	}
  @Watch('data', { deep: true })
  watchData() {
    // 只要数据发生变化，就会触发 `node-click` 事件，告诉外界当前选中的值（即使是在初始化的情况下）
    if (this.currentKey === null) {
      // console.log(1);
      this.$emit('node-click', null);
    } else {
      // 查找最新的数据中是否存在之前选中的节点
      const currentNode = findNode(this.data, (item) => item[this.props.id] === this.currentKey, this.props.children);
      if (currentNode) {
        // console.log(2);
        // this.$emit('node-click', currentNode);
        // 重新高亮之前选中的节点
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(currentNode[this.props.key]);
        });
      } else {
        // console.log(3);
        this.currentKey = null;
        this.$emit('node-click', null);
      }
    }
  }

  /**
   * 处理过滤输入框值变更
   */
  handleFilterBoxChange(search) {
    this.$refs.tree.filter(search);
  }

  /**
   * 处理树节点点击
   */
  handleTreeNodeClick(node) {
    if (this.previousCheckedNode && this.previousCheckedNode[this.props.id] === node[this.props.id]) {
      // 同样的节点点击了两次
      this.currentKey = null;
      this.previousCheckedNode = null;
      this.$refs.tree.setCurrentKey(null);
    } else {
      this.currentKey = node[this.props.id];
      this.previousCheckedNode = node;
    }
    this.$emit('node-click', this.previousCheckedNode);
  }

  /**
   * 树节点过滤
   */
  filter(value, data) {
    if (!value) {
      return true;
    }
    const { label } = this.props;
    return data[label].toUpperCase().indexOf(value.toUpperCase()) !== -1;
  }
}

export default SacSystemTree;
</script>

<style lang="scss" scoped>
.container {
  padding: 4px;

  .filter-box {
    margin-bottom: 20px;
  }
}
</style>
