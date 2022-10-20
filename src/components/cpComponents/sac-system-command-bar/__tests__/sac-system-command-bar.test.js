import Vue from 'vue';
import { createLocalVue, mount } from '@vue/test-utils';
import ElementUI from 'element-ui';
import CommandBar from '../index';

const localVue = createLocalVue();
localVue.use(ElementUI);

/**
 * @author 管超
 */
describe('sac-system-command-bar', () => {
  it('匹配默认快照', () => {
    // setup
    const wrapper = mount(CommandBar, { localVue });
    // assert
    expect(wrapper).toMatchSnapshot();
  });

  it('没有传入 title 属性时，不应该渲染标题节点', () => {
    // setup
    const wrapper = mount(CommandBar, { localVue });
    // assert
    const titleNode = wrapper.find('.title');
    expect(titleNode.exists()).toBeFalsy();
  });

  it('传入 title 属性时，渲染标题节点并显示其值', async () => {
    // setup
    const wrapper = mount(CommandBar, { localVue });
    // act
    wrapper.setProps({ title: '标题' });
    await Vue.nextTick();
    // assert
    const titleNode = wrapper.find('.title');
    expect(titleNode.exists()).toBeTruthy();
    expect(titleNode.text()).toMatch('标题');
  });

  it('初始状态时，搜索框内容为空', () => {
    // setup
    const wrapper = mount(CommandBar, { localVue });
    // assert
    expect(wrapper.vm.search).toBe('');
  });

  it('搜索框中数据发生变化，搜索数据跟着变化', () => {
    // setup
    const wrapper = mount(CommandBar, { localVue });
    // act
    const searchBox = wrapper.find('.search-box').find('input');
    searchBox.setValue('  搜索  ');
    // assert
    expect(wrapper.vm.search).toBe('  搜索  ');
  });

  it('初始状态时，搜索按钮处于禁用状态，且点击无法触发搜索事件', () => {
    // setup
    const wrapper = mount(CommandBar, { localVue });
    // act
    const searchBtn = wrapper.find('.search-btn').find('button');
    searchBtn.trigger('click');
    // assert
    expect(searchBtn.attributes('disabled')).toBeDefined();
    expect(wrapper.emitted().search).toBeFalsy();
  });

  it('搜索框中存在值时，搜索按钮处于启用状态，且点击触发搜索事件', async () => {
    // setup
    const wrapper = mount(CommandBar, { localVue });
    // act
    const searchBox = wrapper.find('.search-box').find('input');
    searchBox.setValue('  搜索  ');
    await Vue.nextTick();
    // assert
    const searchBtn = wrapper.find('.search-btn');
    expect(searchBtn.attributes('disabled')).toBeUndefined();
    // act
    searchBtn.trigger('click');
    // assert
    expect(wrapper.emitted().search).toBeTruthy();
    expect(wrapper.emitted().search[0][0]).toBe('搜索');
  });

  it('点击添加按钮，触发添加事件', () => {
    // setup
    const wrapper = mount(CommandBar, { localVue });
    // act
    const addBtn = wrapper.find('.add-btn').find('button');
    addBtn.trigger('click');
    // assert
    expect(wrapper.emitted().add).toBeTruthy();
  });

  it('点击刷新按钮，触发刷新事件', () => {
    // setup
    const wrapper = mount(CommandBar, { localVue });
    // act
    const addBtn = wrapper.find('.refresh-btn').find('button');
    addBtn.trigger('click');
    // assert
    expect(wrapper.emitted().refresh).toBeTruthy();
  });
});
