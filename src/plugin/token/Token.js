/**
 * 令牌
 *
 * @author 管超
 */
export class Token {
  /**
   * 访问令牌
   */
  _accessToken = null;

  /**
   * 刷新令牌
   */
  _refreshToken = null;

  /**
   * 令牌类型
   */
  _tokenType = null;

  /**
   * 过期时间戳
   */
  _expiresAt = null;

  /**
   * 创建令牌实例
   */
  constructor(token) {
    this._accessToken = token.access_token;
    this._refreshToken = token.refresh_token;
    this._expiresAt = parseInt((token.expires_in / 1000).toString(), 10);
    this._tokenType = token.token_type ? token.token_type.trim() : '';
  }

  /**
   * 访问令牌
   */
  get accessToken() {
    if (this._accessToken) {
      return this._accessToken;
    }
    return '';
  }

  /**
   * 刷新令牌
   */
  get refreshToken() {
    if (this._refreshToken) {
      return this._refreshToken;
    }
    return '';
  }

  /**
   * 令牌类型
   */
  get tokenType() {
    if (this._tokenType) {
      return this._tokenType;
    }
    return '';
  }

  /**
   * 距离过期剩余多少秒
   */
  get expiresIn() {
    if (this._expiresAt) {
      const now = parseInt((Date.now() / 1000).toString(), 10);
      return this._expiresAt - now;
    }

    return 0;
  }

  /**
   * 令牌是否过期
   */
  get expired() {
    return this.expiresIn <= 0;
  }

  /**
   * 序列化为字符串
   */
  toStorageString() {
    return JSON.stringify({
      access_token: this._accessToken,
      refresh_token: this._refreshToken,
      expires_in: this._expiresAt * 1000,
      token_type: this._tokenType
    });
  }
}

/**
 * 反序列化令牌
 *
 * @param {string} tokenString 令牌字符串
 * @author 管超
 */
export function deserializeTokenFromString(tokenString) {
  return new Token(JSON.parse(tokenString));
}

/**
 * 生成令牌请求对象
 *
 * @param {Object} param
 * @author 管超
 */
export function generateTokenRequestObject({ username, password, refreshToken } = {}) {
  if ((username && password) || refreshToken) {
    return {
      grant_type: refreshToken ? 'refresh_token' : 'password',
      username: username,
      password: password,
      refresh_token: refreshToken,
      client_id: 'dummy',
      client_secret: 'dummy'
    };
  }

  return null;
}
