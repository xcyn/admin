<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    :title="'资源分配'"
    top="5vh"
    class="role-resource-dialog"
    @open="loadData"
    @close="closeDialog"
  >
    <!-- <el-select
      v-model="systemId"
      placeholder="请选择子系统"
      style="width:100%;"
      @change="changeSystem">
      <el-option
        v-for="item in subsystemList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select> -->
    <el-form ref="form">
      <el-row :gutter="100">
        <el-col :span="12">
          <tree
            ref="tree"
            v-loading="dialogLoading"
            :check-strictly="strictly"
            :width="width"
            :height="height"
            :element-loading-text="$t('common.loading')"
            :data="treeData"
            :default-checked-keys="checkedIds"
            :first-check-node="firstCheck"
            @check="checkData"
          />
        </el-col>
        <el-col :span="12">
          <tree
            ref="appTree"
            v-loading="dialogLoading"
            :check-strictly="strictly"
            :width="width"
            :height="height"
            :element-loading-text="$t('common.loading')"
            :data="appTreeData"
            :default-checked-keys="checkedIds"
            :first-check-node="firstCheck"
            @check="checkData"
          />
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { findResTreeCheckedOfTenant as getTreeData } from '@/api/platform/auth/resources'
import { findResTreeCheckedOfTenant as getAppTreeData } from '@/api/platform/auth/appres'
import { saveResourceRelation } from '@/api/saas/tenant/tenant'

// import { findAllSubsystem } from '@/api/platform/auth/subsystem'
import ActionUtils from '@/utils/action'
import Tree from '../components/tree'

export default {
  components: {
    Tree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: Array
  },
  data() {
    return {
      strictly: true,
      firstCheck: true,
      dialogLoading: false,
      dialogVisible: false,
      width: 600,
      height: document.clientHeight,
      // systemId: '',
      // subsystemList: [],

      treeData: [],
      appTreeData: [],
      checkedIds: [],
      toolbars: [
        { key: 'save', label: '保存' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.height = document.body.clientHeight - 210
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    loadData() {
      this.loadTreeData()
    },
    // loadSubsystemData() {
    //   findAllSubsystem().then(response => {
    //     this.subsystemList = response.data
    //     this.systemId = this.subsystemList && this.subsystemList.length > 0 ? this.subsystemList[0].id : ''
    //     this.loadTreeData()
    //   }).catch(() => {
    //     // 异常
    //   })
    // },
    // changeSystem(value) {
    //   this.systemId = value
    //   this.loadTreeData()
    // },
    // 获取tree数据
    loadTreeData() {
      this.dialogLoading = true
      getAppTreeData({
        'tenantId': this.id.length === 1 ? this.id.toString() : ''
      }).then(response => {
        const data = response.data
        const checked = data.filter((d) => {
          return d.checked === 'true'
        })
        this.checkedIds = checked.map((item) => { return item.id })
        this.appTreeData = data
        this.dialogLoading = false
      }).catch(() => {
      // 异常
        this.dialogLoading = false
      })
      getTreeData({
        'systemId': this.$store.getters.systemid,
        'tenantId': this.id.length === 1 ? this.id.toString() : '' }).then(response => {
        const data = response.data
        const checked = data.filter((d) => {
          return d.checked === 'true'
        })
        this.checkedIds = checked.map((item) => { return item.id })
        this.treeData = data
        this.dialogLoading = false
      }).catch(() => {
      // 异常
        this.dialogVisible = false
      })
    },
    // 保存数据
    handleSave() {
      const getCheckedKeysOfRes = this.$refs.tree ? this.$refs.tree.getCheckedKeys() : []
      const getHalfCheckedNodesOfRes = this.$refs.tree ? this.$refs.tree.getHalfCheckedNodes() : []
      getHalfCheckedNodesOfRes.forEach(halfChecked => {
        if (halfChecked.id !== '0') {
          getCheckedKeysOfRes.push(halfChecked.id)
        }
      })

      const getCheckedKeysOfApp = this.$refs.tree ? this.$refs.appTree.getCheckedKeys() : []
      const getHalfCheckedNodesOfApp = this.$refs.tree ? this.$refs.appTree.getHalfCheckedNodes() : []
      getHalfCheckedNodesOfApp.forEach(halfChecked => {
        if (halfChecked.id !== '0') {
          getCheckedKeysOfApp.push(halfChecked.id)
        }
      })

      saveResourceRelation({
        appResourceIds: getCheckedKeysOfApp,
        resourceIds: getCheckedKeysOfRes,
        targetTenantIds: this.id
      }).then(response => {
        ActionUtils.saveSuccessMessage(response.message, r => {
          if (r) {
            this.closeDialog()
          }
        })
      }).catch(() => {
        this.dialogVisible = false
      })
    },
    checkData() {
      this.firstCheck = false
      this.strictly = false
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss">
.role-resource-dialog{
  .el-dialog__body{
    height:  calc(100vh - 200px) !important;
    padding: 0px;
  };
  .el-dialog{
    width: 56%;
  }
}
</style>
