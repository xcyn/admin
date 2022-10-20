<template>
  <z-dialog-table ref="locationDTable" :title="locationDialogProp.title" :toolbarProp="locationDialogProp.toolbarProp" :tableProp="locationDialogProp.tableProp" :selectionHandle="locationDialogProp.selectionHandle" :treeProp="locationDialogProp.treeProp" @toolbar-search="onSearch" @tree-click="onTreeClick" @ok="onLocationDTableOk" @on-reset="resetCon">
    <template slot="searchBar">
      <el-form-item label="对象编码">
        <el-input v-model="locationDialogProp.toolbarProp.searchData.manage_obj_no"></el-input>
      </el-form-item>
      <el-form-item label="对象名称">
        <el-input v-model="locationDialogProp.toolbarProp.searchData.manage_obj_name"></el-input>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import {queryTreeData,queryDataTable} from '@/api/platform/data/dataTemplate'
export default {
  name: 'asset-dialog-select',
  props: { // String Number Boolean Array Object Function || validator (value) {}
    fatherMethod: { // 父组件传过来的方法 fatherMethod
      type: Function,
      required: false,
      default: function () { }
    },
    multipleSelect: {
      type: Boolean,
      default: true
    },
    conStr: {
      type: String,
      default: ''
    },
    p_manage_obj_id: {
      type: String
    },
    manage_obj_no: {
      type: String
    },
    manage_obj_name: {
      type: String
    },
    initParam: {//初始化查询条件
			type: Object,
			default: null
		}
  },
  data () {
    return {
      selectData: {},
      pageNo: 1,
      curChange: false,
      // 弹出属性
      locationDialogProp: {
        title: '管控对象',
        key: 'id',
        selectionHandle: this.selectionHandle,
        toolbarProp: {
          // 搜索数据
          searchData: {
            p_manage_obj_id: '',
            manage_obj_no: '',
            manage_obj_name: '',
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [ // 显示列
            {
              title: '上级对象Id',
              key: 'p_manage_obj_id',
              show:false
            },
            {
              title: '对象编码',
              key: 'manage_obj_no'
            },
            {
              title: '对象名称',
              key: 'manage_obj_name'
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: '管控对象',
          nodeKey: '',
          clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
          multipleSelect: false,
          treeData: this.dialogloadTreeData,
          lazyLoad: true,
          propMapping: { // 根据返回值的映射
            label: 'p_manage_obj_id',
            //children: 'son'
          }
        }
      }
    };
  },
  methods: {
    selectLocationGrid (selected) {
      this.$refs.locationDTable.open(selected);
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.locationDTable.tableQuery();
        }, 600);
      });
    },
    initTableData (param) {
      var param_ = {}
      if (null === param.parameters || undefined === param.parameters) {
        param_ = {

          parameters: [
            {
              "key": "response_data",
              "value": "{\"template_id\":\"740584180143882240\",\"template_type\":\"\",\"attrs\":{\"init_query\":\"Y\",\"need_page\":\"Y\",\"page_size\":20,\"display_field\":\"N\",\"manage_effect\":\"N\",\"indexRow\":true},\"display_columns\":[{\"label\":\"编码\",\"name\":\"manage_obj_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"default_value_type\":\"fixed\",\"required\":true,\"placeholder\":\"请输入\",\"mobile\":true,\"display\":true},\"data_type\":\"varchar\"},{\"label\":\"名称\",\"name\":\"manage_obj_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"default_value_type\":\"fixed\",\"required\":true,\"placeholder\":\"请输入\",\"mobile\":true,\"display\":true},\"data_type\":\"varchar\"},{\"label\":\"公司\",\"name\":\"company_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"customDialog\",\"field_options\":{\"default_value_type\":\"dynamic\",\"placeholder\":\"请选择\",\"multiple\":\"N\",\"store\":\"id\",\"dialog_type\":\"dialog\",\"icon\":\"search-plus\",\"required\":true,\"hide_rights\":false,\"read_rights\":false,\"is_width\":false,\"width\":100,\"width_unit\":\"%\",\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"mobile\":true,\"display\":true,\"dialog\":\"gsdhk\",\"default_value\":\"cscript.getOrgByCurrentUser()\",\"link_linkage\":null,\"link_config\":null,\"link_condition\":null,\"link_attr\":null},\"data_type\":\"varchar\"},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":false,\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"},\"data_type\":\"varchar\"}],\"orig_display_columns\":[{\"label\":\"编码\",\"name\":\"manage_obj_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"selector_type\":\"user\",\"number_type\":\"orig\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"store\":\"id\",\"dictionary\":\"\"}},{\"label\":\"名称\",\"name\":\"manage_obj_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"selector_type\":\"user\",\"number_type\":\"orig\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"store\":\"id\",\"dictionary\":\"\"}},{\"label\":\"公司\",\"name\":\"company_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"selector_type\":\"user\",\"number_type\":\"orig\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"store\":\"id\",\"dictionary\":\"\"}},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":false,\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"}}],\"result_columns\":[{\"label\":\"对象名称\",\"name\":\"manage_obj_name\"},{\"label\":\"唯一标识\",\"name\":\"manage_obj_id\"},{\"label\":\"公司代码\",\"name\":\"company_id\"},{\"label\":\"is_on\",\"name\":\"is_on\"}],\"sort_columns\":\"\",\"buttons\":{\"function_buttons\":[{\"button_type\":\"add\",\"label\":\"新增\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"remove\",\"label\":\"删除\",\"position\":\"manage\"},{\"button_type\":\"edit\",\"label\":\"修改\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"detail\",\"label\":\"浏览\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"}],\"edit_buttons\":[{\"button_type\":\"close\",\"label\":\"关闭\"},{\"button_type\":\"save\",\"label\":\"保存\"}]},\"export_columns\":\"\",\"datasetKey\":\"form_ManagementObjectCode\",\"unique\":\"manage_obj_id\"}"
            },
            {
              "key": "filter_condition_key",
              "value": ""
            }
          ],
          requestPage: {
            limit: 20,
            pageNo: this.pageNo
          }
        }
      } else {
        param_ = param;
      }

      console.log('param_',param_);
      return queryDataTable(param_);
    },
    onSearch (params) {
      console.log('--------搜索条件--------', params);
      let param = {
        parameters: [
          {
            "key": "response_data",
            "value": "{\"template_id\":\"740584180143882240\",\"template_type\":\"\",\"attrs\":{\"init_query\":\"Y\",\"need_page\":\"Y\",\"page_size\":20,\"display_field\":\"N\",\"manage_effect\":\"N\",\"indexRow\":true},\"display_columns\":[{\"label\":\"编码\",\"name\":\"manage_obj_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"default_value_type\":\"fixed\",\"required\":true,\"placeholder\":\"请输入\",\"mobile\":true,\"display\":true},\"data_type\":\"varchar\"},{\"label\":\"名称\",\"name\":\"manage_obj_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"default_value_type\":\"fixed\",\"required\":true,\"placeholder\":\"请输入\",\"mobile\":true,\"display\":true},\"data_type\":\"varchar\"},{\"label\":\"公司\",\"name\":\"company_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"customDialog\",\"field_options\":{\"default_value_type\":\"dynamic\",\"placeholder\":\"请选择\",\"multiple\":\"N\",\"store\":\"id\",\"dialog_type\":\"dialog\",\"icon\":\"search-plus\",\"required\":true,\"hide_rights\":false,\"read_rights\":false,\"is_width\":false,\"width\":100,\"width_unit\":\"%\",\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"mobile\":true,\"display\":true,\"dialog\":\"gsdhk\",\"default_value\":\"cscript.getOrgByCurrentUser()\",\"link_linkage\":null,\"link_config\":null,\"link_condition\":null,\"link_attr\":null},\"data_type\":\"varchar\"},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":false,\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"},\"data_type\":\"varchar\"}],\"orig_display_columns\":[{\"label\":\"编码\",\"name\":\"manage_obj_no\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"selector_type\":\"user\",\"number_type\":\"orig\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"store\":\"id\",\"dictionary\":\"\"}},{\"label\":\"名称\",\"name\":\"manage_obj_name\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"selector_type\":\"user\",\"number_type\":\"orig\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"store\":\"id\",\"dictionary\":\"\"}},{\"label\":\"公司\",\"name\":\"company_id\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"selector_type\":\"user\",\"number_type\":\"orig\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"store\":\"id\",\"dictionary\":\"\"}},{\"label\":\"状态\",\"name\":\"is_on\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":false,\"width\":\"\",\"same\":\"N\",\"field_type\":\"dictionary\",\"field_options\":{\"dictionary\":\"status\"}}],\"result_columns\":[{\"label\":\"对象名称\",\"name\":\"manage_obj_name\"},{\"label\":\"唯一标识\",\"name\":\"manage_obj_id\"},{\"label\":\"公司代码\",\"name\":\"company_id\"},{\"label\":\"is_on\",\"name\":\"is_on\"}],\"sort_columns\":\"\",\"buttons\":{\"function_buttons\":[{\"button_type\":\"add\",\"label\":\"新增\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"remove\",\"label\":\"删除\",\"position\":\"manage\"},{\"button_type\":\"edit\",\"label\":\"修改\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"},{\"button_type\":\"detail\",\"label\":\"浏览\",\"rights\":[{\"type\":\"all\"}],\"position\":\"all\"}],\"edit_buttons\":[{\"button_type\":\"close\",\"label\":\"关闭\"},{\"button_type\":\"save\",\"label\":\"保存\"}]},\"export_columns\":\"\",\"datasetKey\":\"form_ManagementObjectCode\",\"unique\":\"manage_obj_id\"}"
          },
          {
            "key": "filter_condition_key",
            "value": ""
          }
        ],
        requestPage: {
          limit: 20,
          pageNo: this.pageNo
        }
      }
      if (params.manage_obj_no != null && params.manage_obj_no !== '') {
        param.parameters.push({ key: 'Q^manage_obj_no^SL', value: this.locationDialogProp.toolbarProp.searchData.manage_obj_no })
      }
      if (params.manage_obj_name != null && params.manage_obj_name !== '') {
        param.parameters.push({ key: 'Q^manage_obj_name^SL', value: this.locationDialogProp.toolbarProp.searchData.manage_obj_name })
      }
      // 加载列表数据
      //return queryDataTable(param);
      this.$refs.locationDTable.tableQuery(param);
    },
    reloadTable (param_obj) {
      //if (null != param_obj) param.push(param_obj);
      this.$refs.locationDTable.tableQuery(param_obj);
    },
    dialogPaginationHandle (pagination) {
      this.pageNo = pagination.pageNo
      console.log('--------分页事件--------', pagination);
      return { requestPage: pagination };
    },
    /**
       * 处理勾选数据展示
       */
    selectionHandle (selection) {
      console.log('--------弹出框勾选数据--------', selection);
      return selection.manage_obj_name;
    },
    /**
       * 弹出表格确定事件
       */
    onLocationDTableOk (seleted) {
      console.log('--------弹出表格确定事件--------', seleted);
      let locaIds = '';
      let locaNos = '';
      let locaNames = '';
      for (let index in seleted) {

        locaNames += (seleted[index]['column']['manage_obj_name'] || '') + ',';
        locaIds += (seleted[index]['column']['p_manage_obj_id'] || '') + ',';
        locaNos += (seleted[index]['column']['manage_obj_no'] || '') + ',';
      }
      if (locaNames.lastIndexOf(',') !== -1) {
        locaNames = locaNames.substring(0, locaNames.length - 1);
      }
      if (locaIds.lastIndexOf(',') !== -1) {
        locaIds = locaIds.substring(0, locaIds.length - 1);
      }
      if (locaNos.lastIndexOf(',') !== -1) {
        locaNos = locaNos.substring(0, locaNos.length - 1);
      }
      this.selectData = {
        ids: locaIds,
        names: locaNames,
        nos:locaNos,
        seleted: seleted
      }
      this.fatherMethod(this.selectData);
    },
    init () {
      let selected = {
        key: 'locaId',
        data: []
      }
      if(this.manage_obj_no != undefined && this.manage_obj_name != undefined) {
				let size = this.manage_obj_no.split(',').length;
				for (var i = 0; i < size; i++) {
					selected.data.push({ manage_obj_no: this.manage_obj_no.split(',')[i], text: this.manage_obj_name.split(',')[i] });
				}
			}
      this.selectLocationGrid(selected);
    },
    /**
       * 树节点点击事件处理
       * 返回 对象，用于表单查询条件
       * 返回 null 不进行查询，可自定义一些处理
       */
    onTreeClick (node) {
      console.log('--------树节点点击--------', node);
      let param = {
        parameters: [
          [
            {
              "key": "response_data",
              "value": "{\"buttons\":{\"function_buttons\":[{\"button_type\":\"refresh\",\"label\":\"刷新\",\"position\":\"toolbar\"},{\"button_type\":\"expand\",\"label\":\"展开\",\"position\":\"toolbar\"},{\"button_type\":\"compress\",\"label\":\"收缩\",\"position\":\"toolbar\"}],\"contextmenu_buttons\":[{\"button_type\":\"add\",\"label\":\"添加\"},{\"button_type\":\"remove\",\"label\":\"删除\"},{\"button_type\":\"edit\",\"label\":\"编辑\"},{\"button_type\":\"detail\",\"label\":\"明细\"}],\"edit_buttons\":[{\"button_type\":\"close\",\"label\":\"关闭\"},{\"button_type\":\"save\",\"label\":\"保存\"}]},\"display_columns\":{\"id_key\":\"manage_obj_id\",\"name_key\":\"manage_obj_name\",\"root_pid\":\"\",\"root_label\":\"\",\"is_script\":false,\"pid_key\":\"p_manage_obj_id\"},\"sort_columns\":[],\"template_id\":\"741235909520785408\",\"template_type\":\"\",\"result_columns\":[],\"ext_columns\":[],\"orig_display_columns\":[],\"filter_conditions\":[],\"export_columns\":null,\"attrs\":{\"expand\":\"Y\"},\"query_columns\":[],\"datasetKey\":\"form_ManagementObjectCode\",\"unique\":\"manage_obj_id\"}"
            },
            {
              "key": "filter_condition_key",
              "value": ""
            }
          ]
        ]
      }
      if (this.curChange) {
        param.parameters.push({ key: 'Q^p_manage_obj_id^S', value: this.locationDialogProp.toolbarProp.searchData.p_manage_obj_id });
      }
      this.reloadTable(param);
    },
    // 加载树组件数据 (非懒加载)
    dialogloadTreeData (node, resolve, loadDone) {
      /* queryTreeData().then(res=>{
          console.log('--------------树控件数据Dialog-------------', res)
          resolve(res)
          loadDone()
        }) */
        
      if (node.level === 0) {
        queryTreeData({}).then(res => {
          if(res.data != null){
            resolve(res.data);
          }
          loadDone();
        });
      } else {
        queryTreeData(node.data.id).then(res => {
          resolve(res.data);
          loadDone();
        });
      }
    },
    /**
     * 重置
     */
    resetCon () {
      this.locationDialogProp.toolbarProp.searchData.manage_obj_no = ''
      this.locationDialogProp.toolbarProp.searchData.manage_obj_name = ''
    },
    subChange (value) {
      this.curChange = value
    }
  }
};
</script>
<style scoped>
@import url("./dialog.css");
</style>
