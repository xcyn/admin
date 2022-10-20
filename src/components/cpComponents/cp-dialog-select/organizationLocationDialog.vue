<template>
  <z-dialog-table ref="locationDTable" :title="locationDialogProp.title" :toolbarProp="locationDialogProp.toolbarProp" :tableProp="locationDialogProp.tableProp" :selectionHandle="locationDialogProp.selectionHandle" :treeProp="locationDialogProp.treeProp" @toolbar-search="onSearch" @tree-click="onTreeClick" @ok="onLocationDTableOk" @on-reset="resetCon">
    <template slot="searchBar">
      <el-form-item label="组织编码">
        <el-input v-model="locationDialogProp.toolbarProp.searchData.orgAlias"></el-input>
      </el-form-item>
      <el-form-item label="组织名称">
        <el-input v-model="locationDialogProp.toolbarProp.searchData.name"></el-input>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import {findTreeData, queryPageList} from '@/api/platform/org/org'
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
    id: {
      type: String
    },
    orgAlias: {
      type: String
    },
    name: {
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
        title: '组织信息',
        key: 'id',
        selectionHandle: this.selectionHandle,
        toolbarProp: {
          // 搜索数据
          searchData: {
            id: '',
            orgAlias: '',
            name: '',
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [ // 显示列
            {
              title: '组织Id',
              key: 'id',
              show:false
            },
            {
              title: '组织编码',
              key: 'orgAlias'
            },
            {
              title: '组织名称',
              key: 'name'
            }
          ]
        },
        // 树控件属性
        treeProp: {
          show: true,
          title: '组织树',
          nodeKey: 'title',
          clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
          multipleSelect: false,
          treeData: this.dialogloadTreeData,
          lazyLoad: true,
          propMapping: { // 根据返回值的映射
            label: 'name',
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
            /*{
              "key": "type",
              "param": "1"
            },
            {
              "key": "orgId",
              "param": "0"
            }*/
          ],
          requestPage: {
            limit: 20,
            pageNo: this.pageNo
          }
        }
      } else {
        param_ = param;
      }
      /*if(null != this.initParam){
         if(null!=this.initParam.companyId && this.initParam.companyId != undefined && ""!=this.initParam.companyId){
          param_.parameters.push({ key: 'type', value: this.initParam.companyId })
         }
         if(null!=this.initParam.isOn && this.initParam.isOn != undefined && ""!=this.initParam.isOn){
          param_.parameters.push({ key: 'Q^eq_location.is_on^S', value: this.initParam.isOn })
        }
      }*/
      console.log('param_',param_);
      return queryPageList(param_);
    },
    onSearch (params) {
      console.log('--------搜索条件--------', params);
      let param = {
        parameters: [
        ],
        requestPage: {
          limit: 20,
          pageNo: this.pageNo
        }
      }
      if (params.orgAlias != null && params.orgAlias !== '') {
        param.parameters.push({ key: 'Q^ORG_ALIAS_^SL', value: this.locationDialogProp.toolbarProp.searchData.orgAlias })
      }
      if (params.name != null && params.name !== '') {
        param.parameters.push({ key: 'Q^NAME_^SL', value: this.locationDialogProp.toolbarProp.searchData.name })
      }
      // 加载列表数据
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
      return selection.name;
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

        locaNames += (seleted[index]['column']['name'] || '') + ',';
        locaIds += (seleted[index]['column']['id'] || '') + ',';
        locaNos += (seleted[index]['column']['orgAlias'] || '') + ',';
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
        key: 'id',
        data: []
      }
      if(this.id != undefined && this.name != undefined) {
				let size = this.id.split(',').length;
				for (var i = 0; i < size; i++) {
					selected.data.push({ id: this.id.split(',')[i], text: this.name.split(',')[i] });
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
        parameters: []
      }
      if (this.curChange) {
        param.parameters.push({ key: 'locaId', value: node.locaId });
      } else {
        param.parameters.push({ key: 'path', value: node.locaId });
      }
      this.reloadTable(param);
    },
    // 加载树组件数据 (非懒加载)
    dialogloadTreeData (node, resolve, loadDone) {

      if (node.level === 0) {
        let data = {
              type:1,
              orgId:0
            };
        findTreeData(data).then(res => {
          resolve(res.data);
          loadDone();
        });
      } else {
        let data = {
              type:1,
              orgId:node.data.id
            };
        findTreeData(data).then(res => {
          resolve(res.data);
          loadDone();
        });
      }
    },
    /**
     * 重置
     */
    resetCon () {
      this.locationDialogProp.toolbarProp.searchData.orgAlias = ''
      this.locationDialogProp.toolbarProp.searchData.name = ''
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
