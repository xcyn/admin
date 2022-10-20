export default {
  // Labels
  'Append {type}': '添加{type}',
  'Add Lane above': '在上方添加泳道',
  'Divide into two Lanes': '拆分为二泳道',
  'Divide into three Lanes': '拆分为三泳道',
  'Add Lane below': '在下方添加泳道',
  'Append compensation activity': '添加活动',
  'Change type': '改变类型',
  'Connect using Association': '连接使用',
  'Connect using Sequence/MessageFlow or Association': '连接',
  'Connect using DataInputAssociation': '连接',
  'TextAnnotation': '描述',
  'Remove': '删除',
  'Activate the hand tool': '抓手工具(H)',
  'Activate the lasso tool': '套索工具(L)',
  'Activate the create/remove space tool': '坐标工具(S)',
  'Activate the global connect tool': '连接工具(C)',
  'Create IntermediateThrowEvent/BoundaryEvent': '创建异常/边界事件',
  'Create expanded SubProcess': '创建内嵌子流程',
  'Create Pool/Participant': '创建泳道',
  'Parallel Multi Instance': '并行多实例',
  'Sequential Multi Instance': '串行多实例',
  'Loop': '回转',
  'Ad-hoc': '点对点',
  'Create {type}': '创建{type}',
  'Task': '任务',
  'Send Task': '发送消息任务',
  'SendTask': '发送消息任务',
  'Receive Task': '消息任务',
  'ReceiveTask': '消息任务', // '接收消息任务',
  'User Task': '用户任务',
  'UserTask': '用户任务',
  'Manual Task': '手动任务',
  'ManualTask': '手动任务',
  'Business Rule Task': '业务规则任务',
  'BusinessRuleTask': '业务规则任务',
  'Service Task': '服务任务',
  'ServiceTask': '服务任务',
  'Script Task': '脚本任务',
  'ScriptTask': '脚本任务',
  'CallActivity': '外部子流程',
  'Call Activity': '外部子流程',
  'Sub Process (collapsed)': '内嵌子流程',
  'Sub Process (expanded)': '内嵌子流程',
  'Process': '流程定义',
  'Start Event': '开始',
  'StartEvent': '开始',
  'Intermediate Throw Event': '异常事件',
  'IntermediateThrowEvent': '异常事件',
  'End Event': '结束',
  'EndEvent': '结束',
  'Message Start Event': '消息开始',
  'Timer Start Event': '定时器启动',
  'Conditional Start Event': '条件开始',
  'Signal Start Event': '开始信号',
  'Error Start Event': '错误开始',
  'Escalation Start Event': '升级开始',
  'Compensation Start Event': '补偿启动',
  'Message Start Event (non-interrupting)': '消息启动（不中断）',
  'Timer Start Event (non-interrupting)': '消息开始（不中断）',
  'Conditional Start Event (non-interrupting)': '条件开始（不中断）',
  'Signal Start Event (non-interrupting)': '开始信号（不中断）',
  'Escalation Start Event (non-interrupting)': '升级开始（不中断）',
  'Message Intermediate Catch Event': '消息中捕获事件',
  'Message Intermediate Throw Event': '消息中抛出事件',
  'Timer Intermediate Catch Event': '定时器中捕获事件',
  'Escalation Intermediate Throw Event': '升级中抛出事件',
  'Conditional Intermediate Catch Event': '条件中捕获事件',
  'Link Intermediate Catch Event': '链接中捕获事件',
  'Link Intermediate Throw Event': '链接中抛出事件',
  'Compensation Intermediate Throw Event': '信号中捕获事件',
  'Signal Intermediate Catch Event': '信号中捕获事件',
  'Signal Intermediate Throw Event': '信号中投掷事件',
  'Message End Event': '消息结束',
  'Escalation End Event': '升级结束',
  'Error End Event': '错误结束',
  'Cancel End Event': '取消结束',
  'Compensation End Event': '补偿结束',
  'Signal End Event': '信号结束',
  'Terminate End Event': '终止结束',
  'Message Boundary Event': '消息边界',
  'Message Boundary Event (non-interrupting)': '消息边界（不中断）',
  'Timer Boundary Event': '定时器边界',
  'Timer Boundary Event (non-interrupting)': '定时器边界（不中断）',
  'Escalation Boundary Event': '升级边界',
  'Escalation Boundary Event (non-interrupting)': '升级边界（不中断）',
  'Conditional Boundary Event': '有条件的边界',
  'Conditional Boundary Event (non-interrupting)': '有条件的边界（不中断）',
  'Error Boundary Event': '错误边界',
  'Cancel Boundary Event': '取消边界',
  'Signal Boundary Event': '信号边界',
  'Signal Boundary Event (non-interrupting)': '信号边界（不中断）',
  'Compensation Boundary Event': '补偿边界（不中断）',
  'Exclusive Gateway': '分支网关',
  'ExclusiveGateway': '分支网关',
  'Parallel Gateway': '同步网关',
  'ParallelGateway': '同步网关',
  'Inclusive Gateway': '条件同步网关',
  'InclusiveGateway': '条件同步网关',
  'Complex Gateway': '复杂网关',
  'Event based Gateway': '基于事件网关',
  'Transaction': '事务',
  'Sub Process': '子流程',
  'Event Sub Process': '事件子流程',
  'Collapsed Pool': '泳道（不带标题栏）',
  'Expanded Pool': '泳道（带标题栏）',

  // Errors
  'no parent for {element} in {parent}': '{parent}中的{element}没有父类',
  'no shape type specified': '没有指定形状类型',
  'flow elements must be children of pools/participants': '流动元素必须是泳道/参与者的子类',
  'out of bounds release': '释放外边界',
  'more than {count} child lanes': '超过 {count} 子通道',
  'element required': '必填',
  'diagram not part of bpmn:Definitions': '流程图不属于BPMN定义',
  'no diagram to display': '不能显示流程图',
  'no process or collaboration to display': '没有流程可显示',
  'element {element} referenced by {referenced}#{property} not yet drawn': '元素{element}被{referenced}#{property}引用，但没有被绘制',
  'already rendered {element}': '已渲染元素{element}',
  'failed to import {element}': '未能导入{element}',

  // properties-panel
  'General': '属性',
  'Id': '业务主键',
  'Name': '名称',
  'Details': '明细',
  'CallActivity Type': '外部子流程类型',
  'Called Element': '外部子流程',
  'Select': '选择',
  'Element must have an unique id.': '必须具有唯一的业务主键。',
  'Must provide a value': '必填',

  'Open minimap': '打开小地图',
  'Close minimap': '关闭小地图',

  'Colorize': '颜色',
  'None': '无样式',
  'Blue': '蓝',
  'Orange': '橙',
  'Green': '绿',
  'Red': '红',
  'Purple': '紫'
}
