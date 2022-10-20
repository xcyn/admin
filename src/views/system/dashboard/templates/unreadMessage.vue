<template>
  <el-card class="box-card tabs-trotting">
    <div slot="header" class="clearfix">
      <span class="tabs-title">
        <ibps-icon name="commenting" />
        <span>{{ title }}</span>
      </span>
      <span class="tabs-toolbar">
        <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
      </span>
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <el-tabs
        v-model="activeName"
        :style="{height:needPage? '85%':'100%',width:'100%'}"
        @tab-click="function(){handleClick({
          'innerMessage':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{PLATFORM_BASE_URL}}/desktop/facade/unread/inner/message' },
          'system':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{PLATFORM_BASE_URL}}/desktop/facade/unread/system/message' }
        })}"
      >
        <el-tab-pane
          v-for="item in [{
            'label':'内部',
            'name':'innerMessage'
          },{
            'label':'系统',
            'name':'system'
          }] "
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
          <ibps-list v-if="data && data.length >0" class="ibps-pr-10">
            <ibps-list-item
              v-for="(d,index) in data"
              :key="index"
              @click.native="handleUnreadMessage(d.id)"
            >
              <ibps-list-item-meta>
                <ibps-icon slot="avatar" name="bolt" style="color:#5cb85c;margin:5px 0 0 5px;" />
                <el-link slot="title" type="primary" :underline="false">{{ d.subject }}</el-link>
                <template slot="description">{{ d.createTime|dateFormat }}</template>
              </ibps-list-item-meta>
              <div slot="extra">
                <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
                {{ d.messageType | filterStatus('unreadMessage') }}
              </div>
            </ibps-list-item>
          </ibps-list>
          <el-alert
            v-else
            :title="$t('common.noData')"
            :closable="false"
            type="warning"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-pagination
      v-if="!loading&&needPage"
      class="doshboard-page"
      :page-size="limit"
      small
      layout="prev, pager, next,jumper,total"
      :total="totalCount"
      @current-change="currentChange"
    />
  </el-card>
</template>
