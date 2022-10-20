import Vue from 'vue';
import { createLocalVue, mount } from '@vue/test-utils';
import ElementUI from 'element-ui';

import TreeSelect from '../index';

const localVue = createLocalVue();
localVue.use(ElementUI);

/** 测试数据，请勿随意改动 */
const options = [
  {
    id: 1,
    label: '一级 1',
    value: '1',
    children: [{
      id: 11,
      label: '二级 1-1',
      value: '1-1',
      children: [{
        id: 111,
        label: '三级 1-1',
        value: '1-1-1'
      }]
    }]
  },
  {
    id: 2,
    label: '一级 2',
    value: '2',
    children: [{
      id: 21,
      label: '二级 2-1',
      value: '2-1'
    }, {
      id: 22,
      label: '二级 2-2',
      value: '2-2'
    }]
  },
  {
    id: 3,
    label: '一级 3',
    value: '3',
    children: [{
      id: 31,
      label: '二级 3-1',
      value: '3-1'
    }, {
      id: 32,
      label: '二级 3-2',
      value: '3-2'
    }]
  }
];

/**
 * @author 管超
 */
describe('sac-tree-select', () => {
  it('匹配初始快照', () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue });
    // assert
    expect(wrapper).toMatchSnapshot();
  });

  it('设置 disabled 时，组件能够正确处理是否被禁用', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue });
    const inputBox = wrapper.find('.select input');
    // action - true
    wrapper.setProps({ disabled: true });
    await Vue.nextTick();
    // assert
    expect(inputBox.attributes('disabled')).toBeDefined();
    // action - false
    wrapper.setProps({ disabled: false });
    await Vue.nextTick();
    // assert
    expect(inputBox.attributes('disabled')).toBeUndefined();
  });

  it('设置 placeholder 时，组件应该显示对应的内容', () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { placeholder: '输入提示' } });
    // assert
    const inputBox = wrapper.find('.select input');
    expect(inputBox.attributes('placeholder')).toBe('输入提示');
  });

  it('设置 size 时，能够渲染正确的样式', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue });
    // assert - medium is default
    const inputBox = wrapper.find('.select .el-input');
    expect(inputBox.classes()).toContain('el-input--medium');
    // act - large
    wrapper.setProps({ size: 'large' });
    await Vue.nextTick();
    // assert
    expect(inputBox.classes()).toContain('el-input--large');
    // act - small
    wrapper.setProps({ size: 'small' });
    await Vue.nextTick();
    // assert
    expect(inputBox.classes()).toContain('el-input--small');
    // act - mini
    wrapper.setProps({ size: 'mini' });
    await Vue.nextTick();
    // assert
    expect(inputBox.classes()).toContain('el-input--mini');
  });

  it('设置 multiple 时，能够正确显示树组件节点前的复选框', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options: options, defaultExpandAll: true } });
    // assert - true
    wrapper.setProps({ multiple: true });
    await Vue.nextTick();
    // expect
    expect(wrapper.findAll('.tree [type="checkbox"]').length).toBe(9);
    // assert - false
    wrapper.setProps({ multiple: false });
    await Vue.nextTick();
    // expect
    expect(wrapper.findAll('.tree [type="checkbox"]').length).toBe(0);
  });

  it('点击下拉输入框时，下拉框能够展开', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options } });
    // assert - dropdown is hidden default
    const dropdown = wrapper.find('.el-select-dropdown');
    expect(dropdown.attributes('style')).toMatch('display: none;');
    // act
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // assert - dropdown is shown
    expect(dropdown.attributes('style')).not.toMatch('display: none;');
  });

  it('再次点击下拉输入框时，下拉框会收缩', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options } });
    // act
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    selectBox.trigger('click');
    await Vue.nextTick();
    // assert
    const dropdown = wrapper.find('.el-select-dropdown');
    // 在这里，我们不能通过 style 进行判断，问题详见 https://vue-test-utils.vuejs.org/guides/#common-tips Mocking Transitions
    expect(dropdown.classes()).toContain('el-zoom-in-top-leave');
  });

  it('点击树节点时，不会展开下属子节点', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options } });
    // act - 展开下拉选择框
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 选择其中一个节点点击（根据传递的数据以及第一个被选中的节点可以判断，这个节点下是存在子节点的）
    const treeNode = wrapper.find('.tree .el-tree-node');
    treeNode.trigger('click');
    await Vue.nextTick();
    // assert
    const treeNodeChildren = treeNode.find('.el-tree-node__children');
    expect(treeNodeChildren.exists()).toBeFalsy();
  });

  it('点击树节点旁边的展开图表时，能够展开下属子节点', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options } });
    // act - 展开下拉选择框
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 选择其中一个节点点击（根据传递的数据以及第一个被选中的节点可以判断，这个节点下是存在子节点的）
    const treeNode = wrapper.find('.tree .el-tree-node');
    const treeNodeExpandIcon = treeNode.find('.el-tree-node__expand-icon');
    treeNodeExpandIcon.trigger('click');
    await Vue.nextTick();
    // assert
    const treeNodeChildren = treeNode.find('.el-tree-node__children');
    expect(treeNodeChildren.exists()).toBeTruthy();
  });

  it('点击树节点时，能够触发节点点击处理函数', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options } });
    const fn = jest.fn();
    wrapper.vm.handleTreeNodeClick = fn;
    // act - 展开下拉选择框
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 选择第一个节点点击
    const treeNodes = wrapper.findAll('.tree .el-tree-node');
    treeNodes.at(0).trigger('click');
    await Vue.nextTick();
    // assert
    expect(fn).toHaveBeenCalledTimes(1);
    expect(treeNodes.at(0).find('.el-tree-node__label').text()).toBe(fn.mock.calls[0][0].label);
    // act - 选择第二个节点点击
    treeNodes.at(1).trigger('click');
    await Vue.nextTick();
    // assert
    expect(fn).toHaveBeenCalledTimes(2);
    expect(treeNodes.at(1).find('.el-tree-node__label').text()).toBe(fn.mock.calls[1][0].label);
  });

  it('单选时，点击树节点，下拉框会收缩', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options } });
    // act - 展开下拉选择框
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 点击树节点并点击
    const treeNode = wrapper.find('.tree .el-tree-node');
    treeNode.trigger('click');
    await Vue.nextTick();
    // assert
    const dropdown = wrapper.find('.el-select-dropdown');
    // 在这里，我们不能通过 style 进行判断，问题详见 https://vue-test-utils.vuejs.org/guides/#common-tips Mocking Transitions
    expect(dropdown.classes()).toContain('el-zoom-in-top-leave');
  });

  it('多选时，点击树节点，下拉框不会收缩', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options, multiple: true } });
    // act - 展开下拉选择框
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 点击树节点
    const treeNode = wrapper.find('.tree .el-tree-node');
    treeNode.trigger('click');
    await Vue.nextTick();
    // assert
    const dropdown = wrapper.find('.el-select-dropdown');
    // 在这里，我们不能通过 style 进行判断，问题详见 https://vue-test-utils.vuejs.org/guides/#common-tips Mocking Transitions
    expect(dropdown.classes()).not.toContain('el-zoom-in-top-leave');
  });

  it('单选时，点击每一个树节点，下拉输入框能够正确显示所选节点名称，并触发 input 事件', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options } });
    // act - 展开下拉选择框
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 选择第一个树节点并点击
    const treeNodes = wrapper.findAll('.tree .el-tree-node');
    treeNodes.at(0).trigger('click');
    await Vue.nextTick();
    // assert
    expect(wrapper.emitted().input[0][0]).toBe(options[0].value);
    const selectInput = wrapper.find('.select input');
    expect(selectInput.element.value).toBe(options[0].label);
    // act - 再次展开下拉选择框
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 选择第二个树节点并点击
    treeNodes.at(1).trigger('click');
    await Vue.nextTick();
    // assert
    expect(wrapper.emitted().input[1][0]).toBe(options[1].value);
    expect(selectInput.element.value).toBe(options[1].label);
  });

  it('单选选中的情况下，执行清除操作，会清除选中，并触发 input 事件', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options } });
    // act - 展开下拉选择框
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 选择第一个树节点并点击
    const treeNodes = wrapper.findAll('.tree .el-tree-node');
    treeNodes.at(0).trigger('click');
    await Vue.nextTick();
    // act - 执行清除操作
    wrapper.vm.clear();
    // assert
    expect(wrapper.vm.tags).toBeNull();
    expect(wrapper.emitted().input[1][0]).toBeNull();
  });

  it('单选时，外部设置默认选中的值时，下拉输入框能够正确显示所选节点名称', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options, value: options[0].value } });
    await Vue.nextTick();
    // assert
    const selectInput = wrapper.find('.select input');
    expect(selectInput.element.value).toBe(options[0].label);
  });

  it('多选时，点击节点前的复选框，下拉输入框能够正确显示所选节点名称，并触发 input 事件', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options, multiple: true, checkStrictly: true } });
    // act - 展开下拉选择框
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 勾选第一个复选框
    const checkBoxes = wrapper.findAll('.tree [type="checkbox"]');
    checkBoxes.at(0).trigger('click');
    await Vue.nextTick();
    // assert
    expect(wrapper.findAll('.el-tag').length).toBe(1);
    expect(wrapper.emitted().input[0][0]).toEqual([options[0].value]);
    // act - 勾选第二个复选框
    checkBoxes.at(1).trigger('click');
    await Vue.nextTick();
    // assert
    expect(wrapper.findAll('.el-tag').length).toBe(2);
    expect(wrapper.emitted().input[1][0]).toEqual([options[0].value, options[1].value]);
  });

  it('多选选中的情况下，执行清除操作，会清除选中，并触发 input 事件', async () => {
    // setup
    const wrapper = mount(TreeSelect, { localVue, propsData: { options, multiple: true, checkStrictly: true } });
    // act - 展开下拉选择框
    const selectBox = wrapper.find('.select .el-input');
    selectBox.trigger('click');
    await Vue.nextTick();
    // act - 依次勾选三个复选框
    const checkBoxes = wrapper.findAll('.tree [type="checkbox"]');
    checkBoxes.at(0).trigger('click');
    await Vue.nextTick();
    checkBoxes.at(1).trigger('click');
    await Vue.nextTick();
    checkBoxes.at(2).trigger('click');
    await Vue.nextTick();
    // assert
    expect(wrapper.findAll('.el-tag.v-enter').length).toBe(3);
    // act - 点击第一个标签的关闭图标
    wrapper.find('.select .el-tag__close').trigger('click');
    await Vue.nextTick();
    // assert
    expect(wrapper.findAll('.el-tag.v-enter').length).toBe(2);
    expect(wrapper.emitted().input[3][0]).toEqual([options[1].value, options[2].value]);
    // act - 执行清除操作
    wrapper.vm.clear();
    // assert
    expect(wrapper.vm.tags).toEqual([]);
    expect(wrapper.emitted().input[4][0]).toEqual([]);
  });

  it('单选时，外部设置默认选中的值时，下拉输入框能够正确显示所选节点名称', async () => {
    // setup
    const wrapper = mount(TreeSelect, {
      localVue,
      propsData: {
        options,
        multiple: true,
        checkStrictly: true,
        value: [options[0].value, options[2].value]
      }
    });
    await Vue.nextTick();
    // assert
    expect(wrapper.findAll('.el-tag').length).toBe(2);
  });
});
