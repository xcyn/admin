<template>
  <div class="sac-table">
    <span ref="hack" style="display: none">This is a hack used for table popover component</span>

    <i v-if="settingVisible" class="el-icon-setting sac-table__setting-icon" title="设置" @click="handleSettingClick"></i>

    <div class="sac-table__body">
      <el-table
        v-bind="options"
        :data="innerData"
      >
        <el-table-column
          v-if="indexRow || indexRow === ''"
          type="index"
          align="center"
          :label="handleAttribute(indexRow.title, '序号')"
          v-bind="indexRow"
        >
        </el-table-column>
        <el-table-column
          v-for="(item) in innerColumns"
          :key="item.key"
          :label="handleAttribute(item.title, '')"
          :prop="handleAttribute(item.key, null)"
          :align="handleAttribute(item.align, 'center')"
          :show-overflow-tooltip="handleAttribute(item.showOverflowTooltip, true)"
          v-bind="item"
        >
        </el-table-column>
        <el-table-column
          v-if="rowHandle"
          label="操作"
          align="center"
          v-bind="rowHandle"
        >
          <template slot-scope="scope">
            <el-button
              v-if="rowHandle.edit && handleRowHandleButtonShow(rowHandle.edit.show, scope.$index, scope.row)"
              type="text"
              size="small"
              :disabled="handleRowHandleButtonDisabled(rowHandle.edit.disabled, scope.$index, scope.row)"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <template v-for="(item, index) in handleAttribute(rowHandle.custom, [])">
              <el-button
                v-if="handleRowHandleButtonShow(item.show, scope.$index, scope.row)"
                type="text"
                size="small"
                :disabled="handleRowHandleButtonDisabled(item.disabled, scope.$index, scope.row)"
                :key="index"
                v-bind="item"
                @click="$emit(item.emit, { index: scope.$index, row: scope.row })"
              >
                {{ item.text }}
              </el-button>
            </template>
            <el-popover placement="top">
              <p><i class="el-icon-warning-outline"></i> 是否删除？</p>
              <div>
                <el-button type="primary" size="mini" @click="handleRemove(scope.$index, scope.row)">确认</el-button>
                <el-button size="mini" @click="$refs.hack.click()">取消</el-button>
              </div>
              <el-button
                v-if="rowHandle.remove && handleRowHandleButtonShow(rowHandle.remove.show, scope.$index, scope.row)"
                slot="reference"
                type="text"
                size="small"
                :disabled="handleRowHandleButtonDisabled(rowHandle.remove.disabled, scope.$index, scope.row)"
              >
                {{ handleAttribute(rowHandle.remove.text, '删除') }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="sac-table__pagination" v-if="pagination">
      <el-pagination
        v-bind="pagination"
        @size-change="handlePaginationSizeChange"
        @current-change="handlePaginationCurrentChange"
        @prev-click="handlePaginationPrevClick"
        @next-click="handlePaginationNextClick"
      />
    </div>

    <el-drawer
      title="表格设置"
      size="320px"
      direction="rtl"
      custom-class="sac-table__setting"
      :visible.sync="drawer"
    >
      <div class="sac-table__setting__content">
        <el-form
          size="small"
          label-position="top"
          :model="setting"
        >
          <el-form-item label="自定义列显示">
            <el-select v-model="setting.columns" multiple placeholder="请选择要显示的列" style="width: 100%">
              <el-option
                v-for="(item) in columns"
                :key="item.key"
                :value="item.key"
                :label="handleAttribute(item.title, '')"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';

import UtilsMixin from './mixin/utils';
import SettingMixin from './mixin/setting';
import BaseMixin from './mixin/base';
import HandleRowMixin from './mixin/handleRow';
import EditMixin from './mixin/edit';
import RemoveMixin from './mixin/remove';
import PaginationMixin from './mixin/pagination';

/**
 * 表格
 *
 * @author 管超
 */
@Component
class SacTable extends Mixins(UtilsMixin, SettingMixin, BaseMixin, HandleRowMixin, EditMixin, RemoveMixin, PaginationMixin) {
  /** 表格数据 */
  @Prop({
    type: Array,
    default: () => []
  })
  data;

  /** 表格内部数据 */
  innerData = [];

  get innerColumns() {
    return this.columns.filter(c => this.setting.columns.indexOf(c.key) > -1);
  }

  @Watch('data')
  watchData() {
    if (!this.pagination) {
      this.innerData = this.data;
    } else {
      this.watchPagination();
    }
  }

  @Watch('pagination', { deep: true })
  watchPagination() {
    if (this.pagination) {
      const { currentPage, pageSize } = this.pagination;
      this.innerData = this.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }
  }

  mounted() {
    this.setting.columns = this.columns.map(c => c.key);
    this.watchData();
  }
}

export default SacTable;
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/references';

.sac-table {
  position: relative;

  &__setting-icon {
    position: absolute;
    right: 10px;
    top: 8px;
    font-size: 14px;
    z-index: 1223;
    cursor: pointer;
    color: $color-gray100;

    &:hover {
      color: $color-gray200;
    }
  }

  &__body, &__pagination {
    margin: 15px 0;
  }
}

.sac-table__setting {
  &__content {
    padding: 0 20px;
  }
}
</style>
