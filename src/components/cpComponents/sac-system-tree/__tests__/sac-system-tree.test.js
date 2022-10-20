import Vue from 'vue';
import { createLocalVue, mount } from '@vue/test-utils';
import ElementUI from 'element-ui';
import VueRx from 'vue-rx';

import Tree from '../index';

const localVue = createLocalVue();
localVue.use(ElementUI);
localVue.use(VueRx);

jest.useFakeTimers();

/** 测试数据，请勿随意改动 */
const data = [
  {
    id: 1,
    label: '一级 1',
    children: [{
      id: 11,
      label: '二级 1-1',
      children: [{
        id: 111,
        label: '三级 1-1'
      }]
    }]
  },
  {
    id: 2,
    label: '一级 2',
    children: [{
      id: 21,
      label: '二级 2-1'
    }, {
      id: 22,
      label: '二级 2-2'
    }]
  },
  {
    id: 3,
    label: '一级 3',
    children: [{
      id: 31,
      label: '二级 3-1'
    }, {
      id: 32,
      label: '二级 3-2'
    }]
  }
];

/**
 * @author 管超
 */
describe('sac-system-tree', () => {
  it('匹配默认快照', () => {
    // setup
    const wrapper = mount(Tree, { localVue });
    // assert
    expect(wrapper).toMatchSnapshot();
  });

  it('设置 filterable 时，显示过滤输入框', async () => {
    // setup
    const wrapper = mount(Tree, { localVue });
    // act
    wrapper.setProps({ filterable: true });
    await Vue.nextTick();
    // assert
    const filterBox = wrapper.find('.filter-box');
    expect(filterBox.exists()).toBeTruthy();
  });

  it('设置 size 时，能够正确显示对应样式', async () => {
    // setup
    const wrapper = mount(Tree, { localVue, propsData: { filterable: true } });
    const filterBox = wrapper.find('.filter-box');
    // assert - default is small
    expect(filterBox.classes('el-input--small')).toBeTruthy();
    // act - large
    wrapper.setProps({ size: 'large' });
    await Vue.nextTick();
    // assert
    expect(filterBox.classes('el-input--large')).toBeTruthy();
    // act - mini
    wrapper.setProps({ size: 'mini' });
    await Vue.nextTick();
    // assert
    expect(filterBox.classes('el-input--mini')).toBeTruthy();
  });

  it('未设置 default-expand-all 时，仅渲染根节点', async () => {
    // setup
    const wrapper = mount(Tree, { localVue });
    // act
    wrapper.setProps({ data });
    await Vue.nextTick();
    // assert
    const tree = wrapper.find('.tree');
    // 仅渲染了根节点
    expect(tree.findAll('.el-tree-node').length).toBe(3);
  });

  it('设置 default-expand-all 时，能渲染所有节点', async () => {
    // setup
    // WARNING: default-expand-all must be initialized firstly
    const wrapper = mount(Tree, { localVue, propsData: { defaultExpandAll: true } });
    // act
    wrapper.setProps({ data });
    await Vue.nextTick();
    // assert
    const tree = wrapper.find('.tree');
    // 每个节点下都有一个子节点
    expect(tree.findAll('.el-tree-node__children[aria-expanded="true"]').length).toBe(9);
  });

  it('输入框值发生变更后，250 毫秒后触发变更处理函数', async () => {
    // setup
    const wrapper = mount(Tree, { localVue, propsData: { filterable: true } });
    const fn = jest.fn();
    wrapper.vm.handleFilterBoxChange = fn;
    // act
    const filterBoxNode = wrapper.find('.filter-box').find('input');
    filterBoxNode.setValue('test');
    await Vue.nextTick();
    // assert
    expect(fn).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(250);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('输入过滤内容，能够完成过滤功能', async () => {
    // setup
    const wrapper = mount(Tree, {
      localVue,
      propsData: { data, defaultExpandAll: true, filterable: true }
    });
    // act
    const filterBoxNode = wrapper.find('.filter-box').find('input');
    filterBoxNode.setValue('三级');
    await Vue.nextTick(); // 触发输入框页面绘制
    jest.advanceTimersByTime(250);
    await Vue.nextTick(); // 快进后，执行搜索，触发树组件绘制
    // assert
    const tree = wrapper.find('.tree');
    expect(tree.findAll('.is-hidden').length).toBe(6);
    // act
    filterBoxNode.setValue('');
    await Vue.nextTick(); // 触发输入框页面绘制
    jest.advanceTimersByTime(250);
    await Vue.nextTick(); // 快进后，执行搜索，触发树组件绘制
    // assert
    expect(tree.findAll('.is-hidden').length).toBe(0);
  });

  it('点击树节点，能够触发正确的 node-click 事件', async () => {
    // setup
    const wrapper = mount(Tree, {
      localVue,
      propsData: { data, defaultExpandAll: true, filterable: true }
    });
    // act
    const firstTreeNode = wrapper.find('.tree .el-tree-node');
    firstTreeNode.trigger('click');
    // assert
    expect(wrapper.emitted()['node-click'][0][0]).toEqual(data[0]);
  });
});
