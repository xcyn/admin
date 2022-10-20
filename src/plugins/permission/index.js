import { hasPermission } from '@/mixins/permission' // 权限判断指令
/**
 * <a-button v-if="$auth('ibps-form-edit')">Button</a-button>
 * @param Vue
 */
function plugin(Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get() {
        return (val) => {
          return hasPermission(val)
        }
      }
    }
  })
}

export default plugin
