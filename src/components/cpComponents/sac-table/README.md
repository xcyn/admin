# sac-table

**WARNING**: NOT READY FOR PUBLIC USE.

## Mixin

### base

### handleRow

- 属性
  - `rowHandle`：行操作配置。
- 方法
  - `handleRowHandleButtonShow`：控制操作列 `show` 的方法。
  - `handleRowHandleButtonDisabled`：控制操作列 `disabled` 的方法。

### edit

- 方法
  - `handleEdit`：处理 _编辑_ 点击，触发 `row-edit` 事件。

### remove

- 方法
  - `handleRemove`：处理 _删除_ 点击，触发 `row-remove` 事件。

### pagination

- 属性
  - `pagination`：分页配置。
- 方法
  - `handlePaginationSizeChange`：处理 _每页条数_ 改变，触发 `pagination-size-change` 事件。
  - `handlePaginationCurrentChange`：处理 _当前页码_ 改变，触发 `pagination-current-change` 事件。
  - `handlePaginationPrevClick`：处理 _上一页_ 点击，触发 `pagination-prev-click` 事件。
  - `handlePaginationNextClick`：处理 _下一页_ 点击，触发 `pagination-next-click` 事件。
