<template>
  <el-card
    v-loading.fullscreen.lock="loading"
    class="box-card tabs-trotting "
    :element-loading-text="$t('common.loading')"
    element-loading-background="transparent"
  >
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" class="trotting-scrollbar" :style="{height:showHeight,width:'100%'}">
      <el-tabs
        v-model="pendingTabActiveName"
        style="height:100%"
        class="pending-Tabs"
        @tab-click="function(){handleTabClick({
          'user-type':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/user2'},
          'org-belong':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/org2' },
          'org-principal':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/org/manager2'},
          'role-belong':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/role2'},
          'post-belong':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/position2'},
          'group-belong':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/group2'}
        })}"
      >
        <el-tab-pane
          v-for="item in [{
                            'label':'用户类型',
                            'name':'user-type'
                          },{
                            'label':'组织下所属人',
                            'name':'org-belong'
                          },{

                            'label':'组织负责人',
                            'name':'org-principal'
                          },
                          {
                            'label':'角色下所属人',
                            'name':'role-belong'
                          },{
                            'label':'岗位下所属人',
                            'name':'post-belong'
                          },{

                            'label':'用户组所属人',
                            'name':'group-belong'
                          }] "
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
          <ibps-trotting-horse-lamp v-if="data && data.length >0" :is-trotting-horse-lamp="isTrottingHorseLamp" :active-name="pendingTabActiveName" :name="item.name" :data="data" @click="d => handleFlowClick({taskId:d.taskId})">
            <div slot="title" slot-scope="data">
              <el-row :gutter="20">
                <el-col :span="2">
                  <template v-if="data.row.remindTimes === 0">
                    <el-avatar style="width:40px;" :src="getPhoto(data.row.instCreatorPhoto)" icon="el-icon-user-solid" @error="errorAvatarHandler">{{ data.row.creator }}</el-avatar>
                  </template>
                  <template v-else>
                    <el-badge :value="data.row.remindTimes" :max="99" class="item">
                      <el-avatar :src="getPhoto(data.row.instCreatorPhoto)" icon="el-icon-user-solid" @error="errorAvatarHandler">{{ data.row.creator }}</el-avatar>
                    </el-badge>
                  </template>
                </el-col>
                <el-col :span="22">
                  <el-link type="primary" :underline="false">{{ data.row.subject|removeHtmlTag }}</el-link>
                  <p style="line-height:10px;margin:0;">{{ data.row.createTime|dateFormat }}</p>
                </el-col>
              </el-row>
            </div>
          </ibps-trotting-horse-lamp>
          <el-alert
            v-else
            :title="$t('common.noData')"
            :closable="false"
            type="warning"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>
