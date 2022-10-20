const buttonShow = {
    bind(el, binding, vnode) {
        //当前节点
        var curNode = binding.value.curNode
            //当前节点对应的按钮类型
        var buttonType = binding.value.buttonType

        if (null == curNode.buttons || !curNode.buttons[buttonType]) {
            el.style.display = 'none'
        }
    },
    inserted: function(newValue, oldValue) {
        // 被绑定元素插入父节点时调用
    },
    update: function(newValue, oldValue) {
        // 根据获得的新值执行对应的更新
        // 对于初始值也会被调用一次
        if (null != oldValue.value) {
            var curNode = oldValue.value.curNode
                //当前节点对应的按钮类型
            var buttonType = oldValue.value.buttonType

            if (null == curNode.buttons || !curNode.buttons[buttonType]) {
                newValue.style.display = 'none'
            } else {
                newValue.style.display = ''
            }
        }
    },
    unbind: function() {
        // 做清理工作
        // 比如移除在 bind() 中添加的事件监听器
    }
}

const install = function(Vue) {
    Vue.directive('button-show', buttonShow)
}

if (window.Vue) {
    window['button-show'] = buttonShow
    window.Vue.use(install)
}

buttonShow.install = install
export default buttonShow
