import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

/**
 * @author 管超
 */
@Component
class SettingMixin extends Vue {
  /** 设置是否可见 */
  @Prop({
    type: [Boolean, String],
    default: false
  })
  settingVisible;

  /** 设置 Drawer 是否显示 */
  drawer = false;

  /** 自定义设置 */
  setting = {
    /** 需要显示的列 */
    columns: []
  };

  /**
   * 处理设置图标点击
   */
  handleSettingClick() {
    this.drawer = true;
  }
}

export default SettingMixin;
