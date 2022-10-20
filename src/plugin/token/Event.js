/**
 * 事件
 *
 * @author 管超
 */
export class Event {
  /**
   * 事件订阅回调列表
   */
  _callbacks = [];

  /**
   * 事件名称
   */
  _name = undefined;

  /**
   * 创建事件实例
   *
   * @param {string} name 事件名称
   */
  constructor(name) {
    this._name = name;
    this._callbacks = [];
  }

  /**
   * 添加事件处理器
   *
   * @param {Function} cb 待添加事件回调
   */
  addHandler(cb) {
    this._callbacks.push(cb);
  }

  /**
   * 移除事件处理器
   *
   * @param {Function} cb 待移除事件回调
   */
  removeHandler(cb) {
    const idx = this._callbacks.findIndex(item => item === cb);
    if (idx >= 0) {
      this._callbacks.splice(idx, 1);
    }
  }

  /**
   * 触发事件
   *
   * @param  {...any} params 参数列表
   */
  raise(...params) {
    for (let i = 0; i < this._callbacks.length; i++) {
      this._callbacks[i](...params);
    }
  }
}
