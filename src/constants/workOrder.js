// 工单内容
export const woLabels = [
  {
    value: '01',
    label: '工序'
  },
  {
    value: '02',
    label: '物资材料'
  },
  {
    value: '03',
    label: '外包服务'
  },
  {
    value: '04',
    label: '工器具'
  },
  {
    value: '05',
    label: '工种'
  },
  {
    value: '06',
    label: '危险点'
  },
  {
    value: '07',
    label: '测量数据'
  },
  {
    value: '08',
    label: '技术记录'
  },
  {
    value: '09',
    label: '试运记录'
  },
  {
    value: '10',
    label: '成本汇总'
  },
  {
    value: '11',
    label: '签证单'
  },
  {
    value: '12',
    label: '不符合项'
  },
  {
    value: '13',
    label: '完工验收卡'
  },
  {
    value: '14',
    label: '安全许可及防护'
  }
];
// 路由跳地转址
export const jumpRouterUrl = {
  woOrder: {
    add: "woOrder-woReguWorkTaskAdd",
    update: "woOrder-woReguWorkTaskModify",
    view: "woOrder-woReguWorkTaskBrowse"
  },
  woStdOrder: {
    add: "woOrder-woStdAdd",
    update: "woOrder-woStdModify",
    view: "woOrder-woStdBrowse"
  },
  woMtnReport: {
    add: "woOrder-woOhRptAdd",
    update: "woOrder-woOhRptModify",
    view: "woOrder-woOhRptBrowse"
  }
};
/**
 * 工单信息
 */
// 工序-质检点
export const isQualityPoints = [
  { key: "W", value: "W" },
  { key: "H", value: "H" }
]

export const isSafeQualityPoints = [
  { key: "S1", value: "S1" },
  { key: "S2", value: "S2" },
  { key: "S3", value: "S3" },
]

// 物资材料-类型
export const partOrMaterials = {
  "0": "备件",
  "1": "材料"
}
// 测量标准-检查方法
export const inspMethods = [
  { key: 0, value: "观察" }, { key: 1, value: "仪测" }
]
// 测量标准-检查状态
export const actualLocaStatuss = {
  "0": "运行",
  "1": "停止",
  "2": "备用"
}
// 测量标准-检查结果
export const execResults = {
  0: "正常",
  1: "异常"
}
/**
 * 标准工单
 */
// 适用设备-适用对象类型
export const objectTypes = {
  "1": "设备位置",
  "2": "设备类型"
}

// 业务流程状态
export const busStates = {
  "nd": "拟定",
  "qd": "启动",
  "sh": "审核",
  "zx": "执行",
  "ys": "验收",
  "gb": "关闭",
  "js": "结束"
}
