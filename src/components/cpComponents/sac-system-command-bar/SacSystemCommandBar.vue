<template>
  <div class="container clearfix">
    <span class="title">{{ title }}</span>

    <el-form class="action-form" :inline="true">
      <el-form-item>
        <el-input
          v-model="search"
          v-show="searchVisible"
          class="search-box"
          placeholder="请输入过滤内容"
          :size="size"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="search-btn"
          v-show="searchVisible"
          :size="size"
          @click="handleSearch"
        >
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="text"
          class="add-btn"
          icon="el-icon-plus"
          :size="size"
          @click="handleAdd"
        >
          添加
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="text"
          class="refresh-btn"
          v-show="refreshVisible"
          icon="el-icon-refresh-right"
          :size="size"
          @click="handleRefresh"
        >
          刷新
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

/**
 * 系统模块通用命令栏
 *
 * @author 甘露平; 管超
 */
@Component
class CommandBar extends Vue {
  /** 标题 */
  @Prop({
    type: String,
    default: null
  })
  title;

  /** 搜素是否可见 */
  @Prop({
    type: Boolean,
    default: true
  })
  searchVisible;

  /** 刷新是否可见 */
  @Prop({
    type: Boolean,
    default: true
  })
  refreshVisible;

  /** 控件尺寸 */
  size = 'small';

  /** 搜索值 */
  search = '';

  /**
   * 处理搜索
   */
  handleSearch() {
    this.$emit('search', this.search.trim());
  }

  /**
   * 处理添加
   */
  handleAdd() {
    this.$emit('add');
  }

  /**
   * 处理刷新
   */
  handleRefresh() {
    this.$emit('refresh');
  }
}

export default CommandBar;
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;

  > .title {
    width: 10rem;
    line-height: 40px;
  }

  > .action-form {
    width: auto;

    .el-form-item {
      margin-bottom: 0;
    }
  }
}
// .clearfix::after {
//   content: '';
//   display: block;
//   clear: both;
// }
// .container {
//   width: 100%;
//   height: 30px;
//   line-height: 30px;
//   margin-bottom: 10px;
//   .title {
//     color: #058ecc;
//     font-size: 16px;
//     font-weight: 700;
//     display: inline-block
//   }
//   .action-form {
//     float: right;
//     .search-box {
//       width: 160px;
//       border-radius: 3px;
//       margin-left: 10px;
//     }
//     .el-button {
//       font-weight: 400;
//       font-size: 14px;
//       padding: 0 15px;
//       height: 32px;
//       line-height: 1.5
//     }
//     .search-btn {
//       width: 60px;
//       border: 0;
//       border-radius: 3px;
//       background-color: #058ecc;
//       margin-left: 10px;
//       margin-right: 20px;
//     }
//     .add-btn,.refresh-btn{
//       width: 80px;
//       color: rgba(0,0,0,.65);
//     }
//     .add-btn:hover,.refresh-btn:hover {
//       border: 1px solid #058ecc;
//       color: #2494e3;
//     }
//   }
//   // 样式穿透
//   .action-form ::v-deep .el-input__inner {
//       margin: 0;
//       padding: 4px 11px;
//       height: 32px;
//       line-height: 1.5;
//       font-size: 14px;
//       border: 1px solid #d9d9d9;
//     }
//   .action-form ::v-deep .el-form-item {
//     margin-right: 0;
//     margin-bottom: 0;
//   }
//   .action-form ::v-deep .el-form-item__content {
//     line-height: 30px;
//   }
// }
</style>
