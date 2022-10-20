import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

/**
 * @author 管超
 */
@Component
class PaginationMixin extends Vue {
  /** 分页数据 */
  @Prop({
    type: Object,
    default: () => null
  })
  pagination;

  /**
   * 每页条数改变
   */
  handlePaginationSizeChange(pageSize) {
    this.$emit('pagination-size-change', pageSize);
  }

  /**
   * 当前页码改变
   */
  handlePaginationCurrentChange(currentPage) {
    this.$emit('pagination-current-change', currentPage);
  }

  /**
   * 上一页
   */
  handlePaginationPrevClick(currentPage) {
    this.$emit('pagination-prev-click', currentPage);
  }

  /**
   * 下一页
   */
  handlePaginationNextClick(currentPage) {
    this.$emit('pagination-next-click', currentPage);
  }
}

export default PaginationMixin;
