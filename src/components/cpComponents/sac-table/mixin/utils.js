import Vue from 'vue';
import { Component } from 'vue-property-decorator';

/**
 * @author 管超
 */
@Component
class UtilsMixin extends Vue {
  /**
   * 组件属性默认值
   */
  handleAttribute(attribute, defaultValue) {
    if (attribute === false || attribute === 0 || attribute === '') {
      return attribute;
    }
    return attribute || defaultValue;
  }
}

export default UtilsMixin;
