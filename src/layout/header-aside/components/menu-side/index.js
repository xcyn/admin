import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { createMenu } from '../libs/util.menu'

export default {
  name: 'ibps-layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  render(h) {
    const defaultActive = this.getDefaultActive()
    return <div class='ibps-layout-header-aside-menu-side'>
      <ibps-scrollbar>
        <el-menu
          collapse={ this.asideCollapse }
          collapseTransition={ this.asideTransition }
          uniqueOpened={ true }
          defaultOpeneds={ this.defaultOpends }
          defaultActive={ defaultActive }
          ref='menu'
          onSelect={ this.handleMenuSelect }
        >
          { this.aside.map(menu => createMenu.call(this, h, menu, 'aside', defaultActive)) }
        </el-menu>
        {
          this.aside.length === 0 && !this.asideCollapse
            ? <div class='ibps-layout-header-aside-menu-empty' flex='dir:top main:center cross:center'>
              <ibps-icon name='inbox'></ibps-icon>
              <span>{this.$t('layout.header-aside.menu-side.empty')}</span>
            </div>
            : null
        }
      </ibps-scrollbar>
    </div>
  },
  methods: {
    getDefaultActive() {
      const fullPath = this.$route.fullPath
      const asides = this.aside
      const paths = fullPath.split('/')
      const alias = paths[paths.length - 1]
      const flag = this.findAlias(asides, alias)
      if (flag) {
        return fullPath
      } else {
        return paths.splice(0, paths.length - 1).join('\/')
      }
    },
    findAlias(asides, alias) {
      if (this.$utils.isEmpty(asides)) {
        return false
      }
      for (let i = 0; i < asides.length; i++) {
        const aside = asides[i]
        if (alias === aside.alias) {
          return true
        }
        const flag = this.findAlias(aside.children, alias)
        if (flag) return flag
      }
    }
  },
  computed: {
    ...mapState('ibps/menu', [
      'aside',
      'asideCollapse',
      'defaultOpends',
      'asideTransition',
      'activeHeader'
    ])
  }
}
