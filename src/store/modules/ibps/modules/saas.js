import { register } from '@/api/saas/tenant/tenant'

export default {
  namespaced: true,
  actions: {

    /**
     * 注册租户账号
     * @param {*} param context 上下文
     * @param {*} form 表单
     */
    register({
      commit,
      dispatch
    }, form) {
      return new Promise(async(resolve, reject) => {
        // 开始请求注册接口
        register(form).then(response => {
          resolve()
        }).catch(err => {
          console.error('err: ', err)
          reject(err)
        })
      })
    }
  }
}
