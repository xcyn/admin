import { TimerEvent } from './TimerEvent';

/**
 * 访问令牌默认过期通知时间
 */
const DEFAULT_EXPIRING_NOTIFICATION_TIME = 60;

/**
 * 令牌相关事件管理
 *
 * @author 管超
 */
export class TokenEvents {
  /**
   * 令牌过期通知时间（秒）
   */
  _expiringNotificationTime = 0;

  /**
   * 访问令牌即将过期事件
   */
  _accessTokenExpiringEvent = null;

  /**
   * 访问令牌已过期事件
   */
  _accessTokenExpiredEvent = null;

  /**
   * 创建类实例
   *
   * @param {number} expiringNotificationTime 令牌过期通知时间（秒）
   */
  constructor(expiringNotificationTime = DEFAULT_EXPIRING_NOTIFICATION_TIME) {
    this._expiringNotificationTime = expiringNotificationTime;
    this._accessTokenExpiringEvent = new TimerEvent('Access token expiring');
    this._accessTokenExpiredEvent = new TimerEvent('Access token expired');
  }

  /**
   * 访问令牌即将过期通知时间
   */
  get expiringNotificationTime() {
    return this._expiringNotificationTime;
  }

  /**
   * 载入令牌并注册其所有相关事件
   *
   * @param {Object} token 令牌实例
   */
  load(token) {
    this._cancelTimerEvents();

    if (token.accessToken) {
      const duration = token.expiresIn;

      if (duration > 0) {
        // 如果访问令牌没有过期，注册它的即将过期事件
        let expiring = duration - this._expiringNotificationTime;
        if (expiring <= 0) {
          expiring = 1;
        }
        this._accessTokenExpiringEvent.init(expiring);
      }

      // 总是注册令牌过期事件
      const expired = duration + 1;
      this._accessTokenExpiredEvent.init(expired);
    }
  }

  /**
   * 卸载时，取消所有事件
   */
  unload() {
    this._cancelTimerEvents();
  }

  /**
   * 添加访问令牌即将过期处理器
   *
   * @param {Function} cb 访问令牌即将过期处理器
   */
  addAccessTokenExpiring(cb) {
    this._accessTokenExpiringEvent.addHandler(cb);
  }

  /**
   * 移除访问令牌即将过期处理器
   *
   * @param {Function} cb 访问令牌即将过期处理器
   */
  removeAccessTokenExpiring(cb) {
    this._accessTokenExpiringEvent.removeHandler(cb);
  }

  /**
   * 添加访问令牌已过期处理器
   *
   * @param {Function} cb 访问令牌已过期处理器
   */
  addAccessTokenExpired(cb) {
    this._accessTokenExpiredEvent.addHandler(cb);
  }

  /**
   * 添加访问令牌已过期处理器
   *
   * @param {Function} cb 访问令牌已过期处理器
   */
  removeAccessTokenExpired(cb) {
    this._accessTokenExpiredEvent.removeHandler(cb);
  }

  /**
   * 取消所有定时器事件
   */
  _cancelTimerEvents() {
    this._accessTokenExpiringEvent.cancel();
    this._accessTokenExpiredEvent.cancel();
  }
}
