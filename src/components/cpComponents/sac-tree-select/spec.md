# sac-tree-select 开发规范

## 组件结构

el-select
  el-option
    el-tree

点击 select 默认会展开它下面所有的 option，在这里，我们只需要一个 option，它下面的子节点为 tree 组件，通过操作 tree 组件将结果反应在 select 组件之上。

## 功能分析

- clearable：是否可清除，默认 false，

## el-select 组件分析

`v-model/value` 值必须提供，在这里，本质上并没有操纵 select 组件，所以使用 `value` 来反映 tree 组件选择的值。
