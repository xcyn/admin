/**
 * @author 管超
 */

import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
class EditMixin extends Vue {
  /**
   * 编辑行
   */
  handleEdit(index, row) {
    this.$emit('row-edit', index, row);
  }
}

export default EditMixin;
