import { getUserInfo, switchUser, exitSwitchUser, openUser, openTenant } from '@/api/oauth2/user'
import { getUserInfo as userInfoExtend } from '@/api/cpApi/extend/index.js'
import { getToken, getUuid } from '@/utils/auth'
// import router from '@/router'
import Utils from '@/utils/util'
export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {},
    // 账号
    account: '',
    // 切换的账号
    switchAccount: '',
    // 是否开启注册
    regOpen: null,
    // 是否开启租户模式
    tenantOpen: null,
    // 设置的关联租户ID
    designTenantid: '',
    // 部门信息
    depList: null,
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    async set({ state, dispatch }, info) {
      // store 赋值
      state.info = info
      // 持久化
      await dispatch(
        'ibps/db/set',
        {
          dbName: 'sys',
          path: 'user.info',
          value: info,
          user: true,
        },
        { root: true }
      )
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} state vuex state
     */
    async get({ state, dispatch }) {
      // store 赋值
      state.info = await dispatch(
        'ibps/db/get',
        {
          dbName: 'sys',
          path: 'user.info',
          defaultValue: {},
          user: true,
        },
        { root: true }
      )
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    async load({ state, dispatch }) {
      return new Promise(async (resolve, reject) => {
        // 获取当前用户账号
        await dispatch('getAccount')
        // 获取切换用户账号
        await dispatch('getSwitchAccount')
        // 获取是否注册用户账号
        await dispatch('loadRegOpen')
        // 获取是否开启租户
        await dispatch('loadTenantOpen')
        // 获取用户信息
        getUserInfo(state.account)
          .then(async response => {
            if (!response) {
              reject(response)
            }
            let info = response.data
            let extendInfo = await userInfoExtend(info?.employee?.id)
            // todombb 这里需要删除多余的org信息,但是后续如果userInfoExtend这个接口不在返回org信息了.就可以把此操作删除了.
            delete extendInfo?.data?.org
            info = Object.assign(info, extendInfo?.data)
            // 设置当前
            await dispatch('ibps/user/set', info, {
              root: true,
            })
            // 获取当前子系统
            await dispatch('ibps/system/loadSystem', null, {
              root: true,
            })
            // 设置用户权限
            await dispatch('ibps/authsql/loadAll', null, { root: true })
            resolve(info)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * 监听当前用户是否改变
     * @param {*} param0
     */
    listen({ state, dispatch }) {
      // 找到当前浏览器支持的hidden属性名和visibilitychange事件名
      let hidden = 'hidden'
      let visibilityChange = 'visibilitychange'
      if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden'
        visibilityChange = 'visibilitychange'
      } else if (typeof document.mozHidden !== 'undefined') {
        hidden = 'mozHidden'
        visibilityChange = 'mozvisibilitychange'
      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden'
        visibilityChange = 'msvisibilitychange'
      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden'
        visibilityChange = 'webkitvisibilitychange'
      }
      document.addEventListener(
        visibilityChange,
        () => {
          const uuid = getUuid()
          const userId = state.info && state.info.user ? state.info.user.id : ''
          if (!document[hidden] && Utils.isNotEmpty(userId) && userId !== uuid) {
            // 显示
            location.reload()
          }
        },
        false
      )
    },
    /**
     * 获取用户名
     * @param {*} param0
     */
    getAccount({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.account = await dispatch(
          'ibps/db/get',
          {
            dbName: 'sys',
            path: 'account',
            defaultValue: '',
            user: true,
          },
          { root: true }
        )
        // end
        resolve()
      })
    },
    setAccount({ state, dispatch }, account) {
      return new Promise(async resolve => {
        // store 赋值
        state.account = account
        // 持久化
        await dispatch(
          'ibps/db/set',
          {
            dbName: 'sys',
            path: 'account',
            value: account,
            user: true,
          },
          { root: true }
        )
        // end
        resolve()
      })
    },
    /**
     * 获取切换用户账号
     * @param {*} param0
     */
    getSwitchAccount({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.switchAccount = await dispatch(
          'ibps/db/get',
          {
            dbName: 'sys',
            path: 'switchAccount',
            defaultValue: '',
            user: true,
          },
          { root: true }
        )
        // end
        resolve()
      })
    },
    /**
     * 设置切换用户账号
     * @param {*} param0
     * @param {*} switchAccount
     */
    setSwitchAccount({ state, dispatch }, switchAccount) {
      return new Promise(async resolve => {
        // store 赋值
        state.switchAccount = switchAccount
        // 持久化
        await dispatch(
          'ibps/db/set',
          {
            dbName: 'sys',
            path: 'switchAccount',
            value: switchAccount,
            user: true,
          },
          { root: true }
        )
        // end
        resolve()
      })
    },
    /**
     * 切换用户
     * @param {*} param0
     * @param {*} username
     */
    switchUser({ state, dispatch, commit }, username) {
      return new Promise(async (resolve, reject) => {
        const switchAccount = state.account
        let token = getToken()
        if (Utils.isEmpty(token)) {
          await dispatch('ibps/account/refreshToken', null, { root: true })
          token = getToken()
          if (Utils.isEmpty(token)) {
            reject(token)
            return
          }
        }
        await switchUser({
          username: username,
          token: token,
        })
          .then(async response => {
            const data = response.data
            // 更新token信息
            await dispatch('ibps/account/updataTokenInfo', data, { root: true })
            // 更新用户信息
            await dispatch('setAccount', username)
            // 更新切换用户信息
            await dispatch('setSwitchAccount', switchAccount)
            // 清除子系统
            // await dispatch('ibps/system/set', null, { root: true })
            //  清除菜单
            await dispatch('ibps/menu/menusSet', null, { root: true })
            //  清除用户权限
            commit('ibps/user/resetAuth', state)
            // 重置路由
            // await resetRouter()
            resolve(data)
          })
          .catch(err => {
            console.error('switchUser-err: ', err)
            reject(err)
          })
      })
    },
    /**
     * 退出切换
     * @param {*} param0
     */
    exitSwitchUser({ state, dispatch, commit }) {
      return new Promise(async (resolve, reject) => {
        const switchAccount = state.switchAccount
        let token = getToken()
        if (Utils.isEmpty(token)) {
          await dispatch('ibps/account/refreshToken', null, { root: true })
          token = getToken()
          if (Utils.isEmpty(token)) {
            reject(token)
            return
          }
        }
        await exitSwitchUser({
          username: switchAccount,
          token: token,
        })
          .then(async response => {
            const data = response.data
            // 更新token信息
            await dispatch('ibps/account/updataTokenInfo', data, { root: true })
            // 更新用户信息
            await dispatch('setAccount', switchAccount)
            // 更新切换用户信息
            await dispatch('setSwitchAccount', '')
            // 清除子系统
            // await dispatch('ibps/system/set', null, { root: true })
            //  清除菜单
            await dispatch('ibps/menu/menusSet', null, { root: true })
            //  清除用户权限
            commit('ibps/user/resetAuth', state)
            // 重置路由
            // await resetRouter()
            location.reload()
            resolve(data)
          })
          .catch(err => {
            console.error('refreshAccessToken-err: ', err)
            reject(err)
          })
      })
    },
    /**
     * 初始化相关信息
     * @param {*} param0
     */
    async init({ state, dispatch }) {
      // 设置注册用户账号
      await dispatch('setRegOpen', null)
      // 获取注册用户账号
      await dispatch('loadRegOpen')
      // 设置是否开启租户
      await dispatch('setTenantOpen', null)
      // 获取是否开启租户
      await dispatch('loadTenantOpen')
    },
    /**
     * 设置注册用户账号
     * @param {*} param0
     * @param {*} regOpen
     */
    async setRegOpen({ state, dispatch }, regOpen) {
      // store 赋值
      state.regOpen = regOpen
      // 持久化
      await dispatch(
        'ibps/db/set',
        {
          dbName: 'sys',
          path: 'register.user',
          value: state.regOpen,
          user: false,
        },
        { root: true }
      )
    },
    async loadRegOpen({ state, dispatch }) {
      // 获取
      state.regOpen = await dispatch(
        'ibps/db/get',
        {
          dbName: 'sys',
          path: 'register.user',
          value: state.regOpen,
          user: false,
        },
        { root: true }
      )
      if (Utils.isEmpty(state.regOpen)) {
        await openUser()
          .then(async response => {
            const regOpen = response.data
            // 设置注册用户账号
            await dispatch('setRegOpen', regOpen)
          })
          .catch(err => {
            console.error('loadRegOpen:', err)
          })
      }
    },
    /**
     * 设置注册用户组合模式
     * @param {*} param0
     * @param {*} tenantOpen
     */
    async setTenantOpen({ state, dispatch }, tenantOpen) {
      // store 赋值
      state.tenantOpen = tenantOpen
      // 持久化
      await dispatch(
        'ibps/db/set',
        {
          dbName: 'sys',
          path: 'register.tenant',
          value: state.tenantOpen,
          user: false,
        },
        { root: true }
      )
    },
    /**
     *
     * @description 是否开启注册租户
     */
    async loadTenantOpen({ state, dispatch }) {
      // 获取
      state.tenantOpen = await dispatch(
        'ibps/db/get',
        {
          dbName: 'sys',
          path: 'register.tenant',
          value: state.tenantOpen,
          user: false,
        },
        { root: true }
      )
      if (Utils.isEmpty(state.tenantOpen)) {
        await openTenant()
          .then(async response => {
            const tenantOpen = response.data
            state.tenantOpen = tenantOpen
            await dispatch('setTenantOpen', tenantOpen)
          })
          .catch(err => {
            console.error('loadRegisterTenantOpen:', err)
            dispatch('setTenantOpen', null)
          })
      }
    },
    /**
     * @description 切换更新租户ID数据
     * @param {Object} state vuex state
     * @param {String} tenantid 租户ID
     */
    setTenantids({ state }, tenantid) {
      state.info.tenantId = tenantid
    },
    setDesignTenantid({ state }, designTenantid) {
      state.designTenantid = designTenantid
    },
    /**
     * 设置部门列表
     */
    setDepList({ state }, depList) {
      state.depList = depList
    },
  },
}
