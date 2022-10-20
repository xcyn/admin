import { Event } from './Event';

/**
 * 默认最小时间范围（秒）
 */
const TIMER_DURATION = 5;

/**
 * 定时器
 */
const timer = {
  setInterval: (cb, duration) => {
    return setInterval(cb, duration);
  },
  clearInterval: (handle) => {
    return clearInterval(handle);
  }
};

/**
 * 定时器事件
 *
 * @author 管超
 */
export class TimerEvent extends Event {
  /**
   * 定时器
   */
  _timer = null;

  /**
   * 过期时间（秒）
   */
  _expiration = 0;

  /**
   * 定时器句柄
   */
  _timerHandle = null;

  /**
   * 创建定时器事件实例
   *
   * @param {string} name 事件名称
   */
  constructor(name) {
    super(name);
    this._timer = timer;
  }

  /**
   * 获取当前时间（秒）
   */
  get now() {
    return parseInt(this._nowFunc().toString(), 10);
  }

  /**
   * 事件初始化
   *
   * @param {number} duration 事件时间持续长度
   */
  init(duration) {
    this.cancel();

    if (duration <= 0) {
      duration = 1;
    }

    this._expiration = this.now + duration;

    let timerDuration = TIMER_DURATION;
    if (duration < timerDuration) {
      timerDuration = duration;
    }
    this._timerHandle = this._timer.setInterval(this._callback.bind(this), timerDuration * 1000);
  }

  /**
   * 取消当前事件
   */
  cancel() {
    if (this._timerHandle) {
      this._timer.clearInterval(this._timerHandle);
      this._timerHandle = null;
    }
  }

  /**
   * 获取当前时间（秒）
   */
  _nowFunc() {
    return Date.now() / 1000;
  }

  /**
   * 定时器回调，达到持续时间时即触发此回调
   */
  _callback() {
    if (this._expiration <= this.now) {
      this.cancel();
      super.raise();
    }
  }
}
