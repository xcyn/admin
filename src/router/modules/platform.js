import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
const meta = { auth: false }
export default {
  path: '/platform',
  name: 'platform',
  meta,
  redirect: { name: 'platform-index' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'pendingItems', name: `${pre}pending`, component: _import('platform/office/bpmReceivedProcess/pendingManage/pending'), meta: { ...meta, name: `${pre}pending`, title: '待办事务' } },
    // { path: 'message', name: `${pre}message`, component: _import('platform/message/inner/receive'), meta: { ...meta, name: `${pre}message`, title: '已收消息列表' } }
    { path: 'pendingExtend', name: `${pre}pendingExtend`, component: _import('platform/office/bpmReceivedProcess/pendingManage/pendingExtend'), meta: { ...meta, name: `${pre}pendingExtend`, title: '待办事宜' } },
  ])('platform-')
}
