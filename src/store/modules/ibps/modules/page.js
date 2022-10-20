import { get } from "lodash"
import router from "@/router"
import setting from "@/setting.js"
import store from "@/store"
// 判定是否需要缓存
const isKeepAlive = data => get(data, "meta.cache", false)
const defaultIndex = setting.page.opened[0]
const indexName = "dashboard"
export default {
  namespaced: true,
  state: {
    // 可以在多页 tab 模式下显示的页面
    pool: [],
    // 当前显示的多页面列表
    opened: setting.page.opened,
    // 已经加载多标签页数据
    openedLoaded: false,
    // 当前页面
    current: "",
    // 需要缓存的页面 name
    keepAlive: [],
    noKeepAlive: [],
    // 当前页面的按钮权限
    currButtonPer: "",
    // 需要缓存的页面name
    keepNames: [],
    closeFlag: false
  },
  actions: {
    /**
     * @description 确认已经加载多标签页数据
     * @param {Object} context
     */
    isLoaded({ state }) {
      if (state.openedLoaded) {
        return Promise.resolve()
      }
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (state.openedLoaded) {
            resolve(clearInterval(timer))
          }
        }, 10)
      })
    },
    /**
     * @class opened
     * @description 从持久化数据载入标签页列表
     * @param {Object} context
     */
    openedLoad({ state, commit, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        const value = await dispatch(
          "ibps/db/get",
          {
            dbName: "sys",
            path: "page.opened",
            defaultValue: setting.page.opened,
            user: true
          },
          { root: true }
        )
        // 在处理函数中进行数据优化 过滤掉现在已经失效的页签或者已经改变了信息的页签
        // 以 fullPath 字段为准
        // 如果页面过多的话可能需要优化算法
        // valid 有效列表 1, 1, 0, 1 => 有效, 有效, 失效, 有效
        const valid = []
        let hasIndex = false
        // 处理数据
        const opened = value
          .map(opened => {
            // 忽略首页
            if (opened.fullPath === defaultIndex.fullPath || opened.name === defaultIndex.name) {
              hasIndex = true
              valid.push(1)
              return opened
            }
            // 尝试在所有的支持多标签页的页面里找到 name 匹配的页面
            const find = state.pool.find(item => item.name === opened.name)
            // 记录有效或无效信息
            valid.push(find ? 1 : 0)
            // 返回合并后的数据 新的覆盖旧的
            // 新的数据中一般不会携带 params 和 query, 所以旧的参数会留存
            return Object.assign({}, opened, find)
          })
          .filter((opened, index) => valid[index] === 1)
        // 判断是否有首页，避免为空，首页丢失
        if (!hasIndex) {
          opened.unshift(defaultIndex)
        }
        state.opened = opened
        // 标记已经加载多标签页数据
        state.openedLoaded = true
        // 根据 opened 数据生成缓存设置
        commit("keepAliveRefresh")
        try {
          dispatch("closeAll") // 关闭上次打开过的页面
        } catch (e) {
          // TODO handle the exception
          console.log(e)
        }
        // end
        resolve()
      })
    },
    /**
     * 将 opened 属性赋值并持久化 在这之前请先确保已经更新了 state.opened
     * @param {Object} context
     */
    openIbpsdb({ state, dispatch }) {
      return new Promise(async resolve => {
        // 设置数据
        dispatch(
          "ibps/db/set",
          {
            dbName: "sys",
            path: "page.opened",
            value: state.opened,
            user: true
          },
          { root: true }
        )
        // end
        resolve()
      })
    },
    /**
     * @class opened
     * @description 更新页面列表上的某一项
     * @param {Object} context
     * @param {Object} payload { index, params, query, fullPath } 路由信息
     */
    openedUpdate({ state, commit, dispatch }, { index, params, query, fullPath }) {
      return new Promise(async resolve => {
        try {
          // 更新页面列表某一项
          const page = state.opened[index]
          page.params = params || page.params
          page.query = query || page.query
          page.fullPath = fullPath || page.fullPath
          state.opened.splice(index, 1, page)
          // 增加缓存设置
          if (isKeepAlive(page)) {
            commit("keepAlivePush", page.name)
          }
          commit("keepAlivePush", "info-add")
          // 持久化
          await dispatch("openIbpsdb")
        } catch (e) {
          console.log(e)
        }
        // end
        resolve()
      })
    },
    /**
     * @class opened
     * @description 重排页面列表上的某一项
     * @param {Object} context
     * @param {Object} payload { oldIndex, newIndex } 位置信息
     */
    openedSort({ state, commit, dispatch }, { oldIndex, newIndex }) {
      return new Promise(async resolve => {
        // 重排页面列表某一项
        const page = state.opened[oldIndex]
        state.opened.splice(oldIndex, 1)
        state.opened.splice(newIndex, 0, page)
        // 持久化
        await dispatch("openIbpsdb")
        // end
        resolve()
      })
    },
    /**
     * @class opened
     * @description 新增一个 tag (打开一个页面)
     * @param {Object} context
     * @param {Object} payload new tag info
     */
    add({ state, commit, dispatch }, { tag, params, query, fullPath }) {
      return new Promise(async resolve => {
        // 设置新的 tag 在新打开一个以前没打开过的页面时使用
        const newTag = tag
        newTag.params = params || newTag.params
        newTag.query = query || newTag.query
        newTag.fullPath = fullPath || newTag.fullPath
        // 修改tab页打开位置
        let curIndex = 0
        state.opened.forEach((item, index, arr) => {
          if (item.fullPath === state.current) {
            curIndex = index + 1
            return false
          }
        })
        if (curIndex === 0) {
          // 添加进当前显示的页面数组
          state.opened.push(newTag)
        } else {
          state.opened.splice(curIndex, 0, newTag)
        }
        // 如果这个页面需要缓存 将其添加到缓存设置
        if (isKeepAlive(newTag)) {
          commit("keepAlivePush", tag.name)
        }
        // 持久化
        await dispatch("openIbpsdb")
        // end
        resolve()
      })
    },
    /**
     * @class current
     * @description 打开一个新的页面
     * @param {Object} context
     * @param {Object} payload 从路由钩子的 to 对象上获取 { name, params, query, fullPath } 路由信息
     */
    open({ state, commit, dispatch }, { name, params, query, fullPath, meta }) {
      const buttonPermissions = store.state.ibps.menu.buttonPermissions
      let buttonPermission = []
      // 根据路径获取相应的按钮权限（新）
      if (meta && meta.resId) {
        // 获取此菜单下,所有的角色的配置
        let roleRes = buttonPermissions.filter(item => item.RES_ID_ === meta.resId)
        roleRes.forEach(res => {
          if (res.op_type_nos) {
            let authArr = res.op_type_nos.split(",")
            authArr.forEach(opt => {
              if (!buttonPermission.some(item => item === opt)) {
                buttonPermission.push(opt)
              }
            })
          }
        })
      }
      state.currButtonPer = buttonPermission.join(",")
      return new Promise(async resolve => {
        // 已经打开的页面
        const opened = state.opened
        // 判断此页面是否已经打开 并且记录位置
        let pageOpendIndex = 0
        const pageOpend = opened.find((page, index) => {
          // 修复别名进入的
          const same = meta && page.meta && page.meta.name === meta.name ? true : page.fullPath === fullPath
          pageOpendIndex = same ? index : pageOpendIndex
          return same
        })
        if (pageOpend) {
          // 页面以前打开过
          await dispatch("openedUpdate", {
            index: pageOpendIndex,
            params,
            query,
            fullPath
          })
        } else {
          // 页面以前没有打开过
          const page = state.pool.find(t => t.name === name)
          // 如果这里没有找到 page 代表这个路由虽然在框架内 但是不参与标签页显示
          if (page) {
            await dispatch("add", {
              tag: Object.assign({}, page),
              params,
              query,
              fullPath
            })
          } else {
            /*  let obj = {}
            obj.meta = meta
            await dispatch('add', {
              tag: Object.assign({}, obj),
              params,
              query,
              fullPath
            }) */
          }
        }
        commit("currentSet", fullPath)
        console.log("fullPath----", fullPath)
        // 添加缓存页面
        let pashName = fullPath.substring(fullPath.lastIndexOf("/") + 1)
        let pname = pashName.indexOf("?")
        if (pname !== -1) {
          pashName = pashName.substring(0, pashName.lastIndexOf("?"))
        }
        commit("keepAlivePush", pashName)
        // end
        resolve()
      })
    },
    /**
     * @class opened
     * @description 关闭一个 tag (关闭一个页面)
     * @param {Object} context
     * @param {Object} payload { tagName: 要关闭的标签名字 }
     */
    close({ state, commit, dispatch }, { pageSelect }) {
      state.closeFlag = true // 关闭缓存处理
      return new Promise(async resolve => {
        const pageAim = pageSelect || state.current
        if (defaultIndex.fullPath === pageAim) {
          return
        }
        // 预定下个新页面
        let newPage = {}
        const isCurrent = state.current === pageAim
        // 如果关闭的页面就是当前显示的页面
        if (isCurrent) {
          // 去找一个新的页面
          const len = state.opened.length
          let i = 0
          for (i = 0; i < len; i++) {
            if (state.opened[i].fullPath === pageAim) {
              newPage = i < len - 1 ? state.opened[i + 1] : state.opened[i - 1]
              break
            }
          }
          if (i > 1) {
            newPage = state.opened[i - 1]
          } // 选中前一个关闭处理
        }
        // 找到这个页面在已经打开的数据里是第几个
        const index = state.opened.findIndex(page => page.fullPath === pageAim)
        if (index >= 0) {
          // 如果这个页面是缓存的页面 将其在缓存设置中删除
          if (pageSelect != null && pageSelect !== undefined) {
            let pashName = pageSelect.substring(pageSelect.lastIndexOf("/") + 1)
            let pname = pashName.indexOf("?")
            if (pname !== -1) {
              pashName = pashName.substring(0, pashName.lastIndexOf("?"))
            }
            commit("keepAliveRemove", pashName)
          }
          // 更新数据 删除关闭的页面
          state.opened.splice(index, 1)
        }
        // 持久化
        await dispatch("openIbpsdb")
        // 决定最后停留的页面
        if (isCurrent) {
          const { name = indexName, params = {}, query = {} } = newPage
          const routerObj = { name, params, query }
          await router.push(routerObj)
        }
        // end
        resolve()
      })
    },
    /**
     * @class opened
     * @description 关闭当前标签左边的标签
     * @param {Object} context
     * @param {Object} payload { pageSelect: 当前选中的tagName }
     */
    closeLeft({ state, commit, dispatch }, { pageSelect } = {}) {
      return new Promise(async resolve => {
        const pageAim = pageSelect || state.current
        let currentIndex = 0
        state.opened.forEach((page, index) => {
          if (page.fullPath === pageAim) {
            currentIndex = index
          }
        })
        if (currentIndex > 0) {
          // 删除打开的页面 并在缓存设置中删除
          for (let i = state.opened.length - 1; i >= 0; i--) {
            if (state.opened[i].name === indexName || i >= currentIndex) {
              continue
            }
            let pashName = state.opened[i].path.substring(state.opened[i]?.path.lastIndexOf("/") + 1)
            let pname = pashName.indexOf("?")
            if (pname !== -1) {
              pashName = pashName.substring(0, pashName.lastIndexOf("?"))
            }
            commit("keepAliveRemove", pashName)
            state.opened.splice(i, 1)
          }
        }
        // 持久化
        await dispatch("openIbpsdb")
        // 设置当前的页面
        state.current = pageAim
        if (router.app.$route.fullPath !== pageAim) {
          await router.push(pageAim)
        }
        // end
        resolve()
      })
    },
    /**
     * @class opened
     * @description 关闭当前标签右边的标签
     * @param {Object} context
     * @param {Object} payload { pageSelect: 当前选中的tagName }
     */
    closeRight({ state, commit, dispatch }, { pageSelect } = {}) {
      return new Promise(async resolve => {
        const pageAim = pageSelect || state.current
        let currentIndex = 0
        state.opened.forEach((page, index) => {
          if (page.fullPath === pageAim) {
            currentIndex = index
          }
        })
        // 删除打开的页面 并在缓存设置中删除
        for (let i = state.opened.length - 1; i >= 0; i--) {
          if (state.opened[i].name === indexName || currentIndex >= i) {
            continue
          }
          let pashName = state.opened[i].path.substring(state.opened[i]?.path.lastIndexOf("/") + 1)
          let pname = pashName.indexOf("?")
          if (pname !== -1) {
            pashName = pashName.substring(0, pashName.lastIndexOf("?"))
          }
          commit("keepAliveRemove", pashName)
          state.opened.splice(i, 1)
        }
        // 持久化
        await dispatch("openIbpsdb")
        // 设置当前的页面
        state.current = pageAim
        if (router.app.$route.fullPath !== pageAim) {
          await router.push(pageAim)
        }
        // end
        resolve()
      })
    },
    /**
     * @class opened
     * @description 关闭当前激活之外的 tag
     * @param {Object} context
     * @param {Object} payload { pageSelect: 当前选中的tagName }
     */
    closeOther({ state, commit, dispatch }, { pageSelect } = {}) {
      return new Promise(async resolve => {
        const pageAim = pageSelect || state.current
        let currentIndex = 0
        state.opened.forEach((page, index) => {
          if (page.fullPath === pageAim) {
            currentIndex = index
          }
        })
        // 删除打开的页面数据 并更新缓存设置
        for (let i = state.opened.length - 1; i >= 0; i--) {
          if (state.opened[i].name === indexName || currentIndex === i) {
            continue
          }
          let pashName = state.opened[i].path.substring(state.opened[i]?.path.lastIndexOf("/") + 1)
          let pname = pashName.indexOf("?")
          if (pname !== -1) {
            pashName = pashName.substring(0, pashName.lastIndexOf("?"))
          }
          commit("keepAliveRemove", pashName)
          state.opened.splice(i, 1)
        }
        // 持久化
        await dispatch("openIbpsdb")
        // 设置新的页面
        state.current = pageAim
        if (router.app.$route.fullPath !== pageAim) {
          router.push(pageAim)
        }
        // end
        resolve()
      })
    },
    /**
     * @class opened
     * @description 关闭所有 tag
     * @param {Object} context
     */
    closeAll({ state, commit, dispatch }) {
      return new Promise(async resolve => {
        // 删除打开的页面 并在缓存设置中删除
        for (let i = state.opened.length - 1; i >= 0; i--) {
          if (state.opened[i].name === indexName) {
            continue
          }
          let pashName = state.opened[i].path.substring(state.opened[i]?.path.lastIndexOf("/") + 1)
          let pname = pashName.indexOf("?")
          if (pname !== -1) {
            pashName = pashName.substring(0, pashName.lastIndexOf("?"))
          }
          commit("keepAliveRemove", pashName)
          state.opened.splice(i, 1)
        }
        // 持久化
        await dispatch("openIbpsdb")
        // 关闭所有的标签页后需要判断一次现在是不是在首页，不是则导航到首页
        // if (router.app.$route.name !== defaultIndex.name) {
        //   let s = router.app.$route.name
        //   console.log(s)
        //   debugger
        //   router.push({ name: defaultIndex.name })
        // }
        // end
        resolve()
      })
    }
  },
  mutations: {
    /**
     * @class keepAlive
     * @description 从已经打开的页面记录中更新需要缓存的页面记录
     * @param {Object} state state
     */
    keepAliveRefresh(state) {
      state.keepAlive = state.opened.filter(item => isKeepAlive(item)).map(e => e.name)
    },
    /**
     * @description 删除一个页面的缓存设置
     * @param {Object} state state
     * @param {String} name name
     */
    keepAliveRemove(state, name) {
      const list = [...state.keepAlive]
      const index = list.findIndex(item => item === name)
      if (index !== -1) {
        list.splice(index, 1)
        state.keepAlive = list
      }
    },
    /**
     * @description 增加一个页面的缓存设置
     * @param {Object} state state
     * @param {String} name name
     */
    keepAlivePush(state, name) {
      const keep = [...state.keepAlive]
      const index = keep.findIndex(item => item === name)
      if (index === -1) {
        keep.push(name)
      }
      state.keepAlive = keep
    },
    /**
     * @description 删除一个页面的不缓存设置
     * @param {String} name name
     */
    noKeepAliveRemove(state, name) {
      state.noKeepAlive = state.noKeepAlive.filter(item => {
        return item !== name
      })
    },
    /**
     * @description 增加一个页面的不缓存设置
     * @param {String} name name
     */
    noKeepAlivePush(state, name) {
      state.noKeepAlive.push(name)
    },
    /**
     * @description 增加一个页面的缓存设置new
     * @param {Object} state state
     * @param {String} name name
     */
    keepAliveNewPush(state, name) {
      const keep = [...state.keepNames]
      const index = keep.findIndex(item => item === name)
      if (index === -1 && undefined !== name) {
        keep.push(name)
      }
      state.keepNames = keep
    },
    /**
     * @description 清空页面缓存设置
     * @param {Object} state state
     */
    keepAliveClean(state) {
      state.keepAlive = []
    },
    /**
     * @class current
     * @description 设置当前激活的页面 fullPath
     * @param {Object} state state
     * @param {String} fullPath new fullPath
     */
    currentSet(state, fullPath) {
      state.current = fullPath
    },
    /**
     * @class init
     * @description 初始化 pool (候选池)
     * @param {Object} state state
     * @param {Array} routes routes
     */
    init(state, routes) {
      const pool = []
      if (routes && routes.length > 0) {
        const push = function (routes) {
          routes.forEach(route => {
            if (route.children && route.children.length > 0) {
              push(route.children)
            } else {
              if (!route.hidden) {
                const { meta, name, path } = route
                pool.push({ meta, name, path })
              }
            }
          })
        }
        push(routes)
      }
      state.pool = pool
    }
  }
}
