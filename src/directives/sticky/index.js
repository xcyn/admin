// Sticky header, 当页面滚动到预设的位置会吸附在顶部
import { throttle } from 'lodash'
import PopupManager from '@/utils/popup'

let listenAction = null
const ibpsSticky = {
  inserted(el, binding) {
    const params = binding.value || {}
    const stickyTop = params.stickyTop || 0

    const zIndex = params.zIndex || PopupManager.getZIndex()

    // const width = params.width || '100%'
    const elStyle = el.style

    elStyle.position = '-webkit-sticky'
    elStyle.position = 'sticky'
    // if the browser support css sticky（Currently Safari, Firefox and Chrome Canary）
    // if (~elStyle.position.indexOf('sticky')) {
    //     elStyle.top = `${stickyTop}px`;
    //     elStyle.zIndex = zIndex;
    //     return
    // }
    const elHeight = el.getBoundingClientRect().height
    const elWidth = el.getBoundingClientRect().width - 10
    elStyle.cssText = `top: ${stickyTop}px; z-index: ${zIndex};`

    const parentElm = el.parentNode || document.documentElement
    const placeholder = document.createElement('div')
    placeholder.style.display = 'none'
    placeholder.style.width = `${elWidth}px`
    placeholder.style.height = `${elHeight}px`
    placeholder.setAttribute('class', 'hidden-print')
    parentElm.insertBefore(placeholder, el)

    let active = false

    const getScroll = (target, top) => {
      const prop = top ? 'pageYOffset' : 'pageXOffset'
      const method = top ? 'scrollTop' : 'scrollLeft'
      let ret = target[prop]
      if (typeof ret !== 'number') {
        ret = window.document.documentElement[method]
      }
      return ret
    }

    const sticky = () => {
      if (active) {
        return
      }
      if (!elStyle.height) {
        elStyle.height = `${el.offsetHeight}px`
      }

      elStyle.position = 'fixed'
      elStyle.width = `${elWidth + 10}px`
      placeholder.style.display = 'inline-block'
      active = true
    }

    const reset = () => {
      if (!active) {
        return
      }

      elStyle.position = ''
      placeholder.style.display = 'none'
      active = false
    }

    const check = () => {
      elStyle.zIndex = PopupManager.getZIndex()
      const scrollTop = getScroll(window, true)
      const offsetTop = el.getBoundingClientRect().top
      if (offsetTop === 0) { return }
      if (offsetTop < stickyTop) {
        sticky()
      } else {
        if (scrollTop < elHeight + stickyTop) {
          reset()
        }
      }
    }
    listenAction = () => {
      check()
    }
    check()

    window.addEventListener('scroll', throttle(listenAction, 1000), true)
  },

  unbind() {
    if (listenAction) {
      window.removeEventListener('scroll', throttle(listenAction, 1000))
      listenAction = null
    }
  }
}

const install = function(Vue) {
  Vue.directive('sticky', ibpsSticky)
}

if (window.Vue) {
  window['sticky'] = ibpsSticky
  window.Vue.use(install)
}

ibpsSticky.install = install

export default ibpsSticky
