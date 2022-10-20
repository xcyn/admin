import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

/**
 * @author 管超
 */
@Component
class HandleRowMixin extends Vue {
  /** 行数据操作 */
  @Prop({
    type: Object,
    default: () => null
  })
  rowHandle;

  /**
   * 控制操作列 show 的方法
   */
  handleRowHandleButtonShow(show = true, index, row) {
    if (typeof show === 'boolean') {
      return show;
    } else if (typeof show === 'function') {
      return show(index, row);
    }
    return Boolean(show);
  }

  /**
   * 控制操作列 disabled 的方法
   */
  handleRowHandleButtonDisabled(disabled = false, index, row) {
    if (typeof disabled === 'boolean') {
      return disabled;
    } else if (typeof disabled === 'function') {
      return disabled(index, row);
    }
    return Boolean(disabled);
  }
}

export default HandleRowMixin;
