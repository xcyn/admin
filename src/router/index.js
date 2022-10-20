import Vue from "vue"
import VueRouter from "vue-router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import store from "@/store/index.js"
import util from "@/utils/util.js"
import setting from "@/setting.js"
import i18n from "@/utils/i18n.js"
import { getToken, getRefreshToken, removeToken, removeUuid, removeRefreshToken, removeTenantId } from "@/utils/auth"
import routes from "./routes"
// // fix vue-router NavigationDuplicated
// const VueRouterPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return VueRouterPush.call(this, location)["catch"](err => err)
// }
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location)["catch"](err => err)
}
Vue.use(VueRouter)
const createRouter = () => new VueRouter({ mode: "history", scrollBehavior: () => ({ y: 0 }), routes: routes }) // 后端支持可开 https://router.vuejs.org/zh/guide/essentials/history-mode.html
const router = createRouter()
// 多用户切换单点跳转处理
try {
  // 这里将cookie里是否存有token作为验证是否登录的条件
  const hasToken = getToken()
  if (hasToken && hasToken !== "undefined" && getUrlParam("encodeName") !== null) {
    // 删除一系列cookie
    removeToken()
    removeUuid()
    removeRefreshToken()
    removeTenantId()
    localStorage.removeItem("userinfo")
  }
} catch (e) {
  console.log(e)
}
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据
  await store.dispatch("ibps/page/isLoaded")
  // 确认已经加载组件尺寸设置
  await store.dispatch("ibps/size/isLoaded")
  // 关闭搜索面板
  store.commit("ibps/search/set", false)
  NProgress.start()
  const locking = util.cookies.get("locking")
  if (locking === "locked" && to.name !== "locking") {
    // 判断当前是否是锁定状态
    next({ replace: true, name: "locking" })
  } else if (locking === "unlock" && to.name === "locking") {
    next(false)
  } else {
    // 这里将cookie里是否存有token作为验证是否登录的条件
    const hasToken = getToken()
    if ((hasToken && hasToken !== "undefined") || to.query.loginType === "SSO") {
      // 从cookie 获取用户token
      if (getUrlParam("module") !== null && !top.selectModule) {
        top.module = getUrlParam("module")
      }
      // 登录 锁定 401没权限  403禁止访问 没有菜单
      if (to.name === "locking" || to.name === "login" || to.name === "error401" || to.name === "error403" || to.name === "nomenu") {
        next()
        // 嵌入页面特殊处理
      } else if (to.query.loginType === "SSO") {
        // 子系统
        let system = store.getters.system
        if (util.isEmpty(system) || util.isEmpty(system.id)) {
          let item = { alias: "ibps", id: "266946423468851203", name: "系统管理", path: "266946423468851203", homePage: "/system/dashboard", isLocal: true }
          system = item
          // 设置子系统系统参数
          store.dispatch("ibps/system/set", item)
          next({ path: to.path })
        }
        NProgress.done() // 结束Progress
      } else {
        // 判断是否有子系统和是否有菜单
        if (util.isEmpty(store.getters.system) || util.isEmpty(store.getters.menus)) {
          store
            .dispatch("ibps/user/load")
            .then(() => {
              // 拉取用户信息,避免刷新用户丢失
              // 租户模式下跳转
              const tenants = store.getters.tenants
              if (util.isNotEmpty(tenants)) {
                const tenant = store.getters.tenant
                const tenantid = store.getters.tenantid
                if (util.isEmpty(tenant) || util.isEmpty(tenantid)) {
                  if (to.name === "tenantSelect") {
                    return next()
                  }
                  return next({ path: "/tenantSelect", replace: true })
                }
              }
              // 子系统
              let system = store.getters.system
              if (util.isEmpty(system) || util.isEmpty(system.id)) {
                if (getUrlParam("module") !== null) {
                  if (to.name === "systemSelectSSO") {
                    return next()
                  }
                  return next({ path: "/systemSelectSSO", replace: true })
                } else {
                  if (to.name === "systemSelect") {
                    return next()
                  }
                  return next({ path: "/systemSelect", replace: true })
                }
              }
              store
                .dispatch("ibps/menu/init", { systemId: system.id })
                .then(async () => {
                  // 根据用户菜单权限生成可访问的路由表
                  if (util.isEmpty(store.getters.menus)) {
                    next()
                  } else {
                    const addRouters = store.getters.routers
                    if (addRouters && addRouters.length > 0) {
                      // 动态添加可访问路由表
                      for (let i = 0; i < addRouters.length; i++) {
                        router.addRoute(addRouters[i])
                      }
                      // 初始化加载或用户刷新页面后从数据库加载一系列的设置
                      await store.dispatch("ibps/account/loadInfo", { addRouters, menus: store.getters.menus })
                      // 请求带有 redirect 重定向时，登录自动重定向到该地址
                      let redirect = decodeURIComponent(from.query.redirect || to.path)
                      if (getUrlParam("loginType") === "SSO") {
                        redirect = getUrlParam("redirect")
                      }
                      if (to.path === redirect) {
                        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
                        // next()
                      } else {
                        // 跳转到目的路由
                        next({ path: redirect })
                      }
                    } else {
                      next({ path: "/403", replace: true, query: { noGoBack: true } })
                    }
                  }
                })
                ["catch"](e => {
                  console.error(e)
                  NProgress.done() // 结束Progress
                })
            })
            ["catch"](e => {
              NProgress.done() // 结束Progress
              // 前台登出
              store
                .dispatch("ibps/account/fedLogout")
                .then(() => {
                  next({ name: "login" })
                })
                ["catch"](err => {
                  console.error(err)
                })
            })
        } else {
          // 动态改变权限,判断是否有菜单权限，或者刷新页面
          if (to.matched.length === 0) {
            // 不能匹配的路由
            return next({ path: "401", replace: true, query: { noGoBack: true } })
          } else {
            next()
          }
        }
        // end
      }
    } else {
      // 判断refresh tonken是否过期
      const refreshToken = getRefreshToken()
      if (util.isNotEmpty(refreshToken)) {
        // 刷新tonken
        await store
          .dispatch("ibps/account/refreshToken")
          .then(() => {
            next()
          })
          ["catch"](err => {
            console.error(err)
          })
      } else {
        // 在免登录白名单，直接进入
        if (setting.whiteRouterList.indexOf(to.path) !== -1) {
          next()
        } else if (getUrlParam("loginType") === "SSO") {
          return next({ path: getUrlParam("redirect"), query: { loginType: "SSO" } })
        } else {
          // 没有登录的时候跳转到登录界面
          // 携带上登陆成功之后需要跳转的页面完整路径
          if (getUrlParam("encodeName") !== null) {
            next({ name: "loginSSO", query: { redirect: to.fullPath } })
          } else {
            next({ name: "login", query: { redirect: to.fullPath } })
          }
          NProgress.done()
        }
      }
    }
  }
})
router.afterEach(to => {
  NProgress.done()
  store.dispatch("ibps/page/open", to) // 多页控制 打开新的页面
  i18n.setTitle(to.meta.name || to.name, to.meta.title) // 更改标题
})
export default router
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置Router
}
export function getUrlParam(name) {
  return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")) || null //获取url指定参数值
}
