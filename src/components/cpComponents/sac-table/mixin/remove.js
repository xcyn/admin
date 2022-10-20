import Vue from 'vue';
import { Component } from 'vue-property-decorator';

/**
 * @author 管超
 */
@Component
class RemoveMixin extends Vue {
  /**
   * 删除行
   */
  handleRemove(index, row) {
    this.$emit('row-remove', index, row);
    this.$refs.hack.click();
  }
}

export default RemoveMixin;
