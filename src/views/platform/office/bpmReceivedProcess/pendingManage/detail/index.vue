<template>
  <div class="main-container">
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="用户类型" name="user-type">
        <user-type ref="user-type" :identity="identitys.USER_TYPE" :height="height-(height/11)" />
      </el-tab-pane>
      <el-tab-pane label="组织下所属人" name="org-belong">
        <org-belong ref="org-belong" :identity="identitys.ORG_BELONG" :height="height-(height/11)" />
      </el-tab-pane>
      <el-tab-pane label="组织负责人" name="org-principal">
        <org-principal ref="org-principal" :identity="identitys.ORG_PRINCIPAL" :height="height-(height/11)" />
      </el-tab-pane>
      <el-tab-pane label="角色下所属人" name="role-belong">
        <role-belong ref="role-belong" :identity="identitys.ROLE_BELONG" :height="height-(height/11)" />
      </el-tab-pane>
      <el-tab-pane label="岗位下所属人" name="post-belong">
        <post-belong ref="post-belong" :identity="identitys.POST_BELONG" :height="height-(height/11)" />
      </el-tab-pane>
      <el-tab-pane label="用户组所属人" name="group-type">
        <group-type ref="group-type" :identity="identitys.GROUP_TYPE" :height="height-(height/11)" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// 组件
// import FixHeight from '@/mixins/height'
import userType from './user-type'
import orgBelong from './org-belong'
import orgPrincipal from './org-principal'
import roleBelong from './role-belong'
import postBelong from './post-belong'
import groupType from './group-type'
export default {
  components: {
    userType,
    orgBelong,
    orgPrincipal,
    roleBelong,
    postBelong,
    groupType
  },
  // mixins: [FixHeight],
  props: {
    id: {
      type: [String, Number]
    },
    identitys: Object,
    height: Number,
    orgName: String,
    isAuth: {
      type: Boolean,
      default: false
    },
    rowHandle: {
      type: Boolean,
      default: false
    },
    rightsArr: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    showTree: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeName: 'user-type',
      rootName: {
        name: 'user-type'
      }
    }
  },
  watch: {
    activeName: {
      handler: function(val, oldVal) {
        this.rootName.name = val
      },
      deep: true,
      immediate: true
    },
    id: {
      handler: function(val, oldVal) {
        if (this.$utils.isNotEmpty(val)) {
          this.handleTabClick(this.rootName)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.handleTabClick(this.rootName)
  },
  methods: {
    handleTabClick(tab) {
      switch (tab.name) {
        case 'user-type':
          this.$refs['user-type'].loadData(this.id)
          break
        case 'org-belong':
          this.$refs['org-belong'].loadData(this.id)
          break
        case 'org-principal':
          this.$refs['org-principal'].loadData(this.id)
          break
        case 'role-belong':
          this.$refs['role-belong'].loadData(this.id)
          break
        case 'post-belong':
          this.$refs['post-belong'].loadData(this.id)
          break
        case 'group-type':
          this.$refs['group-type'].loadData(this.id)
          break
      }
    }
  }
}
</script>
