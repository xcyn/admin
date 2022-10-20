import { tokenRequest } from '@/plugin/axios';
import { JSEncrypt } from 'jsencrypt';
import queryString from 'query-string';

const PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAh4KL9AD2Bchzd3aCYqjw3Y9XOI0HNAKT0ixLmVUpPTsXEbbSHJRNtSaj/s04Ox6jpA1xIW8UrT1xvb+ifMJwOgdIjUbPBDeI9nivyOqvDs+N6Zje9KCMmnodYrEHYxoKiNjWogSa3WtzqPsPh3SkEa6P9L6F9oWYlX4H4OII2xlp15JftKbYqmbPDGiiJNTEmIhuScXzk5P2J2wi5XfFCJOtx5vWgzrf962mcN2v6x5xjB7oYexrVJ0DK0O0rYFWlFohPmga/MbTCVUN8x+WqQfKtO8gWma+McrbpYniBerIqJhFmzjLw7gH1ah2SjHGtrL3erlt2TMLL2KDV98/MQIDAQAB';

/**
 * 获取访问令牌
 *
 * @param {string} username 用户名
 * @param {string} password 密码
 * @author 管超
 */
export function token(username, password) {
  const data = {
    grant_type: 'password',
    username: username,
    password: password,
    client_id: 'dummy',
    client_secret: 'dummy'
  };

  const raw = `${queryString.stringify(data)}&repeat_attack_time=${Date.now()}`;
  const jSEncrypt = new JSEncrypt();
  jSEncrypt.setPublicKey(PUBLIC_KEY);
  const encrypted = encodeURIComponent(jSEncrypt.encrypt(raw));

  return tokenRequest({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: encrypted
  });
}

/**
 * 获取访问令牌
 *
 * @param {Object} data 令牌请求对象
 * @author 管超
 */
export function getToken(data) {
  const raw = `${queryString.stringify(data)}&repeat_attack_time=${Date.now()}`;
  const jSEncrypt = new JSEncrypt();
  jSEncrypt.setPublicKey(PUBLIC_KEY);
  const encrypted = encodeURIComponent(jSEncrypt.encrypt(raw));
  console.log(encrypted);

  return tokenRequest({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: encrypted
  });
}
