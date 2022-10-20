import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { options } from '@/libs/util.table';

/**
 * @author 管超
 */
@Component
class BaseMixin extends Vue {
  /** 通用配置 */
  @Prop({
    type: Object,
    default: () => options
  })
  options;

  /** 索引 */
  @Prop({
    type: Object,
    default: () => null
  })
  indexRow;

  /** 表头配置 */
  @Prop({
    type: Array,
    default: () => []
  })
  columns;
}

export default BaseMixin;
